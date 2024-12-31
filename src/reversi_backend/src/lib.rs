use candid::{CandidType, Deserialize};
use ic_cdk::api::caller;
use ic_cdk_macros::{update, query};
use std::cell::RefCell;

const BOARD_SIZE: usize = 8;

#[derive(CandidType, Deserialize, Clone)]
pub struct Position {
    row: u8,
    col: u8,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct GameState {
    board: Vec<Vec<Option<String>>>,
    current_player: String,
    black_count: u8,
    white_count: u8,
    game_over: bool,
}

#[derive(CandidType, Deserialize)]
pub enum MoveResult {
    Success(GameState),
    InvalidMove,
    GameOver,
}

thread_local! {
    static GAME_STATE: RefCell<GameState> = RefCell::new(create_initial_game_state());
}

fn create_initial_game_state() -> GameState {
    let mut board = vec![vec![None; BOARD_SIZE]; BOARD_SIZE];
    let mid = BOARD_SIZE / 2;
    
    board[mid - 1][mid - 1] = Some("white".to_string());
    board[mid - 1][mid] = Some("black".to_string());
    board[mid][mid - 1] = Some("black".to_string());
    board[mid][mid] = Some("white".to_string());

    GameState {
        board,
        current_player: "black".to_string(),
        black_count: 2,
        white_count: 2,
        game_over: false,
    }
}

#[update]
fn create_game() -> GameState {
    let initial_state = create_initial_game_state();
    GAME_STATE.with(|state| {
        *state.borrow_mut() = initial_state.clone();
    });
    initial_state
}

#[query]
fn get_game_state() -> GameState {
    GAME_STATE.with(|state| state.borrow().clone())
}

#[query]
fn get_valid_moves() -> Vec<Position> {
    GAME_STATE.with(|state| {
        let game_state = state.borrow();
        get_valid_moves_for_player(&game_state.board, &game_state.current_player)
    })
}

#[update]
fn make_move(pos: Position) -> MoveResult {
    GAME_STATE.with(|state| {
        let mut game_state = state.borrow_mut();
        
        if game_state.game_over {
            return MoveResult::GameOver;
        }

        if !is_valid_move(&game_state.board, pos.row as usize, pos.col as usize, &game_state.current_player) {
            return MoveResult::InvalidMove;
        }

        let new_board = make_move_on_board(&game_state.board, pos.row as usize, pos.col as usize, &game_state.current_player);
        let next_player = if game_state.current_player == "black" { "white" } else { "black" };
        let (black_count, white_count) = count_pieces(&new_board);

        let has_valid_moves = !get_valid_moves_for_player(&new_board, next_player).is_empty();
        let current_player_can_move = !get_valid_moves_for_player(&new_board, &game_state.current_player).is_empty();
        
        let game_over = !has_valid_moves && !current_player_can_move;
        let actual_next_player = if has_valid_moves { next_player } else { &game_state.current_player };

        let new_state = GameState {
            board: new_board,
            current_player: actual_next_player.to_string(),
            black_count,
            white_count,
            game_over,
        };

        *game_state = new_state.clone();
        MoveResult::Success(new_state)
    })
}

// Helper functions
fn is_valid_move(board: &Vec<Vec<Option<String>>>, row: usize, col: usize, player: &str) -> bool {
    if row >= BOARD_SIZE || col >= BOARD_SIZE || board[row][col].is_some() {
        return false;
    }

    let directions = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ];

    directions.iter().any(|&(dx, dy)| {
        can_flip_in_direction(board, row, col, dx, dy, player)
    })
}

fn can_flip_in_direction(board: &Vec<Vec<Option<String>>>, row: usize, col: usize, dx: i32, dy: i32, player: &str) -> bool {
    let mut x = row as i32 + dx;
    let mut y = col as i32 + dy;
    let mut found_opponent = false;

    while x >= 0 && x < BOARD_SIZE as i32 && y >= 0 && y < BOARD_SIZE as i32 {
        match &board[x as usize][y as usize] {
            None => return false,
            Some(cell_player) if cell_player == player => return found_opponent,
            Some(_) => found_opponent = true,
        }
        x += dx;
        y += dy;
    }
    false
}

fn make_move_on_board(board: &Vec<Vec<Option<String>>>, row: usize, col: usize, player: &str) -> Vec<Vec<Option<String>>> {
    let mut new_board = board.clone();
    new_board[row][col] = Some(player.to_string());

    let directions = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1),
    ];

    for &(dx, dy) in &directions {
        if can_flip_in_direction(board, row, col, dx, dy, player) {
            flip_pieces_in_direction(&mut new_board, row, col, dx, dy, player);
        }
    }

    new_board
}

fn flip_pieces_in_direction(board: &mut Vec<Vec<Option<String>>>, row: usize, col: usize, dx: i32, dy: i32, player: &str) {
    let mut x = row as i32 + dx;
    let mut y = col as i32 + dy;

    while x >= 0 && x < BOARD_SIZE as i32 && y >= 0 && y < BOARD_SIZE as i32 {
        if let Some(cell_player) = &board[x as usize][y as usize] {
            if cell_player == player {
                break;
            }
            board[x as usize][y as usize] = Some(player.to_string());
        }
        x += dx;
        y += dy;
    }
}

fn get_valid_moves_for_player(board: &Vec<Vec<Option<String>>>, player: &str) -> Vec<Position> {
    let mut moves = Vec::new();
    for row in 0..BOARD_SIZE {
        for col in 0..BOARD_SIZE {
            if is_valid_move(board, row, col, player) {
                moves.push(Position {
                    row: row as u8,
                    col: col as u8,
                });
            }
        }
    }
    moves
}

fn count_pieces(board: &Vec<Vec<Option<String>>>) -> (u8, u8) {
    let mut black = 0;
    let mut white = 0;

    for row in board {
        for cell in row {
            if let Some(player) = cell {
                match player.as_str() {
                    "black" => black += 1,
                    "white" => white += 1,
                    _ => {}
                }
            }
        }
    }

    (black, white)
}

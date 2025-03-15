// Chess piece mappings and configurations
export const PIECE_SYMBOLS = {
    'K': '♔',
    'Q': '♕',
    'R': '♖',
    'B': '♗',
    'N': '♘',
    'P': '♙'
};

export const INITIAL_POSITIONS = {
    // Rooks
    'a1': 'R', 'h1': 'R', 'a8': 'R', 'h8': 'R',
    // Knights
    'b1': 'N', 'g1': 'N', 'b8': 'N', 'g8': 'N',
    // Bishops
    'c1': 'B', 'f1': 'B', 'c8': 'B', 'f8': 'B',
    // Queens
    'd1': 'Q', 'd8': 'Q',
    // Kings
    'e1': 'K', 'e8': 'K',
    // All pieces on rank 2 and 7 are pawns
    '2': 'P', '7': 'P'
}; 
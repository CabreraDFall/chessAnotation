export class GameState {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.isWhiteTurn = true;
        this.moveHistory = [];
        this.castlingRights = {
            white: { kingSide: true, queenSide: true },
            black: { kingSide: true, queenSide: true }
        };
        this.enPassantTarget = null;
    }

    initialize(board) {
        this.board = board.map(row => [...row]);
    }

    isSquareUnderAttack(row, col, byWhite) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === (byWhite ? 'white' : 'black')) {
                    if (piece.isValidMove(fromRow, fromCol, row, col, this.board, this)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    updateCastlingRights(piece, fromRow, fromCol) {
        if (piece.notation === 'K') {
            this.castlingRights[piece.color].kingSide = false;
            this.castlingRights[piece.color].queenSide = false;
        }
        // Update rook moves
        if (piece.notation === 'R') {
            if (fromRow === 7 && fromCol === 0) {
                this.castlingRights.white.queenSide = false;
            } else if (fromRow === 7 && fromCol === 7) {
                this.castlingRights.white.kingSide = false;
            } else if (fromRow === 0 && fromCol === 0) {
                this.castlingRights.black.queenSide = false;
            } else if (fromRow === 0 && fromCol === 7) {
                this.castlingRights.black.kingSide = false;
            }
        }
    }

    recordMove(piece, fromRow, fromCol, toRow, toCol) {
        this.moveHistory.push({ piece, fromRow, fromCol, toRow, toCol });
        this.updateEnPassantTarget(piece, fromRow, fromCol, toRow);
        this.updateCastlingRights(piece, fromRow, fromCol);
    }

    updateEnPassantTarget(piece, fromRow, fromCol, toRow) {
        if (piece.notation === '' && Math.abs(fromRow - toRow) === 2) {
            this.enPassantTarget = {
                row: (fromRow + toRow) / 2,
                col: fromCol
            };
        } else {
            this.enPassantTarget = null;
        }
    }
} 
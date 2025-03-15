import { PieceFactory } from './pieces/PieceFactory';

export class PawnPromotionService {
    static PROMOTION_PIECES = ['Q', 'R', 'B', 'N'];

    static shouldPromote(piece, toRow) {
        return piece?.notation === '' && (toRow === 0 || toRow === 7);
    }

    static promotePawn(board, row, col, color, pieceType = 'Q') {
        if (!this.PROMOTION_PIECES.includes(pieceType)) {
            pieceType = 'Q';
        }

        const newPiece = PieceFactory.createPiece(pieceType, color);
        if (!newPiece) {
            return;
        }

        board[row][col] = newPiece;
    }
} 
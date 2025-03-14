import { PieceFactory } from './pieces/PieceFactory';

export class PawnPromotionService {
    static PROMOTION_PIECES = ['Q', 'R', 'B', 'N'];

    static shouldPromote(piece, toRow) {
        return piece?.notation === '' && (toRow === 0 || toRow === 7);
    }

    static promotePawn(board, row, col, color, pieceType = 'Q') {
        if (!this.PROMOTION_PIECES.includes(pieceType)) {
            console.error('Invalid promotion piece type:', pieceType);
            pieceType = 'Q'; // Default to Queen if invalid type
        }

        // Create a new piece using PieceFactory
        const newPiece = PieceFactory.createPiece(pieceType, color);
        if (!newPiece) {
            console.error('Failed to create promotion piece');
            return;
        }

        board[row][col] = newPiece;
    }
} 
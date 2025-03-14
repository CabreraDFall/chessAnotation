import { Pawn } from './Pawn';
import { Rook } from './Rook';
import { Knight } from './Knight';
import { Bishop } from './Bishop';
import { Queen } from './Queen';
import { King } from './King';

export class PieceFactory {
    static createPiece(type, color) {
        switch (type.toUpperCase()) {
            case 'P': return new Pawn(color);
            case 'R': return new Rook(color);
            case 'N': return new Knight(color);
            case 'B': return new Bishop(color);
            case 'Q': return new Queen(color);
            case 'K': return new King(color);
            default: return null;
        }
    }
} 
import { CastlingService } from '../CastlingService';

export class King {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♔' : '♚';
        this.notation = 'K';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board, gameState) {
        console.log('Validating king move:', {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol }
        });

        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        // Normal king move
        if (deltaRow <= 1 && deltaCol <= 1) {
            console.log('Normal king move');
            return true;
        }
        
        // Castling
        if (deltaRow === 0 && deltaCol === 2) {
            console.log('Attempting castling move');
            const canCastle = CastlingService.canCastle(gameState, fromRow, fromCol, toRow, toCol);
            console.log('Castling validation result:', canCastle);
            return canCastle;
        }
        
        console.log('Invalid king move');
        return false;
    }
} 
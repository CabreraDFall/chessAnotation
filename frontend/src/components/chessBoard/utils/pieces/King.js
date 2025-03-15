import { CastlingService } from '../CastlingService';

export class King {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♔' : '♚';
        this.notation = 'K';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board, gameState) {
      
        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        // Normal king move
        if (deltaRow <= 1 && deltaCol <= 1) {
            return true;
        }
        
        // Castling
        if (deltaRow === 0 && deltaCol === 2) {
       
            const canCastle = CastlingService.canCastle(gameState, fromRow, fromCol, toRow, toCol);
          
            return canCastle;
        }
        
     
        return false;
    }
} 
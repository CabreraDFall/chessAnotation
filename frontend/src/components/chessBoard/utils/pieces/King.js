export class King {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♔' : '♚';
        this.notation = 'K';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, gameState) {
        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        // Normal king move
        if (deltaRow <= 1 && deltaCol <= 1) {
            return true;
        }
        
        // Castling
        if (deltaRow === 0 && deltaCol === 2) {
            const castlingRights = gameState.castlingRights[this.color];
            const row = this.color === 'white' ? 7 : 0;
            
            // Kingside castling
            if (toCol === 6 && castlingRights.kingSide) {
                return !gameState.isSquareUnderAttack(row, 4) &&
                       !gameState.isSquareUnderAttack(row, 5) &&
                       !gameState.isSquareUnderAttack(row, 6);
            }
            
            // Queenside castling
            if (toCol === 2 && castlingRights.queenSide) {
                return !gameState.isSquareUnderAttack(row, 4) &&
                       !gameState.isSquareUnderAttack(row, 3) &&
                       !gameState.isSquareUnderAttack(row, 2);
            }
        }
        
        return false;
    }
} 
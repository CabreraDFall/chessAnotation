export class Bishop {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♗' : '♝';
        this.notation = 'B';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board, gameState) {
        if (!board) {
            console.log('Board is undefined in Bishop.isValidMove');
            return false;
        }

        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        // Bishop must move diagonally (equal change in row and column)
        if (deltaRow !== deltaCol || deltaRow === 0) {
            return false;
        }
        
        // Calculate direction (-1, 0, or 1) for row and column movement
        const rowDir = toRow > fromRow ? 1 : -1;
        const colDir = toCol > fromCol ? 1 : -1;
        
        // Check each square along the path
        let currentRow = fromRow + rowDir;
        let currentCol = fromCol + colDir;
        
        while (currentRow !== toRow && currentCol !== toCol) {
            if (board[currentRow][currentCol]) {
                return false; // Path is blocked
            }
            currentRow += rowDir;
            currentCol += colDir;
        }
        
        return true;
    }
} 
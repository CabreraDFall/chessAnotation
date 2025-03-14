export class Rook {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♖' : '♜';
        this.notation = 'R';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        
        // Check path for obstacles
        const rowDir = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
        const colDir = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
        
        let currentRow = fromRow + rowDir;
        let currentCol = fromCol + colDir;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol]) return false;
            currentRow += rowDir;
            currentCol += colDir;
        }
        
        return true;
    }
} 
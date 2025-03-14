export class Queen {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♕' : '♛';
        this.notation = 'Q';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board) {
        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        // Check if move is either like a rook or bishop
        if (!((fromRow === toRow || fromCol === toCol) || deltaRow === deltaCol)) {
            return false;
        }
        
        const rowDir = fromRow === toRow ? 0 : (toRow - fromRow) / deltaRow;
        const colDir = fromCol === toCol ? 0 : (toCol - fromCol) / deltaCol;
        
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
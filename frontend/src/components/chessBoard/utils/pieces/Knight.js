export class Knight {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♘' : '♞';
        this.notation = 'N';
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        return (deltaRow === 2 && deltaCol === 1) || (deltaRow === 1 && deltaCol === 2);
    }
} 
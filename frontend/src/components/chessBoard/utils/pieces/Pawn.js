export class Pawn {
    constructor(color) {
        this.color = color;
        this.symbol = color === 'white' ? '♙' : '♟';
        this.notation = '';
    }

    isValidMove(fromRow, fromCol, toRow, toCol, board, gameState) {
        if (!board) return false;
        
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;
        const targetPiece = board[toRow][toCol];

        // Normal move forward
        if (fromCol === toCol && !targetPiece) {
            if (toRow === fromRow + direction) return true;
            // First move can be 2 squares
            if (fromRow === startRow && 
                toRow === fromRow + 2 * direction && 
                !board[fromRow + direction][fromCol]) {
                return true;
            }
        }

        // Capture diagonally
        if (Math.abs(fromCol - toCol) === 1 && 
            toRow === fromRow + direction && 
            targetPiece) {
            return true;
        }

        // En passant
        if (gameState.enPassantTarget && 
            Math.abs(fromCol - toCol) === 1 && 
            toRow === fromRow + direction &&
            toRow === gameState.enPassantTarget.row &&
            toCol === gameState.enPassantTarget.col) {
            return true;
        }

        return false;
    }
} 
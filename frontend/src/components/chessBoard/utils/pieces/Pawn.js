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

        // Capture diagonally (check this first)
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
            // Regular capture
            if (targetPiece && targetPiece.color !== this.color) {
                return true;
            }
            
            // En passant capture
            if (gameState.enPassantTarget &&
                toRow === gameState.enPassantTarget.row &&
                toCol === gameState.enPassantTarget.col) {
                return true;
            }
        }

        // Cannot move forward if blocked
        if (targetPiece) return false;

        // Normal move forward
        if (fromCol === toCol) {
            // Single square move
            if (toRow === fromRow + direction) {
                return true;
            }
            // First move can be 2 squares
            if (fromRow === startRow && 
                toRow === fromRow + 2 * direction && 
                !board[fromRow + direction][fromCol]) {
                return true;
            }
        }

        return false;
    }
} 
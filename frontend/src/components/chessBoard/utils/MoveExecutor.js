import { PawnPromotionService } from './PawnPromotionService';

export class MoveExecutor {
    static executeMove(fromRow, fromCol, toRow, toCol, gameState) {
        const piece = gameState.board[fromRow][fromCol];
        
        console.log('Executing move:', {
            piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol }
        });

        // Execute en passant if applicable
        if (this.isEnPassant(piece, fromCol, toCol, gameState)) {
            this.executeEnPassant(gameState.board, fromRow, toCol);
        }

        // Execute the main move
        gameState.board[toRow][toCol] = piece;
        gameState.board[fromRow][fromCol] = null;

        // Check for pawn promotion
        if (this.isPawnPromotion(piece, toRow)) {
            console.log('Promoting pawn at:', toRow, toCol);
            this.executePawnPromotion(gameState.board, toRow, toCol, piece.color);
        }

        // Execute castling if applicable (after main move)
        if (this.isCastling(piece, fromCol, toCol)) {
            this.executeCastling(gameState.board, fromRow, toCol);
        }

        // Record the move
        gameState.recordMove(piece, fromRow, fromCol, toRow, toCol);

        console.log('Move executed:', {
            newPosition: gameState.board[toRow][toCol],
            oldPosition: gameState.board[fromRow][fromCol]
        });
    }

    static createNewBoard(board) {
        return board.map(row => [...row]);
    }

    static isCastling(piece, fromCol, toCol) {
        return piece?.notation === 'K' && Math.abs(fromCol - toCol) === 2;
    }

    static executeCastling(board, row, toCol) {
        // Kingside castling
        if (toCol === 6) {
            board[row][5] = board[row][7]; // Move rook
            board[row][7] = null;
        } 
        // Queenside castling
        else if (toCol === 2) {
            board[row][3] = board[row][0]; // Move rook
            board[row][0] = null;
        }
    }

    static isEnPassant(piece, fromCol, toCol, gameState) {
        return piece?.notation === '' && // Is pawn
               Math.abs(fromCol - toCol) === 1 && // Diagonal move
               gameState.enPassantTarget && // En passant target exists
               toCol === gameState.enPassantTarget.col;
    }

    static executeEnPassant(board, fromRow, toCol) {
        // Remove captured pawn
        board[fromRow][toCol] = null;
    }

    static isPawnPromotion(piece, toRow) {
        return PawnPromotionService.shouldPromote(piece, toRow);
    }

    static executePawnPromotion(board, row, col, color) {
        PawnPromotionService.promotePawn(board, row, col, color, 'Q');
    }
} 
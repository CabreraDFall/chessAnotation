export class MoveExecutor {
    static executeMove(fromRow, fromCol, toRow, toCol, gameState) {
        const piece = gameState.board[fromRow][fromCol];
        
        console.log('Executing move:', {
            piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol }
        });

        // Execute castling if applicable
        if (this.isCastling(piece, fromCol, toCol)) {
            this.executeCastling(gameState.board, fromRow, toCol);
        }

        // Execute en passant if applicable
        if (this.isEnPassant(piece, fromCol, toCol, gameState)) {
            this.executeEnPassant(gameState.board, fromRow, toCol);
        }

        // Execute the main move
        gameState.board[toRow][toCol] = piece;
        gameState.board[fromRow][fromCol] = null;

        if (this.isPawnPromotion(piece, toRow)) {
            this.executePawnPromotion(gameState.board, toRow, toCol, piece.color);
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
        return piece?.notation === '' && (toRow === 0 || toRow === 7);
    }

    static executePawnPromotion(board, row, col, color) {
        // Default promote to Queen
        board[row][col] = {
            color: color,
            symbol: color === 'white' ? '♕' : '♛',
            notation: 'Q'
        };
    }
} 
export class CheckService {
    static isKingInCheck(gameState, color) {
        // Find king position
        const kingPos = this.findKing(gameState.board, color);
        if (!kingPos) {
            console.log('King not found for color:', color);
            return false;
        }

        // Check if any opponent piece can attack the king
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(gameState, kingPos.row, kingPos.col, opponentColor);
    }

    static isCheckmate(gameState, color) {
        // First check if king is in check
        if (!this.isKingInCheck(gameState, color)) {
            return false;
        }

        // Try all possible moves for all pieces
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = gameState.board[fromRow][fromCol];
                if (!piece || piece.color !== color) continue;

                // Try all possible destinations
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (this.canMovePreventCheck(gameState, fromRow, fromCol, toRow, toCol)) {
                            console.log(`Checkmate prevented by moving piece at ${fromRow},${fromCol} to ${toRow},${toCol}`);
                            return false;
                        }
                    }
                }
            }
        }

        console.log(`Checkmate! ${color} king is in checkmate`);
        return true;
    }

    static findKing(board, color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.notation === 'K' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    static isSquareUnderAttack(gameState, targetRow, targetCol, attackingColor) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece && piece.color === attackingColor) {
                    if (piece.isValidMove(row, col, targetRow, targetCol, gameState.board, gameState)) {
                        console.log(`Square ${targetRow},${targetCol} is under attack by ${piece.notation} at ${row},${col}`);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static canMovePreventCheck(gameState, fromRow, fromCol, toRow, toCol) {
        // Create a deep copy of the game state
        const tempGameState = this.createGameStateCopy(gameState);
        
        // Try the move
        const piece = tempGameState.board[fromRow][fromCol];
        if (!piece || !piece.isValidMove(fromRow, fromCol, toRow, toCol, tempGameState.board, tempGameState)) {
            return false;
        }

        // Execute move on temporary board
        tempGameState.board[toRow][toCol] = tempGameState.board[fromRow][fromCol];
        tempGameState.board[fromRow][fromCol] = null;

        // Check if king is still in check after move
        return !this.isKingInCheck(tempGameState, piece.color);
    }

    static createGameStateCopy(gameState) {
        // Ensure we're creating a proper copy with all necessary properties
        const newGameState = {
            board: gameState.board.map(row => [...row]),
            isWhiteTurn: gameState.isWhiteTurn,
            castlingRights: JSON.parse(JSON.stringify(gameState.castlingRights)),
            enPassantTarget: gameState.enPassantTarget ? {...gameState.enPassantTarget} : null,
            moveHistory: [...(gameState.moveHistory || [])]
        };
        return newGameState;
    }
} 
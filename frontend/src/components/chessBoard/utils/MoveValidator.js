export class MoveValidator {
    static isValidMove(fromRow, fromCol, toRow, toCol, gameState) {
        const piece = gameState.board[fromRow][fromCol];
        
        console.log('Validating move:', {
            piece,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol }
        });

        if (!piece) {
            console.log('No piece at source position');
            return false;
        }

        // Check if it's the correct turn
        if ((gameState.isWhiteTurn && piece.color !== 'white') || 
            (!gameState.isWhiteTurn && piece.color !== 'black')) {
            console.log('Wrong turn');
            return false;
        }

        // Check destination square for same color piece
        const targetPiece = gameState.board[toRow][toCol];
        if (targetPiece && targetPiece.color === piece.color) {
            console.log('Cannot capture own piece');
            return false;
        }

        // Check if king is in check
        if (this.isKingInCheck(gameState, piece.color)) {
            console.log('King is in check, validating defensive move');
            return this.isValidDefensiveMove(fromRow, fromCol, toRow, toCol, gameState);
        }

        // Basic validation for normal moves
        if (!this.isWithinBounds(toRow, toCol)) {
            console.log('Move out of bounds');
            return false;
        }

        if (this.isCapturingSameColor(piece, gameState.board[toRow][toCol])) {
            console.log('Cannot capture own piece');
            return false;
        }

        // Check if move would put own king in check
        if (this.moveExposesKing(fromRow, fromCol, toRow, toCol, gameState)) {
            console.log('Move would expose king to check');
            return false;
        }

        return piece.isValidMove(fromRow, fromCol, toRow, toCol, gameState.board, gameState);
    }

    static isValidDefensiveMove(fromRow, fromCol, toRow, toCol, gameState) {
        const piece = gameState.board[fromRow][fromCol];
        
        // Create a temporary game state to test the move
        const tempGameState = this.createGameStateCopy(gameState);
        
        // Execute the move on temporary board
        tempGameState.board[toRow][toCol] = tempGameState.board[fromRow][fromCol];
        tempGameState.board[fromRow][fromCol] = null;

        // Check if the move resolves the check
        if (this.isKingInCheck(tempGameState, piece.color)) {
            console.log('Move does not resolve check');
            return false;
        }

        // Verify if the move is one of three valid defensive options:
        // 1. Move the king to a safe square
        if (piece.notation === 'K') {
            console.log('Attempting to move king to safety');
            return piece.isValidMove(fromRow, fromCol, toRow, toCol, gameState.board, gameState);
        }

        // 2. Capture the attacking piece
        const attackingPieces = this.findAttackingPieces(gameState, piece.color);
        for (const attacker of attackingPieces) {
            if (toRow === attacker.row && toCol === attacker.col) {
                console.log('Attempting to capture attacking piece');
                return piece.isValidMove(fromRow, fromCol, toRow, toCol, gameState.board, gameState);
            }
        }

        // 3. Block the attack path
        if (this.isBlockingCheck(fromRow, fromCol, toRow, toCol, gameState, attackingPieces)) {
            console.log('Attempting to block check');
            return piece.isValidMove(fromRow, fromCol, toRow, toCol, gameState.board, gameState);
        }

        console.log('Move does not defend against check');
        return false;
    }

    static findAttackingPieces(gameState, defendingColor) {
        const attackers = [];
        const kingPos = this.findKing(gameState.board, defendingColor);
        const attackingColor = defendingColor === 'white' ? 'black' : 'white';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece && piece.color === attackingColor) {
                    if (piece.isValidMove(row, col, kingPos.row, kingPos.col, gameState.board, gameState)) {
                        attackers.push({ row, col, piece });
                    }
                }
            }
        }

        return attackers;
    }

    static isBlockingCheck(fromRow, fromCol, toRow, toCol, gameState, attackers) {
        const kingPos = this.findKing(gameState.board, gameState.board[fromRow][fromCol].color);
        
        for (const attacker of attackers) {
            // Check if the move position is between the king and the attacker
            if (this.isSquareInAttackPath(
                attacker.row, attacker.col,
                kingPos.row, kingPos.col,
                toRow, toCol
            )) {
                return true;
            }
        }
        return false;
    }

    static isSquareInAttackPath(attackerRow, attackerCol, kingRow, kingCol, moveRow, moveCol) {
        // Calculate direction vectors
        const rowDir = Math.sign(kingRow - attackerRow);
        const colDir = Math.sign(kingCol - attackerCol);
        
        // Check if the move is in the path between attacker and king
        let currentRow = attackerRow + rowDir;
        let currentCol = attackerCol + colDir;
        
        while (currentRow !== kingRow || currentCol !== kingCol) {
            if (currentRow === moveRow && currentCol === moveCol) {
                return true;
            }
            currentRow += rowDir;
            currentCol += colDir;
        }
        
        return false;
    }

    static isKingInCheck(gameState, color) {
        const kingPos = this.findKing(gameState.board, color);
        if (!kingPos) return false;

        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(gameState, kingPos.row, kingPos.col, opponentColor);
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

    static isWithinBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    static isCapturingSameColor(piece, targetPiece) {
        return targetPiece && targetPiece.color === piece.color;
    }

    static moveExposesKing(fromRow, fromCol, toRow, toCol, gameState) {
        const tempGameState = this.createGameStateCopy(gameState);
        const piece = tempGameState.board[fromRow][fromCol];
        
        // Execute move on temporary board
        tempGameState.board[toRow][toCol] = tempGameState.board[fromRow][fromCol];
        tempGameState.board[fromRow][fromCol] = null;
        
        return this.isKingInCheck(tempGameState, piece.color);
    }

    static createGameStateCopy(gameState) {
        return {
            board: gameState.board.map(row => [...row]),
            isWhiteTurn: gameState.isWhiteTurn,
            castlingRights: JSON.parse(JSON.stringify(gameState.castlingRights)),
            enPassantTarget: gameState.enPassantTarget ? {...gameState.enPassantTarget} : null
        };
    }
} 
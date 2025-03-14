export class CastlingService {
    static canCastle(gameState, fromRow, fromCol, toRow, toCol) {
        const piece = gameState.board[fromRow][fromCol];
        console.log('Checking castling conditions:', {
            piece,
            fromPos: { row: fromRow, col: fromCol },
            toPos: { row: toRow, col: toCol },
            castlingRights: gameState.castlingRights[piece?.color]
        });

        if (!piece || piece.notation !== 'K') {
            console.log('Not a king piece');
            return false;
        }

        const castlingRights = gameState.castlingRights[piece.color];
        const row = piece.color === 'white' ? 7 : 0;
        
        // Ensure basic castling conditions are met
        if (fromRow !== row || fromCol !== 4 || toRow !== row) {
            console.log('Basic position conditions not met:', {
                expectedRow: row,
                expectedFromCol: 4,
                actual: { fromRow, fromCol, toRow }
            });
            return false;
        }
        
        // Check if king is in check
        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        if (gameState.isSquareUnderAttack(row, 4, opponentColor)) {
            console.log('King is in check, cannot castle');
            return false;
        }

        // Kingside castling
        if (toCol === 6 && castlingRights.kingSide) {
            console.log('Attempting kingside castle');
            return this.canKingsideCastle(gameState, row, piece.color);
        }
        
        // Queenside castling
        if (toCol === 2 && castlingRights.queenSide) {
            console.log('Attempting queenside castle');
            return this.canQueensideCastle(gameState, row, piece.color);
        }

        console.log('Invalid castling attempt:', { toCol, castlingRights });
        return false;
    }

    static canKingsideCastle(gameState, row, color) {
        // Check if squares between king and rook are empty
        if (gameState.board[row][5] || gameState.board[row][6]) {
            console.log('Path blocked for kingside castle');
            return false;
        }
        
        // Check if rook is in correct position
        const rook = gameState.board[row][7];
        if (!rook || rook.notation !== 'R' || rook.color !== color) {
            console.log('Rook not in correct position for kingside castle:', { rook });
            return false;
        }
        
        // Check if path squares are under attack
        const opponentColor = color === 'white' ? 'black' : 'white';
        const pathUnderAttack = gameState.isSquareUnderAttack(row, 5, opponentColor) ||
                               gameState.isSquareUnderAttack(row, 6, opponentColor);
        
        if (pathUnderAttack) {
            console.log('Path squares under attack for kingside castle');
            return false;
        }

        console.log('Kingside castle is valid');
        return true;
    }

    static canQueensideCastle(gameState, row, color) {
        // Check if squares between king and rook are empty
        if (gameState.board[row][1] || gameState.board[row][2] || gameState.board[row][3]) {
            console.log('Path blocked for queenside castle');
            return false;
        }
        
        // Check if rook is in correct position
        const rook = gameState.board[row][0];
        if (!rook || rook.notation !== 'R' || rook.color !== color) {
            console.log('Rook not in correct position for queenside castle:', { rook });
            return false;
        }
        
        // Check if path squares are under attack
        const opponentColor = color === 'white' ? 'black' : 'white';
        const pathUnderAttack = gameState.isSquareUnderAttack(row, 2, opponentColor) ||
                               gameState.isSquareUnderAttack(row, 3, opponentColor);
        
        if (pathUnderAttack) {
            console.log('Path squares under attack for queenside castle');
            return false;
        }

        console.log('Queenside castle is valid');
        return true;
    }
} 
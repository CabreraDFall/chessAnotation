import { CheckService } from './CheckService';

export class CastlingService {
    static canCastle(gameState, fromRow, fromCol, toRow, toCol) {
        const piece = gameState.board[fromRow][fromCol];

        if (!piece || piece.notation !== 'K') {
            return false;
        }

        const castlingRights = gameState.castlingRights[piece.color];
        const row = piece.color === 'white' ? 7 : 0;
        
        if (fromRow !== row || fromCol !== 4 || toRow !== row) {
            return false;
        }
        
        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        if (CheckService.isSquareUnderAttack(gameState, row, 4, opponentColor)) {
            return false;
        }

        if (toCol === 6 && castlingRights.kingSide) {
            return this.canKingsideCastle(gameState, row, piece.color);
        }
        
        if (toCol === 2 && castlingRights.queenSide) {
            return this.canQueensideCastle(gameState, row, piece.color);
        }

        return false;
    }

    static canKingsideCastle(gameState, row, color) {
        if (gameState.board[row][5] || gameState.board[row][6]) {
            return false;
        }
        
        const rook = gameState.board[row][7];
        if (!rook || rook.notation !== 'R' || rook.color !== color) {
            return false;
        }
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        const pathUnderAttack = CheckService.isSquareUnderAttack(gameState, row, 5, opponentColor) ||
                               CheckService.isSquareUnderAttack(gameState, row, 6, opponentColor);
        
        if (pathUnderAttack) {
            return false;
        }

        return true;
    }

    static canQueensideCastle(gameState, row, color) {
        if (gameState.board[row][1] || gameState.board[row][2] || gameState.board[row][3]) {
            return false;
        }
        
        const rook = gameState.board[row][0];
        if (!rook || rook.notation !== 'R' || rook.color !== color) {
            return false;
        }
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        const pathUnderAttack = CheckService.isSquareUnderAttack(gameState, row, 2, opponentColor) ||
                               CheckService.isSquareUnderAttack(gameState, row, 3, opponentColor);
        
        if (pathUnderAttack) {
            return false;
        }

        return true;
    }
} 
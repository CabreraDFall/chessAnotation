import { PIECE_SYMBOLS, INITIAL_POSITIONS } from '../constants';

export class NotationConverter {
    static identifyPiece(file, rank) {
        return INITIAL_POSITIONS[`${file}${rank}`] || INITIAL_POSITIONS[rank] || null;
    }

    static lastPosition = null;

    static convertToStandardNotation(move, boardState) {
        // Check if move is an object with notation property
        const moveNotation = typeof move === 'object' ? move.notation : move;
        
        if (!moveNotation || typeof moveNotation !== 'string') {
            console.warn('Invalid move format:', move);
            return '';
        }

        // Only log if the board position has actually changed
        const boardString = boardState ? JSON.stringify(boardState) : '';
        if (boardString !== this.lastPosition) {
            this.lastPosition = boardString;
            this.logBoardPosition(boardState);
        }

        if (moveNotation.length < 4) return moveNotation;

        const [fromFile, fromRank, toFile, toRank, promotion] = moveNotation.split('');
        
        // Convert file/rank to array indices
        const fromRow = 8 - parseInt(fromRank);
        const fromCol = fromFile.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(toRank);
        const toCol = toFile.charCodeAt(0) - 'a'.charCodeAt(0);
        
        // Get the moving piece from boardState
        const movingPiece = boardState ? boardState[fromRow][fromCol] : null;
        const pieceType = movingPiece ? movingPiece.notation : this.identifyPiece(fromFile, fromRank);
        
        // Add a cache check to prevent multiple logs of the same move
        const moveKey = `${fromFile}${fromRank}-${toFile}${toRank}`;
        if (!this.lastLoggedMove || this.lastLoggedMove !== moveKey) {
            this.lastLoggedMove = moveKey;
        }
        
        // Handle castling
        if (pieceType === 'K' && fromFile === 'e') {
            if (toFile === 'g') return 'O-O';
            if (toFile === 'c') return 'O-O-O';
        }

        let notation = '';
        
        // Add piece symbol for non-pawns
        if (pieceType && pieceType !== 'P') {
            notation += PIECE_SYMBOLS[pieceType];
        }

        // For pawns, show the file when capturing
        if (pieceType === 'P' && toFile !== fromFile) {
            notation += fromFile;
        }

        // Add capture symbol (×) for captures
        const targetPiece = boardState ? boardState[toRow][toCol] : null;
        const isCapture = targetPiece !== null || (pieceType === 'P' && fromFile !== toFile);
        if (isCapture) {
            notation += '×';
        }

        // Add destination square
        notation += `${toFile}${toRank}`;

        // Handle promotion
        if (promotion) {
            notation += `=${PIECE_SYMBOLS[promotion.toUpperCase()]}`;
        }

        // Add check/checkmate symbols
        if (boardState && movingPiece) {
            const opponentColor = movingPiece.color === 'white' ? 'black' : 'white';
            const isCheck = this.isKingInCheck(boardState, opponentColor);
            
            if (isCheck) {
                // Create a temporary board to test for checkmate
                const tempBoard = this.createBoardCopy(boardState);
                tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
                tempBoard[fromRow][fromCol] = null;
                
                const isCheckmate = this.isCheckmate(tempBoard, opponentColor);
                notation += isCheckmate ? '‡' : '+';
            }
        }

        return notation;
    }

    static createBoardCopy(board) {
        return board.map(row => [...row]);
    }

    static isKingInCheck(boardState, color) {
        const kingPos = this.findKingPosition(boardState, color);
        if (!kingPos) return false;

        return this.isSquareUnderAttack(boardState, kingPos.row, kingPos.col, color === 'white' ? 'black' : 'white');
    }

    static findKingPosition(boardState, color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardState[row][col];
                if (piece && piece.notation === 'K' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    static isSquareUnderAttack(boardState, targetRow, targetCol, attackingColor) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardState[row][col];
                if (piece && piece.color === attackingColor) {
                    if (piece.isValidMove(row, col, targetRow, targetCol, boardState)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static isCheckmate(boardState, color) {
        if (!this.isKingInCheck(boardState, color)) {
            return false;
        }

        // Try all possible moves for all pieces
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = boardState[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (piece.isValidMove(fromRow, fromCol, toRow, toCol, boardState)) {
                                const tempBoard = this.createBoardCopy(boardState);
                                tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
                                tempBoard[fromRow][fromCol] = null;
                                if (!this.isKingInCheck(tempBoard, color)) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    static logBoardPosition(boardState) {
        if (!boardState) return;
        
        const boardDisplay = [];
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        boardDisplay.push('   ' + files.join(' '));
        boardDisplay.push('   ' + '─'.repeat(15));

        for (let i = 0; i < 8; i++) {
            let row = ranks[i] + ' │';
            for (let j = 0; j < 8; j++) {
                const piece = boardState[i][j];
                row += ' ' + (piece ? piece.symbol : '·');
            }
            boardDisplay.push(row);
        }

       
    }
} 
export class NotationConverter {
    static convertMove(move, boardState) {
        if (!move || !move.notation) return '';

        const from = move.notation.substring(0, 2);
        const to = move.notation.substring(2, 4);
        
        // Convert coordinates to ranks and files
        const fromFile = from[0];
        const fromRank = from[1];
        const toFile = to[0];
        const toRank = to[1];
        
        // Get piece type from the piece object
        const pieceType = move.piece?.notation || '';
        
        // Handle castling
        if (pieceType === 'K' && Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0)) === 2) {
            const baseNotation = toFile === 'g' ? 'O-O' : 'O-O-O';
            return this.addCheckAndMateSymbols(baseNotation, move.isCheck, move.isCheckmate);
        }
        
        let notation = '';
        
        // For pieces other than pawns, add the piece letter
        if (pieceType && pieceType !== '') {
            notation += pieceType;
        }
        
        // For captures
        if (move.isCapture) {
            // For pawn captures, include the starting file
            if (!pieceType || pieceType === '') {
                notation += fromFile;
            }
            notation += 'x';
        }
        
        // Add destination square
        notation += toFile + toRank;

        // Add promotion notation if applicable
        if (pieceType === '' && (toRank === '1' || toRank === '8')) {
            notation += '=Q'; // Default to Queen promotion
        }
        
        // Add check (+) or checkmate (#) symbols
        return this.addCheckAndMateSymbols(notation, move.isCheck, move.isCheckmate);
    }

    static addCheckAndMateSymbols(notation, isCheck, isCheckmate) {
        if (isCheckmate) {
            return notation + '#';
        } else if (isCheck) {
            return notation + '+';
        }
        return notation;
    }
}

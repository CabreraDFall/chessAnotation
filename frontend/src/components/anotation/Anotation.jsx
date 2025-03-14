import './Anotation.css';

const Anotation = ({ moves = [] }) => {
    // Convert piece letter to symbol
    const pieceToSymbol = {
        'K': '♚',
        'Q': '♛',
        'R': '♜',
        'B': '♝',
        'N': '♞',
        'P': '♟'
    };

    // Identify piece type based on starting position and current board state
    const identifyPiece = (file, rank) => {
        // Starting positions for pieces
        const positions = {
            // Rooks
            'a1': 'R', 'h1': 'R', 'a8': 'R', 'h8': 'R',
            // Knights
            'b1': 'N', 'g1': 'N', 'b8': 'N', 'g8': 'N',
            // Bishops
            'c1': 'B', 'f1': 'B', 'c8': 'B', 'f8': 'B',
            // Queens
            'd1': 'Q', 'd8': 'Q',
            // Kings
            'e1': 'K', 'e8': 'K',
            // All pieces on rank 2 and 7 are pawns
            '2': 'P', '7': 'P'
        };

        return positions[`${file}${rank}`] || positions[rank] || null;
    };

    // Convert long algebraic notation to standard notation
    const convertToStandardNotation = (move) => {
        if (!move || move.length !== 4) return move;

        const fromFile = move[0];
        const fromRank = move[1];
        const toFile = move[2];
        const toRank = move[3];

        // Identify the piece being moved
        const pieceType = identifyPiece(fromFile, fromRank);
        let notation = '';

        // Handle castling
        if (pieceType === 'K' && fromFile === 'e') {
            if (toFile === 'g') return 'O-O';
            if (toFile === 'c') return 'O-O-O';
        }

        // Add piece symbol for non-pawns
        if (pieceType && pieceType !== 'P') {
            notation += pieceToSymbol[pieceType];
        }

        // Handle captures
        // TODO: Implement proper capture detection using board state
        // For now, we'll just add the destination without assuming captures
        notation += `${toFile}${toRank}`;

        return notation;
    };

    // Group moves into pairs for white and black
    const groupedMoves = moves.reduce((acc, move, index) => {
        const standardNotation = convertToStandardNotation(move);
        if (index % 2 === 0) {
            acc.push({ white: standardNotation, black: '' });
        } else {
            acc[Math.floor(index / 2)].black = standardNotation;
        }
        return acc;
    }, []);

    return (
        <div className='anotation-wrapper'>
            <h3>Anotaciones</h3>
            <div className='anotation-container'>
                <div className='moves-section'>
                    {groupedMoves.map((move, index) => (
                        <div key={index} className='move-row'>
                            <span className='move-number'>{index + 1}.</span>
                            <span className='move'>{move.white}</span>
                            <span className='move'>{move.black}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Anotation;   

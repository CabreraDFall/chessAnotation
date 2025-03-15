import './Anotation.css';
import { NotationConverter } from './utils/notationConverter';
import { MoveRow } from './components/MoveRow';

const Anotation = ({ moves = [], boardState }) => {
    // Add console log to show incoming moves
    console.log('Received Moves:', moves);
    
    // Group moves into pairs (white and black moves)
    const groupedMoves = moves.reduce((acc, move, index) => {
        // Convert the move notation to standard chess notation
        const standardNotation = move.notation;
        const convertedNotation = NotationConverter.convertMove(move, boardState);
        
        console.log(`Move ${index + 1}:`, {
            raw: move,
            standardNotation: standardNotation,
            convertedNotation: convertedNotation,
            piece: move.piece,
            isCapture: move.isCapture
        });
        
        if (index % 2 === 0) {
            // White's move
            acc.push({ white: convertedNotation || standardNotation, black: '' });
        } else {
            // Black's move - update the last pair
            acc[Math.floor(index / 2)].black = convertedNotation || standardNotation;
        }
        return acc;
    }, []);

    console.log('Grouped Moves:', groupedMoves);

    return (
        <div className='anotation-wrapper'>
            <h3>Annotations</h3>
            <div className='anotation-container'>
                <div className='moves-section'>
                    {groupedMoves.length > 0 ? (
                        groupedMoves.map((move, index) => (
                            <MoveRow
                                key={index}
                                moveNumber={index + 1}
                                whiteMove={move.white}
                                blackMove={move.black}
                            />
                        ))
                    ) : (
                        <div className="no-moves">No moves yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Anotation;   

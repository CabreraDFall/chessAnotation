import './Anotation.css';
import { NotationConverter } from './utils/notationConverter';
import { MoveRow } from './components/MoveRow';

const Anotation = ({ moves = [], boardState }) => {
    console.log(moves);
    const groupedMoves = moves.reduce((acc, move, index) => {
        const standardNotation = NotationConverter.convertToStandardNotation(
            move.notation, 
            boardState,
            move.isCapture
        );
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
                        <MoveRow
                            key={index}
                            moveNumber={index + 1}
                            whiteMove={move.white}
                            blackMove={move.black}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Anotation;   

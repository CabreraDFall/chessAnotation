import './Anotation.css';

const Anotation = ({ moves = [] }) => {
    const symbols = [
        { symbol: '!', description: 'Buena' },
        { symbol: '!!', description: 'Brillante' },
        { symbol: '?', description: 'Error' },
        { symbol: '??', description: 'Error grave' },
        { symbol: '!?', description: 'Interesante' },
        { symbol: '?!', description: 'Cuestionable' },
    ];

    // Group moves into pairs for white and black
    const groupedMoves = moves.reduce((acc, move, index) => {
        if (index % 2 === 0) {
            acc.push({ white: move, black: '' });
        } else {
            acc[Math.floor(index / 2)].black = move;
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
                <div className='symbols-section'>
                    <h4>Símbolos</h4>
                    <div className='symbols-list'>
                        {symbols.map((item, index) => (
                            <div key={index} className='symbol-row'>
                                <span className='symbol'>{item.symbol}</span>
                                <span className='description'>{item.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Anotation;   

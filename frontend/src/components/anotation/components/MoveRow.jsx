export const MoveRow = ({ moveNumber, whiteMove, blackMove }) => (
    <div className='move-row'>
        <span className='move-number'>{moveNumber}.</span>
        <span className='move'>{whiteMove}</span>
        <span className='move'>{blackMove}</span>
    </div>
); 
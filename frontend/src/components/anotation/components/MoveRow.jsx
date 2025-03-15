export const MoveRow = ({ moveNumber, whiteMove, blackMove }) => (
    <div className='move-row'>
        <span className='move-number'>{moveNumber}.</span>
        <span className='move white-move'>{whiteMove}</span>
        {blackMove && <span className='move black-move'>{blackMove}</span>}
    </div>
); 
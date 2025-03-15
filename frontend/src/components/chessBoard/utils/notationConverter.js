// Add capture symbol (×) when moving to a square that has a piece
const targetPiece = boardState ? boardState[toRow][toCol] : null;
const isCapture = targetPiece !== null || (pieceType === 'P' && fromFile !== toFile);
if (isCapture) {
    notation += '×';
} 
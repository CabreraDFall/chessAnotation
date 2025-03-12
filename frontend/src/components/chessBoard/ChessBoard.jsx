import { useState } from 'react';
import './ChessBoard.css';

const ChessBoard = ({ onMove }) => {
    // Initial chess board setup
    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isWhiteTurn, setIsWhiteTurn] = useState(true); // Track turns
    const [moveHistory, setMoveHistory] = useState([]); // Track moves for en passant
    const [castlingRights, setCastlingRights] = useState({
        whiteKingMoved: false,
        blackKingMoved: false,
        whiteRookAMoved: false,
        whiteRookHMoved: false,
        blackRookAMoved: false,
        blackRookHMoved: false
    });
    
    // Helper function to check if a piece is white
    const isWhitePiece = (piece) => piece && piece.toUpperCase() === piece;
    
    // Check if a move is valid for a specific piece
    const isValidMove = (fromRow, fromCol, toRow, toCol) => {
        const piece = board[fromRow][fromCol];
        const targetPiece = board[toRow][toCol];
        
        // Can't capture your own pieces
        if (targetPiece && isWhitePiece(targetPiece) === isWhitePiece(piece)) {
            return false;
        }
        
        const pieceType = piece.toUpperCase();
        const deltaRow = Math.abs(toRow - fromRow);
        const deltaCol = Math.abs(toCol - fromCol);
        
        switch (pieceType) {
            case 'P': // Pawn
                const direction = isWhitePiece(piece) ? -1 : 1;
                const startRow = isWhitePiece(piece) ? 6 : 1;
                
                // Normal move
                if (fromCol === toCol && !targetPiece) {
                    if (toRow === fromRow + direction) return true;
                    // First move can be 2 squares
                    if (fromRow === startRow && toRow === fromRow + 2 * direction && !board[fromRow + direction][fromCol]) {
                        return true;
                    }
                }
                // Capture
                if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
                    return true;
                }
                
                // Add en passant
                if (canEnPassant(fromRow, fromCol, toRow, toCol)) {
                    return true;
                }
                return false;
                
            case 'R': // Rook
                return (fromRow === toRow || fromCol === toCol) && !hasObstacles(fromRow, fromCol, toRow, toCol);
                
            case 'N': // Knight
                return (deltaRow === 2 && deltaCol === 1) || (deltaRow === 1 && deltaCol === 2);
                
            case 'B': // Bishop
                return deltaRow === deltaCol && !hasObstacles(fromRow, fromCol, toRow, toCol);
                
            case 'Q': // Queen
                return (fromRow === toRow || fromCol === toCol || deltaRow === deltaCol) && 
                       !hasObstacles(fromRow, fromCol, toRow, toCol);
                
            case 'K': // King
                // Add castling
                if (canCastle(fromRow, fromCol, toRow, toCol)) {
                    return true;
                }
                return deltaRow <= 1 && deltaCol <= 1;
                
            default:
                return false;
        }
    };
    
    // Check if there are pieces between source and destination
    const hasObstacles = (fromRow, fromCol, toRow, toCol) => {
        const rowStep = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
        const colStep = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol]) return true;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return false;
    };

    // Add this helper function for castling
    const canCastle = (fromRow, fromCol, toRow, toCol) => {
        const piece = board[fromRow][fromCol];
        if (piece.toUpperCase() !== 'K') return false;
        
        // Check if king or rooks have moved
        const isWhite = isWhitePiece(piece);
        if (isWhite && castlingRights.whiteKingMoved) return false;
        if (!isWhite && castlingRights.blackKingMoved) return false;
        
        // Check if it's a castling move
        if (fromRow !== toRow || Math.abs(fromCol - toCol) !== 2) return false;
        
        const row = isWhite ? 7 : 0;
        // Short castle
        if (toCol === 6) {
            if ((isWhite && castlingRights.whiteRookHMoved) || 
                (!isWhite && castlingRights.blackRookHMoved)) return false;
            return !hasObstacles(row, 4, row, 7) && !isKingInCheck(row, 4) && 
                   !isKingInCheck(row, 5) && !isKingInCheck(row, 6);
        }
        // Long castle
        if (toCol === 2) {
            if ((isWhite && castlingRights.whiteRookAMoved) || 
                (!isWhite && castlingRights.blackRookAMoved)) return false;
            return !hasObstacles(row, 4, row, 0) && !isKingInCheck(row, 4) && 
                   !isKingInCheck(row, 3) && !isKingInCheck(row, 2);
        }
        return false;
    };

    // Add this helper function for en passant
    const canEnPassant = (fromRow, fromCol, toRow, toCol) => {
        const piece = board[fromRow][fromCol];
        if (piece.toUpperCase() !== 'P') return false;
        
        const lastMove = moveHistory[moveHistory.length - 1];
        if (!lastMove) return false;
        
        const isWhite = isWhitePiece(piece);
        if (isWhite && fromRow !== 3) return false;
        if (!isWhite && fromRow !== 4) return false;
        
        // Check if last move was a two-square pawn advance
        if (lastMove.piece.toUpperCase() === 'P' && 
            Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
            lastMove.toCol === toCol && 
            Math.abs(fromCol - toCol) === 1) {
            return true;
        }
        return false;
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (!selectedPiece) {
            // Select piece if it exists and belongs to current player
            const piece = board[rowIndex][colIndex];
            if (piece && isWhitePiece(piece) === isWhiteTurn) {
                setSelectedPiece({ row: rowIndex, col: colIndex });
            }
        } else {
            if (isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex)) {
                const newBoard = [...board.map(row => [...row])];
                const piece = newBoard[selectedPiece.row][selectedPiece.col];
                const pieceType = piece.toUpperCase();
                
                // Handle castling
                if (pieceType === 'K' && Math.abs(colIndex - selectedPiece.col) === 2) {
                    const isShortCastle = colIndex === 6;
                    const row = selectedPiece.row;
                    const rookFromCol = isShortCastle ? 7 : 0;
                    const rookToCol = isShortCastle ? 5 : 3;
                    
                    newBoard[row][rookToCol] = newBoard[row][rookFromCol];
                    newBoard[row][rookFromCol] = '';
                }
                
                // Handle en passant
                if (pieceType === 'P' && Math.abs(selectedPiece.col - colIndex) === 1 && !board[rowIndex][colIndex]) {
                    newBoard[selectedPiece.row][colIndex] = '';  // Remove captured pawn
                }
                
                // Make the move
                newBoard[rowIndex][colIndex] = piece;
                newBoard[selectedPiece.row][selectedPiece.col] = '';
                
                // Handle pawn promotion
                if (pieceType === 'P' && (rowIndex === 0 || rowIndex === 7)) {
                    const promotedPiece = isWhitePiece(piece) ? 'Q' : 'q';  // Auto-promote to queen
                    newBoard[rowIndex][colIndex] = promotedPiece;
                }
                
                // Update castling rights
                if (pieceType === 'K') {
                    if (isWhitePiece(piece)) {
                        setCastlingRights(prev => ({ ...prev, whiteKingMoved: true }));
                    } else {
                        setCastlingRights(prev => ({ ...prev, blackKingMoved: true }));
                    }
                }
                if (pieceType === 'R') {
                    if (selectedPiece.row === 7 && selectedPiece.col === 0) {
                        setCastlingRights(prev => ({ ...prev, whiteRookAMoved: true }));
                    } else if (selectedPiece.row === 7 && selectedPiece.col === 7) {
                        setCastlingRights(prev => ({ ...prev, whiteRookHMoved: true }));
                    } else if (selectedPiece.row === 0 && selectedPiece.col === 0) {
                        setCastlingRights(prev => ({ ...prev, blackRookAMoved: true }));
                    } else if (selectedPiece.row === 0 && selectedPiece.col === 7) {
                        setCastlingRights(prev => ({ ...prev, blackRookHMoved: true }));
                    }
                }
                
                // Record move for en passant
                setMoveHistory(prev => [...prev, {
                    piece,
                    fromRow: selectedPiece.row,
                    fromCol: selectedPiece.col,
                    toRow: rowIndex,
                    toCol: colIndex
                }]);
                
                // Update board and switch turns
                setBoard(newBoard);
                setIsWhiteTurn(!isWhiteTurn);
                if (onMove) onMove(toChessNotation(rowIndex, colIndex));
            }
            setSelectedPiece(null);
        }
    };

    // Convert position to chess notation
    const toChessNotation = (row, col) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return files[col] + ranks[row];
    };

    // Add this helper function to find the king's position
    const findKing = (isWhite) => {
        const kingSymbol = isWhite ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === kingSymbol) {
                    return { row, col };
                }
            }
        }
        return null;
    };

    // Add this function to check if a square is under attack
    const isSquareUnderAttack = (row, col, byWhite) => {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = board[fromRow][fromCol];
                if (piece && isWhitePiece(piece) === byWhite) {
                    if (isValidMove(fromRow, fromCol, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Add this function to check if the king is in check
    const isKingInCheck = (row, col, isWhiteKing = isWhiteTurn) => {
        return isSquareUnderAttack(row, col, !isWhiteKing);
    };

    return (
        <div className='chess-board-container'>
            <div className='chess-board-body'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='chess-board-row'>
                        {row.map((piece, colIndex) => (
                            <div 
                                key={colIndex} 
                                className={`chess-board-cell ${
                                    (rowIndex + colIndex) % 2 === 0 ? 'black' : 'white'
                                } ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'selected' : ''}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {piece && <span className={`chess-piece ${isWhitePiece(piece) ? 'white-piece' : 'black-piece'}`}>
                                    {getPieceSymbol(piece)}
                                </span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>  
        </div>
    );
};

// Helper function to convert piece letters to Unicode chess symbols
const getPieceSymbol = (piece) => {
    const pieceSymbols = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    return pieceSymbols[piece] || piece;
};
            
export default ChessBoard;  

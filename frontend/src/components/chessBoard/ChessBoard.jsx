import { useState } from 'react';
import './ChessBoard.css';
import { PieceFactory } from './utils/pieces/PieceFactory';
import { GameState } from './utils/GameState';
import { MoveValidator } from './utils/MoveValidator';
import { MoveExecutor } from './utils/MoveExecutor';
import { CheckService } from './utils/CheckService';

const ChessBoard = ({ onMove }) => {
    // Initial chess board setup with piece objects instead of characters
    const createInitialBoard = () => {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        const setupRow = (row, color) => {
            board[row][0] = PieceFactory.createPiece('R', color);
            board[row][1] = PieceFactory.createPiece('N', color);
            board[row][2] = PieceFactory.createPiece('B', color);
            board[row][3] = PieceFactory.createPiece('Q', color);
            board[row][4] = PieceFactory.createPiece('K', color);
            board[row][5] = PieceFactory.createPiece('B', color);
            board[row][6] = PieceFactory.createPiece('N', color);
            board[row][7] = PieceFactory.createPiece('R', color);
        };

        const setupPawns = (row, color) => {
            for (let i = 0; i < 8; i++) {
                board[row][i] = PieceFactory.createPiece('P', color);
            }
        };

        setupRow(0, 'black');
        setupRow(7, 'white');
        setupPawns(1, 'black');
        setupPawns(6, 'white');

        return board;
    };

    const [gameState, setGameState] = useState(() => {
        const newGameState = new GameState();
        const initialBoard = createInitialBoard();
        newGameState.initialize(initialBoard);
        return newGameState;
    });
    const [selectedPiece, setSelectedPiece] = useState(null);

    // Fix the findKing function
    const findKing = (isWhite) => {
        const color = isWhite ? 'white' : 'black';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece && piece.type === 'K' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    };

    // Update handleCellClick to check for check conditions
    const handleCellClick = (rowIndex, colIndex) => {
        if (!selectedPiece) {
            const piece = gameState.board[rowIndex][colIndex];
            
            if (piece && piece.color === (gameState.isWhiteTurn ? 'white' : 'black')) {
                setSelectedPiece({ row: rowIndex, col: colIndex });
            }
        } else {
            const moveResult = MoveValidator.isValidMove(
                selectedPiece.row,
                selectedPiece.col,
                rowIndex,
                colIndex,
                gameState
            );

            if (moveResult.valid) {
                const newGameState = new GameState();
                newGameState.board = gameState.board.map(row => [...row]);
                newGameState.isWhiteTurn = gameState.isWhiteTurn;
                newGameState.moveHistory = [...gameState.moveHistory];
                newGameState.castlingRights = JSON.parse(JSON.stringify(gameState.castlingRights));
                newGameState.enPassantTarget = gameState.enPassantTarget;

                MoveExecutor.executeMove(
                    selectedPiece.row,
                    selectedPiece.col,
                    rowIndex,
                    colIndex,
                    newGameState
                );

                const currentColor = newGameState.isWhiteTurn ? 'black' : 'white';
                if (CheckService.isKingInCheck(newGameState, currentColor)) {
                    CheckService.isCheckmate(newGameState, currentColor);
                }

                newGameState.isWhiteTurn = !newGameState.isWhiteTurn;
                setGameState(newGameState);
                
                if (onMove) {
                    const notation = toChessNotation(selectedPiece.row, selectedPiece.col) + 
                                   toChessNotation(rowIndex, colIndex);
                    onMove(notation, newGameState.board, moveResult.isCapture);
                }
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

    // Add this function to check if a square is under attack
    const isSquareUnderAttack = (row, col, byWhite) => {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = gameState.board[fromRow][fromCol];
                if (piece && piece.color === byWhite) {
                    if (MoveValidator.isValidMove(fromRow, fromCol, row, col, gameState)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Add this function to check if the king is in check
    const isKingInCheck = (row, col, isWhiteKing = gameState.isWhiteTurn) => {
        return isSquareUnderAttack(row, col, !isWhiteKing);
    };

    // Fix en passant target logic
    const getEnPassantTarget = () => {
        const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
        if (!lastMove || !lastMove.piece || lastMove.piece.type !== 'P') return null;
        
        if (Math.abs(lastMove.fromRow - lastMove.toRow) === 2) {
            return {
                row: (lastMove.fromRow + lastMove.toRow) / 2,
                col: lastMove.toCol
            };
        }
        return null;
    };

    // Add isCheckmate function before the return statement
    const isCheckmate = () => {
        // For now, return false until checkmate logic is implemented
        return false;
    };

    return (
        <div className='chess-board-container'>
            <div className='turn-indicator' style={{ marginBottom: '10px', color: 'white' }}>
                Current turn: {gameState.isWhiteTurn ? 'White' : 'Black'}
            </div>
            <div className='chess-board-body'>
                {gameState.board.map((row, rowIndex) => (
                    <div key={rowIndex} className='chess-board-row'>
                        {row.map((piece, colIndex) => (
                            <div 
                                key={colIndex} 
                                data-testid={`square-${rowIndex}-${colIndex}`}
                                className={`chess-board-cell ${
                                    (rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'
                                } ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'selected' : ''}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {piece && (
                                    <span className={`chess-piece ${piece.color}-piece`}>
                                        {piece.symbol}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {CheckService.isKingInCheck(gameState, gameState.isWhiteTurn ? 'white' : 'black') && (
                <div className="check-indicator" style={{ color: 'red', marginTop: '10px' }}>
                    Check!
                </div>
            )}
            {CheckService.isCheckmate(gameState, gameState.isWhiteTurn ? 'white' : 'black') && (
                <div className="checkmate-indicator" style={{ color: 'red', marginTop: '10px' }}>
                    Checkmate! {gameState.isWhiteTurn ? 'Black' : 'White'} wins!
                </div>
            )}
        </div>
    );
};

export default ChessBoard;  

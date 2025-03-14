export interface IPiece {
    color: string;
    symbol: string;
    notation: string;
    isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number, gameState: GameState): boolean;
} 
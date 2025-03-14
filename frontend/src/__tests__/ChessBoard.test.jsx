import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChessBoard from '../components/chessBoard/ChessBoard';

describe('ChessBoard', () => {
    let component;
    
    beforeEach(() => {
        component = render(<ChessBoard />);
    });

    // Test initial board setup and white's first move
    it('should start with white pieces and allow white to move first', () => {
        // Get white pawn at e2
        const e2Square = screen.getByTestId('square-6-4'); // row 6, col 4 for e2
        const e4Square = screen.getByTestId('square-4-4'); // row 4, col 4 for e4
        
        // Click e2 pawn
        fireEvent.click(e2Square);
        // Click e4 square
        fireEvent.click(e4Square);
        
        // Verify pawn moved
        expect(e4Square).toHaveTextContent('♙'); // White pawn symbol
        expect(e2Square).toBeEmpty();
    });

    // Test knight movement
    it('should allow valid knight moves', () => {
        // Get white knight at b1
        const b1Square = screen.getByTestId('square-7-1');
        const c3Square = screen.getByTestId('square-5-2');
        
        // Move knight from b1 to c3
        fireEvent.click(b1Square);
        fireEvent.click(c3Square);
        
        expect(c3Square).toHaveTextContent('♘'); // White knight symbol
        expect(b1Square).toBeEmpty();
    });

    // Test kingside castling
    it('should allow kingside castling when conditions are met', () => {
        // Setup: Move pieces out of the way (e2-e4, g1-f3, f1-e2)
        const moves = [
            ['6-4', '4-4'], // e2-e4
            ['7-6', '5-5'], // g1-f3
            ['7-5', '6-4'], // f1-e2
        ];
        
        moves.forEach(([from, to]) => {
            fireEvent.click(screen.getByTestId(`square-${from}`));
            fireEvent.click(screen.getByTestId(`square-${to}`));
        });
        
        // Castle kingside
        fireEvent.click(screen.getByTestId('square-7-4')); // e1
        fireEvent.click(screen.getByTestId('square-7-6')); // g1
        
        // Verify king and rook positions
        expect(screen.getByTestId('square-7-6')).toHaveTextContent('♔'); // King on g1
        expect(screen.getByTestId('square-7-5')).toHaveTextContent('♖'); // Rook on f1
    });

    // Test en passant
    it('should allow en passant capture', () => {
        // Setup: Move white pawn to e5, then black pawn to f5
        const moves = [
            ['6-4', '4-4'], // e2-e4
            ['1-5', '3-5'], // f7-f5
        ];
        
        moves.forEach(([from, to]) => {
            fireEvent.click(screen.getByTestId(`square-${from}`));
            fireEvent.click(screen.getByTestId(`square-${to}`));
        });
        
        // Perform en passant capture
        fireEvent.click(screen.getByTestId('square-4-4')); // e5 pawn
        fireEvent.click(screen.getByTestId('square-3-5')); // f6 square
        
        // Verify capture
        expect(screen.getByTestId('square-3-5')).toHaveTextContent('♙'); // White pawn on f6
        expect(screen.getByTestId('square-4-5')).toBeEmpty(); // Black pawn captured
    });

    // Test check detection
    it('should detect when king is in check', () => {
        // Setup: Scholar's mate position
        const moves = [
            ['6-4', '4-4'], // e2-e4
            ['1-4', '3-4'], // e7-e5
            ['7-5', '4-2'], // f1-c4
            ['1-5', '2-5'], // f7-f6
            ['7-3', '3-7'], // d1-h5
        ];
        
        moves.forEach(([from, to]) => {
            fireEvent.click(screen.getByTestId(`square-${from}`));
            fireEvent.click(screen.getByTestId(`square-${to}`));
        });
        
        // Verify check state
        expect(screen.getByTestId('check-indicator')).toBeVisible();
    });

    // Test checkmate
    it('should detect checkmate (Fool\'s mate)', () => {
        // Execute Fool's mate
        const moves = [
            ['6-5', '5-5'], // f2-f3
            ['1-4', '3-4'], // e7-e5
            ['6-6', '5-6'], // g2-g4
            ['0-3', '4-7'], // Qd8-h4 checkmate
        ];
        
        moves.forEach(([from, to]) => {
            fireEvent.click(screen.getByTestId(`square-${from}`));
            fireEvent.click(screen.getByTestId(`square-${to}`));
        });
        
        // Verify checkmate state
        expect(screen.getByTestId('checkmate-indicator')).toBeVisible();
    });
}); 
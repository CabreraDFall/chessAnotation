import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // This is a basic test to ensure the component renders
    expect(document.body.contains(screen.getByRole('main'))).toBeTruthy()
  })

  // Add more specific tests based on your App component functionality
  it('displays the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
}) 
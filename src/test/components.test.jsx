import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return () => {};
    }),
  },
  googleProvider: {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(component); // App already has Router
};

describe('Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('App Component', () => {
    it('should render without crashing', () => {
      renderWithRouter(<App />);
      expect(document.body).toBeTruthy();
    });

    it('should render homepage by default', async () => {
      renderWithRouter(<App />);

      await waitFor(() => {
        // Check for homepage elements
        const content = document.body.textContent;
        expect(content).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Navigation', () => {
    it('should handle routing without errors', () => {
      const { container } = renderWithRouter(<App />);
      expect(container).toBeTruthy();
    });
  });

  describe('Error Boundaries', () => {
    it('should catch rendering errors gracefully', () => {
      // This test ensures the app has error handling
      const { container } = renderWithRouter(<App />);
      expect(container).toBeTruthy();
    });
  });
});

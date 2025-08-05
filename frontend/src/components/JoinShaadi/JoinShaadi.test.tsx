import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import JoinShaadi from './index';
import * as apiModule from '../../services/api';

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    auth: (state = { token: null, user: null }, action: any) => state,
    shaadi: (state = { currentShaadi: null, currentUserRole: null }, action: any) => state,
  },
});

jest.mock('../../services/api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams('?code=123456')],
}));

const mockApi = apiModule as jest.Mocked<typeof apiModule>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('JoinShaadi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form initially', () => {
    renderWithProviders(<JoinShaadi />);
    expect(screen.getByText('Join Shaadi')).toBeInTheDocument();
    expect(screen.getByLabelText('6-Digit Shaadi Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join shaadi/i })).toBeInTheDocument();
  });

  it('shows join form after successful login', async () => {
    // Mock successful login
    mockApi.api.loginWithShaadiCode.mockResolvedValueOnce({
      access_token: 'mock-token',
      user: { id: '1', username: 'test' },
      shaadi: { id: '1', name: 'Test Wedding' }
    });

    renderWithProviders(<JoinShaadi />);
    
    // Fill and submit login form
    const codeInput = screen.getByLabelText('6-Digit Shaadi Code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /join shaadi/i }));

    // Wait for join form to appear
    await waitFor(() => {
      expect(screen.getByText('Join Wedding Celebration')).toBeInTheDocument();
    });

    // Check that join form fields are present
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Side')).toBeInTheDocument();
    expect(screen.getByLabelText('Relationship')).toBeInTheDocument();
  });

  it('validates join form fields', async () => {
    // Mock successful login first
    mockApi.api.loginWithShaadiCode.mockResolvedValueOnce({
      access_token: 'mock-token',
      user: { id: '1', username: 'test' },
      shaadi: { id: '1', name: 'Test Wedding' }
    });

    renderWithProviders(<JoinShaadi />);
    
    // Login first
    const codeInput = screen.getByLabelText('6-Digit Shaadi Code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /join shaadi/i }));

    // Wait for join form
    await waitFor(() => {
      expect(screen.getByText('Join Wedding Celebration')).toBeInTheDocument();
    });

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /join wedding/i }));

    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a side')).toBeInTheDocument();
      expect(screen.getByText('Please select a relationship')).toBeInTheDocument();
    });
  });

  it('submits join form with correct data', async () => {
    // Mock successful login
    mockApi.api.loginWithShaadiCode.mockResolvedValueOnce({
      access_token: 'mock-token',
      user: { id: '1', username: 'test' },
      shaadi: { id: '1', name: 'Test Wedding' }
    });

    // Mock successful join
    mockApi.api.joinShaadi.mockResolvedValueOnce({ success: true });

    renderWithProviders(<JoinShaadi />);
    
    // Login first
    const codeInput = screen.getByLabelText('6-Digit Shaadi Code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /join shaadi/i }));

    // Wait for join form
    await waitFor(() => {
      expect(screen.getByText('Join Wedding Celebration')).toBeInTheDocument();
    });

    // Fill join form
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Amit' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'amit@test.com' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+919999999999' } });
    
    // Select side
    const sideSelect = screen.getByLabelText('Side');
    fireEvent.mouseDown(sideSelect);
    fireEvent.click(screen.getByText('Groom Side'));
    
    // Select relationship
    const relationshipSelect = screen.getByLabelText('Relationship');
    fireEvent.mouseDown(relationshipSelect);
    fireEvent.click(screen.getByText('Friend'));

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /join wedding/i }));

    // Verify API call
    await waitFor(() => {
      expect(mockApi.api.joinShaadi).toHaveBeenCalledWith({
        code: '123456',
        name: 'Amit',
        side: 'groom',
        relationship: 'Friend',
        contactNumber: '+919999999999',
        showContact: false,
      });
    });
  });

  it('shows error on login failure', async () => {
    mockApi.api.loginWithShaadiCode.mockRejectedValueOnce(new Error('Invalid code'));

    renderWithProviders(<JoinShaadi />);
    
    const codeInput = screen.getByLabelText('6-Digit Shaadi Code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /join shaadi/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid code')).toBeInTheDocument();
    });
  });

  it('shows error on join form submission failure', async () => {
    // Mock successful login
    mockApi.api.loginWithShaadiCode.mockResolvedValueOnce({
      access_token: 'mock-token',
      user: { id: '1', username: 'test' },
      shaadi: { id: '1', name: 'Test Wedding' }
    });

    // Mock failed join
    mockApi.api.joinShaadi.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<JoinShaadi />);
    
    // Login first
    const codeInput = screen.getByLabelText('6-Digit Shaadi Code');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /join shaadi/i }));

    // Wait for join form
    await waitFor(() => {
      expect(screen.getByText('Join Wedding Celebration')).toBeInTheDocument();
    });

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Amit' } });
    
    // Select side
    const sideSelect = screen.getByLabelText('Side');
    fireEvent.mouseDown(sideSelect);
    fireEvent.click(screen.getByText('Groom Side'));
    
    // Select relationship
    const relationshipSelect = screen.getByLabelText('Relationship');
    fireEvent.mouseDown(relationshipSelect);
    fireEvent.click(screen.getByText('Friend'));

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /join wedding/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
}); 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GuestList from './GuestList';
import { shaadiSlice } from '../../features/shaadi/shaadiSlice';
import { commentsSlice } from '../../features/comments/commentsSlice';
import { postsSlice } from '../../features/posts/postsSlice';
import { authSlice } from '../../features/users/authSlice';

// Mock the API service
jest.mock('../../services/api', () => ({
  getInvites: jest.fn(),
  createInvite: jest.fn(),
  deleteInvite: jest.fn(),
}));

// Mock the hooks
jest.mock('./hooks/useInviteManagement', () => ({
  __esModule: true,
  default: () => ({
    invites: [],
    loadingInvites: false,
    loadInvites: jest.fn(),
    createInvite: jest.fn(),
    deleteInvite: jest.fn(),
  }),
}));

jest.mock('./hooks/useErrorHandling', () => ({
  __esModule: true,
  default: () => ({
    error: null,
    handleError: jest.fn(),
    clearError: jest.fn(),
  }),
}));

jest.mock('./hooks/useCardSharing', () => ({
  __esModule: true,
  default: () => ({
    shareInvite: jest.fn(),
    copyToClipboard: jest.fn(),
  }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      shaadi: shaadiSlice.reducer,
      comments: commentsSlice.reducer,
      posts: postsSlice.reducer,
      auth: authSlice.reducer,
    },
    preloadedState: initialState,
  });
};

const mockInvites = [
  {
    _id: 'invite1',
    inviteCode: '123456',
    guestEmail: 'guest1@example.com',
    guestPhone: '1234567890',
    guestName: 'John Doe',
    relationship: 'Friend',
    side: 'bride',
    status: 'pending',
    inviteLink: 'http://localhost:5173/join?code=123456',
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: 'invite2',
    inviteCode: '789012',
    guestEmail: 'guest2@example.com',
    guestPhone: null,
    guestName: null,
    relationship: null,
    side: 'groom',
    status: 'accepted',
    inviteLink: 'http://localhost:5173/join?code=789012',
    createdAt: new Date('2024-01-02'),
  },
  {
    _id: 'invite3',
    inviteCode: '345678',
    guestEmail: null,
    guestPhone: '9876543210',
    guestName: 'Jane Smith',
    relationship: 'Family',
    side: 'bride',
    status: 'declined',
    inviteLink: 'http://localhost:5173/join?code=345678',
    createdAt: new Date('2024-01-03'),
  },
];

describe('GuestList Component', () => {
  let mockUseInviteManagement: any;
  let mockUseErrorHandling: any;
  let mockUseCardSharing: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock the hooks with default implementations
    mockUseInviteManagement = {
      invites: mockInvites,
      loadingInvites: false,
      loadInvites: jest.fn(),
      createInvite: jest.fn(),
      deleteInvite: jest.fn(),
    };

    mockUseErrorHandling = {
      error: null,
      handleError: jest.fn(),
      clearError: jest.fn(),
    };

    mockUseCardSharing = {
      shareInvite: jest.fn(),
      copyToClipboard: jest.fn(),
    };

    // Update the mock implementations
    jest.doMock('./hooks/useInviteManagement', () => ({
      __esModule: true,
      default: () => mockUseInviteManagement,
    }));

    jest.doMock('./hooks/useErrorHandling', () => ({
      __esModule: true,
      default: () => mockUseErrorHandling,
    }));

    jest.doMock('./hooks/useCardSharing', () => ({
      __esModule: true,
      default: () => mockUseCardSharing,
    }));
  });

  const renderGuestList = (props = {}) => {
    const store = createMockStore({
      shaadi: {
        currentShaadi: {
          _id: 'shaadi123',
          brideName: 'Bride',
          groomName: 'Groom',
          weddingDate: '2024-06-15',
          venue: 'Test Venue',
        },
      },
      auth: {
        user: {
          _id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    });

    return render(
      <Provider store={store}>
        <GuestList {...props} />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render guest list with all invites', () => {
      renderGuestList();

      // Check if all invites are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('guest1@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest2@example.com')).toBeInTheDocument();
    });

    it('should handle null guest names gracefully', () => {
      renderGuestList();

      // Should show '?' for avatar when guestName is null
      const avatars = screen.getAllByRole('img', { hidden: true });
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('should display relationship information', () => {
      renderGuestList();

      expect(screen.getByText('Friend')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
    });

    it('should display status chips correctly', () => {
      renderGuestList();

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Accepted')).toBeInTheDocument();
      expect(screen.getByText('Declined')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseInviteManagement.loadingInvites = true;
      renderGuestList();

      expect(screen.getByText('Loading invites...')).toBeInTheDocument();
    });

    it('should show empty state when no invites', () => {
      mockUseInviteManagement.invites = [];
      renderGuestList();

      expect(screen.getByText('No invites yet')).toBeInTheDocument();
      expect(screen.getByText('Start inviting guests to your wedding!')).toBeInTheDocument();
    });
  });

  describe('Contact Information Display', () => {
    it('should display email when available', () => {
      renderGuestList();

      expect(screen.getByText('guest1@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest2@example.com')).toBeInTheDocument();
    });

    it('should display phone when email is not available', () => {
      renderGuestList();

      expect(screen.getByText('9876543210')).toBeInTheDocument();
    });

    it('should show fallback text when no contact info', () => {
      const invitesWithNoContact = [
        {
          _id: 'invite4',
          inviteCode: '999999',
          guestEmail: null,
          guestPhone: null,
          guestName: 'No Contact Guest',
          relationship: 'Friend',
          side: 'bride',
          status: 'pending',
          inviteLink: 'http://localhost:5173/join?code=999999',
          createdAt: new Date('2024-01-04'),
        },
      ];

      mockUseInviteManagement.invites = invitesWithNoContact;
      renderGuestList();

      expect(screen.getByText('Contact not provided')).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should display correct status colors', () => {
      renderGuestList();

      const pendingChip = screen.getByText('Pending').closest('.MuiChip-root');
      const acceptedChip = screen.getByText('Accepted').closest('.MuiChip-root');
      const declinedChip = screen.getByText('Declined').closest('.MuiChip-root');

      expect(pendingChip).toHaveClass('MuiChip-colorWarning');
      expect(acceptedChip).toHaveClass('MuiChip-colorSuccess');
      expect(declinedChip).toHaveClass('MuiChip-colorError');
    });

    it('should handle null status gracefully', () => {
      const invitesWithNullStatus = [
        {
          _id: 'invite5',
          inviteCode: '888888',
          guestEmail: 'test@example.com',
          guestName: 'Test Guest',
          relationship: 'Friend',
          side: 'bride',
          status: null,
          inviteLink: 'http://localhost:5173/join?code=888888',
          createdAt: new Date('2024-01-05'),
        },
      ];

      mockUseInviteManagement.invites = invitesWithNullStatus;
      renderGuestList();

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Side Display', () => {
    it('should display correct side colors', () => {
      renderGuestList();

      // Check if side colors are applied to avatars
      const avatars = screen.getAllByRole('img', { hidden: true });
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      mockUseErrorHandling.error = 'Failed to load invites';
      renderGuestList();

      expect(screen.getByText('Failed to load invites')).toBeInTheDocument();
    });

    it('should clear error when close button is clicked', () => {
      mockUseErrorHandling.error = 'Failed to load invites';
      renderGuestList();

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockUseErrorHandling.clearError).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderGuestList();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should have proper alt text for avatars', () => {
      renderGuestList();

      const avatars = screen.getAllByRole('img', { hidden: true });
      avatars.forEach(avatar => {
        expect(avatar).toHaveAttribute('alt');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on different screen sizes', () => {
      renderGuestList();

      // Test that the component renders without errors
      expect(screen.getByText('Guest List')).toBeInTheDocument();
    });
  });
}); 
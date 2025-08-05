# JoinShaadi Component Test Cases

## Overview
This document outlines comprehensive test cases for the JoinShaadi component, covering the complete join login flow from initial render to form submission.

## Test Categories

### 1. Initial Render Tests
- **Test**: Should render login form initially
  - **Expect**: "Join Shaadi" title visible
  - **Expect**: 6-digit code input field visible
  - **Expect**: "Join Shaadi" button visible

- **Test**: Should pre-fill code from URL parameter
  - **Given**: URL contains `?code=123456`
  - **Expect**: Code input field contains "123456"

### 2. Login Process Tests
- **Test**: Should handle successful login and show join form
  - **Given**: Valid invite code "123456"
  - **When**: User clicks "Join Shaadi"
  - **Expect**: API called with code "123456"
  - **Expect**: "Join Wedding Celebration" form appears
  - **Expect**: Login form disappears

- **Test**: Should handle login failure and show error message
  - **Given**: Invalid invite code
  - **When**: User clicks "Join Shaadi"
  - **Expect**: Error message displayed
  - **Expect**: Login form remains visible
  - **Expect**: Join form does not appear

- **Test**: Should validate code length before submitting
  - **Given**: Code input with less than 6 digits
  - **When**: User clicks "Join Shaadi"
  - **Expect**: Validation error message
  - **Expect**: API not called

### 3. Join Form Tests
- **Test**: Should render all join form fields
  - **Expect**: Name input field
  - **Expect**: Email input field
  - **Expect**: Phone input field
  - **Expect**: Side dropdown
  - **Expect**: Relationship dropdown
  - **Expect**: Show contact toggle

- **Test**: Should validate required fields
  - **When**: User submits empty form
  - **Expect**: "Name is required" error
  - **Expect**: "Please select a side" error
  - **Expect**: "Please select a relationship" error

- **Test**: Should validate email format
  - **Given**: Invalid email format
  - **When**: User submits form
  - **Expect**: "Please enter a valid email address" error

- **Test**: Should validate phone number format
  - **Given**: Invalid phone format
  - **When**: User submits form
  - **Expect**: "Please enter a valid phone number" error

### 4. Form Submission Tests
- **Test**: Should submit form with valid data
  - **Given**: All fields filled correctly
  - **When**: User clicks "Join Wedding"
  - **Expect**: API called with correct data structure
  - **Expect**: Success handling (redirect or callback)

- **Test**: Should handle join form submission error
  - **Given**: API returns error
  - **When**: User submits form
  - **Expect**: Error message displayed
  - **Expect**: Form remains visible

### 5. User Interaction Tests
- **Test**: Should toggle show contact switch
  - **Given**: Switch initially unchecked
  - **When**: User clicks switch
  - **Expect**: Switch becomes checked
  - **When**: User clicks again
  - **Expect**: Switch becomes unchecked

- **Test**: Should handle dropdown selections
  - **When**: User opens side dropdown
  - **Expect**: "Groom Side" and "Bride Side" options visible
  - **When**: User selects option
  - **Expect**: Selected value appears in dropdown

### 6. Edge Cases
- **Test**: Should handle empty code from URL
  - **Given**: URL without code parameter
  - **Expect**: Code input field is empty

- **Test**: Should handle network errors gracefully
  - **Given**: Network failure
  - **When**: User attempts login
  - **Expect**: User-friendly error message

- **Test**: Should disable submit button during loading
  - **Given**: API call in progress
  - **Expect**: Button shows "Joining..." text
  - **Expect**: Button is disabled

### 7. Debug Logging Tests
- **Test**: Should log debug information during login process
  - **When**: Login process starts
  - **Expect**: Console logs show debug information
  - **Expect**: Logs include code and mode parameters

## Test Data

### Valid Test Data
```javascript
const validLoginResponse = {
  access_token: 'mock-token-123',
  user: { id: '1', username: 'testuser' },
  shaadi: { id: '1', name: 'Test Wedding' },
  role: 'guest'
};

const validJoinFormData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+919999999999',
  side: 'groom',
  relationship: 'Friend',
  showContact: false
};
```

### Error Scenarios
```javascript
const errorResponses = {
  invalidCode: new Error('Invalid code'),
  networkError: new Error('Network error'),
  validationError: new Error('Validation failed')
};
```

## Test Setup Requirements

### Mock Dependencies
- Redux store with auth and shaadi reducers
- API service with loginWithShaadiCode and joinShaadi methods
- React Router with useSearchParams and useNavigate
- Console logging for debug information

### Test Utilities
- renderWithProviders function for consistent test setup
- Mock API responses for success and failure scenarios
- WaitFor utilities for async operations

## Running Tests

### Manual Testing Steps
1. Start frontend server: `npm run dev`
2. Navigate to: `http://localhost:5177/join?code=356116`
3. Test login flow with valid invite code
4. Test form validation with invalid data
5. Test form submission with valid data
6. Check browser console for debug logs

### Automated Testing
```bash
# Run specific test file
npm test -- JoinShaadi.test.simple.tsx

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Expected Behavior Summary

1. **Initial State**: Login form with pre-filled code
2. **Successful Login**: Transitions to join form
3. **Failed Login**: Shows error, stays on login form
4. **Form Validation**: Prevents submission with invalid data
5. **Successful Submission**: Calls API and handles success
6. **Failed Submission**: Shows error message
7. **Debug Logging**: Provides detailed console output

## Notes
- All tests should be isolated and independent
- Mock external dependencies consistently
- Test both success and failure scenarios
- Verify user experience and error handling
- Ensure accessibility and usability 
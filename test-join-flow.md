# Join Shaadi Flow Test Guide

## Backend Endpoint Test ✅
- **Endpoint**: `POST /users/join-shaadi`
- **Status**: Working (201 Created)
- **Response**: JWT token + user data

## Frontend Flow Test

### 1. Navigate to Join Page
- **URL**: `http://localhost:5179/join?code=356116`
- **Expected**: Login form with pre-filled code "356116"

### 2. Test Login with Invite Code
- **Action**: Click "Join Shaadi" button
- **Expected**: 
  - API call to `/users/login-shaadi`
  - Transition to join form
  - Console logs showing debug info

### 3. Test Join Form
- **Action**: Fill form with test data:
  - Name: "Test Guest"
  - Email: "test@example.com" 
  - Phone: "+919999999999"
  - Side: "Groom Side"
  - Relationship: "Friend"
  - Show Contact: false
- **Expected**: Form validation passes

### 4. Test Form Submission
- **Action**: Click "Join Wedding" button
- **Expected**:
  - API call to `/users/join-shaadi`
  - Success response with JWT token
  - Token stored in localStorage
  - Redirect to home page

## Test Data
```json
{
  "code": "356116",
  "name": "Test Guest", 
  "side": "groom",
  "relationship": "Friend",
  "contactNumber": "+919999999999",
  "showContact": false
}
```

## Expected Console Logs
1. `JoinShaadi: Login success with code: 356116`
2. `JoinShaadiForm: Starting form submission with inviteCode: 356116`
3. `JoinShaadiForm: Calling API with data: {...}`
4. `JoinShaadiForm: API response: {...}`
5. `JoinShaadiForm: Success response: {...}`

## Backend Process
1. **Find Invite**: Look for invite with code "356116" (status: pending/sent)
2. **Create Guest User**: Generate guest user account
3. **Update Invite**: Set status to "joined", add guest details
4. **Generate Token**: Create JWT for guest user
5. **Return Success**: Token + user data + shaadi info

## Success Indicators
- ✅ Backend endpoint responds with 201
- ✅ JWT token generated and returned
- ✅ Invite status updated to "joined"
- ✅ Guest user created in database
- ✅ Frontend stores token and redirects 
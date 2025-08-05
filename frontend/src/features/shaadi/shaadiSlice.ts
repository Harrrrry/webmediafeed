import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { UserRole } from '../../utils/constants';

interface ShaadiMember {
  userId: string;
  role: typeof UserRole[keyof typeof UserRole];
  code: string;
  blocked: boolean;
}

interface Shaadi {
  _id: string;
  name: string;
  brideName: string;
  groomName: string;
  date: Date;
  location?: string;
  image?: string;
  createdBy: string;
}

interface UserShaadiMembership {
  shaadi: Shaadi;
  role: string;
  code: string;
}

interface ShaadiState {
  userShaadis: UserShaadiMembership[];
  currentShaadi: Shaadi | null;
  currentUserRole: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ShaadiState = {
  userShaadis: [],
  currentShaadi: null,
  currentUserRole: null,
  status: 'idle',
  error: null,
};

export const fetchUserShaadis = createAsyncThunk('shaadi/fetchUserShaadis', async () => {
  const memberships = await api.getUserShaadis();
  return memberships;
});

export const switchShaadi = createAsyncThunk('shaadi/switchShaadi', async (code: string) => {
  const result = await api.switchShaadi(code);
  return result;
});

export const blockMember = createAsyncThunk('shaadi/blockMember', async (data: { shaadiId: string; memberUserId: string }) => {
  const result = await api.blockMember(data.shaadiId, data.memberUserId);
  return result;
});

export const unblockMember = createAsyncThunk('shaadi/unblockMember', async (data: { shaadiId: string; memberUserId: string }) => {
  const result = await api.unblockMember(data.shaadiId, data.memberUserId);
  return result;
});

export const deleteShaadi = createAsyncThunk('shaadi/deleteShaadi', async (data: { shaadiId: string; reason?: string }) => {
  const result = await api.deleteShaadi(data.shaadiId, data.reason);
  return { ...result, shaadiId: data.shaadiId };
});

const shaadiSlice = createSlice({
  name: 'shaadi',
  initialState,
  reducers: {
    clearCurrentShaadi(state) {
      state.currentShaadi = null;
      state.currentUserRole = null;
    },
    clearAllShaadiData(state) {
      state.userShaadis = [];
      state.currentShaadi = null;
      state.currentUserRole = null;
      state.status = 'idle';
      state.error = null;
    },
    addUserShaadi(state, action: PayloadAction<UserShaadiMembership>) {
      state.userShaadis.push(action.payload);
    },
    setCurrentShaadi(state, action: PayloadAction<{ shaadi: Shaadi; role: string }>) {
      state.currentShaadi = action.payload.shaadi;
      state.currentUserRole = action.payload.role;
    },
    clearError(state) {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserShaadis.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserShaadis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userShaadis = action.payload;
        console.log('ShaadiSlice: Received userShaadis:', action.payload);
      })
      .addCase(fetchUserShaadis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch shaadis';
      })
      .addCase(switchShaadi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(switchShaadi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.currentShaadi = action.payload.shaadi;
        state.currentUserRole = action.payload.role;
      })
      .addCase(switchShaadi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to switch shaadi';
        // Don't clear currentShaadi on error - preserve the switcher visibility
      })
      .addCase(deleteShaadi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteShaadi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted shaadi from userShaadis
        state.userShaadis = state.userShaadis.filter(
          membership => membership.shaadi._id !== action.payload.shaadiId
        );
        // Clear current shaadi if it was the deleted one
        if (state.currentShaadi?._id === action.payload.shaadiId) {
          state.currentShaadi = null;
          state.currentUserRole = null;
        }
      })
      .addCase(deleteShaadi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete shaadi';
      });
  },
});

export const { clearCurrentShaadi, clearAllShaadiData, addUserShaadi, setCurrentShaadi, clearError } = shaadiSlice.actions;
export default shaadiSlice.reducer; 
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from './reducer.utils';

// ---- Types ----
export interface ModuleAccess {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface UserPermissions {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  modules: Record<string, ModuleAccess>;
}

interface PermissionState {
  loading: boolean;
  permissions: UserPermissions | null;
  loaded: boolean;
}

const initialState: PermissionState = {
  loading: false,
  permissions: null,
  loaded: false,
};

// ---- Thunks ----
export const fetchPermissions = createAsyncThunk('permission/fetch', async () => axios.get<UserPermissions>('/api/account/permissions'), {
  serializeError: serializeAxiosError,
});

// ---- Slice ----
const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearPermissions(state) {
      state.permissions = null;
      state.loaded = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPermissions.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.data;
        state.loaded = true;
      })
      .addCase(fetchPermissions.rejected, state => {
        state.loading = false;
        state.loaded = true;
      });
  },
});

export const { clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;

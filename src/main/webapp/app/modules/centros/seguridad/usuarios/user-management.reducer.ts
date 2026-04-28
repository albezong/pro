import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { defaultValue, IUser } from 'app/shared/model/user.model';
import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

// 1. Definimos nuestra propia interfaz para evitar el error de "known properties"
export interface UserManagementState {
  loading: boolean;
  errorMessage: string | null;
  users: ReadonlyArray<IUser>; // Tu propiedad personalizada
  authorities: any[];
  user: IUser; // Tu propiedad personalizada
  updating: boolean;
  updateSuccess: boolean;
  totalItems: number;
}

// Interfaz para aceptar filtros en las consultas
interface IUserQueryParams extends IQueryParams {
  query?: any;
}

const initialState: UserManagementState = {
  loading: false,
  errorMessage: null,
  users: [],
  authorities: [],
  user: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

const apiUrl = 'api/users';
const adminUrl = 'api/admin/users';

// --- ACTIONS ---

// Esta acción es la que usa la vista con los filtros
export const getUsersAsAdmin = createAsyncThunk(
  'userManagement/fetch_users_as_admin',
  async ({ page, size, sort, query }: IUserQueryParams) => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    params.append('sort', sort);

    if (query) {
      if (query.login) params.append('login.contains', query.login); // Añade .contains
      if (query.activated !== '') params.append('activated.equals', query.activated); // Añade .equals
      if (query.profileId) params.append('profileId.equals', query.profileId); // Añade .equals
    }

    const requestUrl = `${adminUrl}?${params.toString()}`;

    console.warn('URL de FILTRO:', requestUrl);

    return axios.get<IUser[]>(requestUrl);
  },
);

export const getUsers = createAsyncThunk('userManagement/fetch_users', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return axios.get<IUser[]>(requestUrl);
});

export const getRoles = createAsyncThunk('userManagement/fetch_roles', async () => {
  const response = await axios.get<any[]>(`api/authorities`);
  const data = response?.data?.map(authority => (typeof authority === 'string' ? authority : authority.name));
  return { ...response, data };
});

export const getUser = createAsyncThunk(
  'userManagement/fetch_user',
  async (id: string) => {
    const requestUrl = `${adminUrl}/${id}`;
    return axios.get<IUser>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createUser = createAsyncThunk(
  'userManagement/create_user',
  async (user: IUser, thunkAPI) => {
    const result = await axios.post<IUser>(adminUrl, user);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 20, sort: 'id,asc' }));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateUser = createAsyncThunk(
  'userManagement/update_user',
  async (user: IUser, thunkAPI) => {
    const result = await axios.put<IUser>(adminUrl, user);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 20, sort: 'id,asc' }));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteUser = createAsyncThunk(
  'userManagement/delete_user',
  async (id: string, thunkAPI) => {
    const requestUrl = `${adminUrl}/${id}`;
    const result = await axios.delete<IUser>(requestUrl);
    thunkAPI.dispatch(getUsersAsAdmin({ page: 0, size: 20, sort: 'id,asc' }));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// --- SLICE ---

export const UserManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRoles.fulfilled, (state, action) => {
        state.authorities = action.payload.data;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        console.warn('antes FILTER DATA getUser:', action.payload.data); // 👈 AQUÍ
        console.warn('antes FILTER HEADERS getUser:', action.payload.headers); // 👈 AQUÍ
        state.loading = false;
        state.user = action.payload.data;
        console.warn('después FILTER DATA getUser:', action.payload.data); // 👈 AQUÍ
        console.warn('después FILTER HEADERS getUser:', action.payload.headers); // 👈 AQUÍ
      })
      .addCase(deleteUser.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.user = defaultValue;
      })
      .addMatcher(isFulfilled(getUsers, getUsersAsAdmin), (state, action) => {
        console.warn('antes FILTER DATA getUsers, , getUsersAsAdmin:', action.payload.data); // 👈 AQUÍ
        console.warn('antes FILTER HEADERS getUser, , getUsersAsAdmin:', action.payload.headers); // 👈 AQUÍ
        state.loading = false;
        state.users = action.payload.data;
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10);
        console.warn('después FILTER DATA getUsers, , getUsersAsAdmin:', action.payload.data); // 👈 AQUÍ
        console.warn('después FILTER HEADERS, getUsers, , getUsersAsAdmin:', action.payload.headers); // 👈 AQUÍ
      })
      .addMatcher(isFulfilled(createUser, updateUser), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.user = action.payload.data;
      })
      .addMatcher(isPending(getUsers, getUsersAsAdmin, getUser), state => {
        console.warn('antes FILTER DATA getUsers, getUsersAsAdmin, getUser:', state.users); // 👈 AQUÍ
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
        console.warn('después FILTER DATA getUsers, getUsersAsAdmin, getUser:', state.users); // 👈 AQUÍ
      })
      .addMatcher(isPending(createUser, updateUser, deleteUser), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isRejected(getUsers, getUsersAsAdmin, getUser, getRoles, createUser, updateUser, deleteUser), (state, action) => {
        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = UserManagementSlice.actions;
export default UserManagementSlice.reducer;

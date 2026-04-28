import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IProfile, defaultValue } from 'app/shared/model/profile.model';

// 👇 EXTENDEMOS EL STATE
interface ProfileState extends EntityState<IProfile> {
  filters: any;
  pagination: {
    page: number;
    size: number;
    sort?: string;
  };
}

interface IProfileQueryParams extends IQueryParams {
  query?: any;
}

const initialState: ProfileState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,

  // 🔥 NUEVO
  filters: {},
  pagination: {
    page: 0,
    size: 20,
    sort: 'id,asc',
  },
};

const apiUrl = 'api/profiles';

// 🔥 FILTROS
export const getProfilesFilter = createAsyncThunk(
  'profile/fetch_profiles_filter',
  async ({ page, size, sort, query }: IProfileQueryParams) => {
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('size', String(size));
    if (sort) params.append('sort', sort);

    if (query) {
      // ✅ CORRECCIÓN AQUÍ:
      // Solo enviamos 'active.equals' si es estrictamente true o false, NO si es undefined o null
      if (query.active !== undefined && query.active !== null && query.active !== '') {
        params.append('active.equals', String(query.active));
      }

      if (query.name && query.name !== '') {
        params.append('name.contains', query.name);
      }
    }

    const requestUrl = `${apiUrl}?${params.toString()}`;
    return axios.get<IProfile[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// 🔥 GET ONE
export const getEntities = createAsyncThunk(
  'profile/fetch_entity',
  async (id: string | number) => {
    return axios.get<IProfile>(`${apiUrl}/${id}`);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'profile/create_entity',
  async (entity: IProfile, thunkAPI) => {
    console.warn('Creando entidad antes de guardar:', entity); // Debugging
    // 1. Guardamos la entidad
    const result = await axios.post<IProfile>(apiUrl, cleanEntity(entity));

    // 2. Obtenemos el estado con un try/catch o verificaciones manuales
    const globalState = thunkAPI.getState() as any;

    // Verificamos si existe la ruta hacia la paginación para no romper el flujo
    const profileState = globalState.profile || {};
    const pagination = profileState.pagination || { page: 0, size: 20, sort: 'id,asc' };
    const filters = profileState.filters || {};

    // 3. Disparamos la actualización de la lista de forma segura
    thunkAPI.dispatch(
      getProfilesFilter({
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
        query: filters,
      }),
    );

    return result;
  },
  { serializeError: serializeAxiosError },
);

// UPDATE
export const updateEntity = createAsyncThunk(
  'profile/update_entity',
  async (entity: IProfile, thunkAPI) => {
    const result = await axios.put<IProfile>(`${apiUrl}/${entity.id}`, cleanEntity(entity));

    const state = thunkAPI.getState() as any;

    // Añadimos fallbacks para que no explote si state.profile.pagination es undefined
    const pagination = state.profile?.pagination || { page: 0, size: 20, sort: 'id,asc' };
    const filters = state.profile?.filters || {};

    thunkAPI.dispatch(
      getProfilesFilter({
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
        query: filters,
      }),
    );

    return result;
  },
  { serializeError: serializeAxiosError },
);

// 🔥 PATCH
export const partialUpdateEntity = createAsyncThunk(
  'profile/partial_update_entity',
  async (entity: IProfile, thunkAPI) => {
    const result = await axios.patch<IProfile>(`${apiUrl}/${entity.id}`, cleanEntity(entity));

    const state = thunkAPI.getState() as any;

    thunkAPI.dispatch(
      getProfilesFilter({
        page: state.profile.pagination.page,
        size: state.profile.pagination.size,
        sort: state.profile.pagination.sort,
        query: state.profile.filters,
      }),
    );

    return result;
  },
  { serializeError: serializeAxiosError },
);

// 🔥 DELETE
// 🔥 DELETE (CORREGIDO)
export const deleteEntity = createAsyncThunk(
  'profile/delete_entity',
  async (id: string | number, thunkAPI) => {
    // 1. Ejecutar la eliminación
    const result = await axios.delete<IProfile>(`${apiUrl}/${id}`);

    // 2. Obtener el estado actual de forma segura
    const state = thunkAPI.getState() as any;

    // 3. Extraer valores con valores por defecto (fallback)
    // para evitar el error "Cannot read properties of undefined"
    const profileState = state.profile || {};
    const pagination = profileState.pagination || { page: 0, size: 20, sort: 'id,asc' };
    const filters = profileState.filters || {};

    // 4. Refrescar la lista usando los datos obtenidos de forma segura
    thunkAPI.dispatch(
      getProfilesFilter({
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
        query: filters,
      }),
    );

    return result;
  },
  { serializeError: serializeAxiosError },
);

// 🔥 SLICE
export const ProfileSlice = createEntitySlice({
  name: 'profile',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })

      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })

      // 🔥 GUARDAR FILTROS
      .addCase(getProfilesFilter.pending, (state, action) => {
        state.filters = action.meta.arg.query || {};
        state.pagination = {
          page: action.meta.arg.page ?? 0,
          size: action.meta.arg.size ?? 20,
          sort: action.meta.arg.sort,
        };
      })

      .addMatcher(isFulfilled(getProfilesFilter), (state, action) => {
        // const { data, headers } = action.payload;

        // state.loading = false;
        // state.entities = data;
        // state.totalItems = headers['x-total-count'] ? parseInt(headers['x-total-count'], 10) : data.length;
        state.loading = false;
        state.entities = action.payload.data;
        state.totalItems = Number(action.payload.headers['x-total-count'] ?? action.payload.data.length);
      })

      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })

      .addMatcher(isPending(getProfilesFilter, getEntities), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })

      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = ProfileSlice.actions;
export default ProfileSlice.reducer;

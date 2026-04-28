import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IModulePermission, defaultValue } from 'app/shared/model/module-permission.model';

// 1. Definimos una interfaz extendida para que TypeScript no se queje del campo 'query'
interface IModulePermissionQueryParams extends IQueryParams {
  query?: any;
}

const initialState: EntityState<IModulePermission> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/module-permissions';

// Actions

export const getEntities = createAsyncThunk(
  'modulePermission/fetch_entity_list',
  async ({ page, size, sort, query }: IModulePermissionQueryParams) => {
    // 2. Usamos URLSearchParams para construir la URL de forma limpia
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    if (sort) params.append('sort', sort);

    // 3. Lógica de mapeo de filtros hacia la API (filtros de JHipster/Spring)
    if (query) {
      Object.keys(query).forEach(key => {
        const value = query[key];
        if (value && value !== '') {
          // Si el backend usa Filtering (JHipster default), se suele usar .contains o .equals
          if (key === 'moduleName') {
            params.append('moduleName.contains', value);
          } else {
            params.append(`${key}.equals`, value);
          }
        }
      });
    }

    const requestUrl = `${apiUrl}?${params.toString()}&cacheBuster=${new Date().getTime()}`;
    return axios.get<IModulePermission[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'modulePermission/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IModulePermission>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'modulePermission/create_entity',
  async (entity: IModulePermission, thunkAPI) => {
    const result = await axios.post<IModulePermission>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'modulePermission/update_entity',
  async (entity: IModulePermission, thunkAPI) => {
    const result = await axios.put<IModulePermission>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'modulePermission/partial_update_entity',
  async (entity: IModulePermission, thunkAPI) => {
    const result = await axios.patch<IModulePermission>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'modulePermission/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IModulePermission>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ModulePermissionSlice = createEntitySlice({
  name: 'modulePermission',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
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

export const { reset } = ModulePermissionSlice.actions;

// Reducer
export default ModulePermissionSlice.reducer;

// import axios from 'axios';
// import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
// import { cleanEntity } from 'app/shared/util/entity-utils';
// import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
// import { IUserProfile, defaultValue } from 'app/shared/model/user-profile.model';

// // Definimos una interfaz extendida para aceptar filtros
// interface IUserProfileQueryParams extends IQueryParams {
//   query?: any; // Aquí vendrán los filtros (firstName, lastName, etc.)
// }

// const initialState: EntityState<IUserProfile> = {
//   loading: false,
//   errorMessage: null,
//   entities: [],
//   entity: defaultValue,
//   updating: false,
//   totalItems: 0,
//   updateSuccess: false,
// };

// const apiUrl = 'api/user-profiles';

// // Actions
// export const getEntities = createAsyncThunk(
//   'userProfile/fetch_entity_list',
//   async ({ page, size, sort, query }: IUserProfileQueryParams) => {
//     const params = new URLSearchParams();
//     params.append('page', String(page));
//     params.append('size', String(size));
//     params.append('sort', sort);

//     if (query) {
//       Object.keys(query).forEach(key => {
//         const value = query[key];
//         if (value && value !== '') {
//           if (key === 'login') {
//             // JHipster suele mapear la relación "user" + campo "login" como userLogin
//             params.append('userLogin.contains', value);
//           } else if (key === 'email') {
//             params.append('userEmail.contains', value);
//           } else if (key === 'birthDate') {
//             params.append('birthDate.equals', value);
//           } else {
//             params.append(`${key}.contains`, value);
//           }
//         }
//       });
//     }

//     const requestUrl = `${apiUrl}?${params.toString()}&cacheBuster=${new Date().getTime()}`;
//     return axios.get<IUserProfile[]>(requestUrl);
//   },
// );

// export const getEntity = createAsyncThunk(
//   'userProfile/fetch_entity',
//   async (id: string | number) => {
//     const requestUrl = `${apiUrl}?id.equals=${id}&eagerload=true`;
//     const response = await axios.get<IUserProfile[]>(requestUrl);

//     return {
//       data: response.data[0], // tomamos el primero
//     };
//   },
//   { serializeError: serializeAxiosError },
// );

// export const createEntity = createAsyncThunk(
//   'userProfile/create_entity',
//   async (entity: IUserProfile, thunkAPI) => {
//     const result = await axios.post<IUserProfile>(apiUrl, cleanEntity(entity));
//     thunkAPI.dispatch(getEntities({}));
//     return result;
//   },
//   { serializeError: serializeAxiosError },
// );

// export const updateEntity = createAsyncThunk(
//   'userProfile/update_entity',
//   async (entity: IUserProfile, thunkAPI) => {
//     const result = await axios.put<IUserProfile>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
//     thunkAPI.dispatch(getEntities({}));
//     return result;
//   },
//   { serializeError: serializeAxiosError },
// );

// export const partialUpdateEntity = createAsyncThunk(
//   'userProfile/partial_update_entity',
//   async (entity: IUserProfile, thunkAPI) => {
//     const result = await axios.patch<IUserProfile>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
//     thunkAPI.dispatch(getEntities({}));
//     return result;
//   },
//   { serializeError: serializeAxiosError },
// );

// export const deleteEntity = createAsyncThunk(
//   'userProfile/delete_entity',
//   async (id: string | number, thunkAPI) => {
//     const requestUrl = `${apiUrl}/${id}`;
//     const result = await axios.delete<IUserProfile>(requestUrl);
//     thunkAPI.dispatch(getEntities({}));
//     return result;
//   },
//   { serializeError: serializeAxiosError },
// );

// // slice

// export const UserProfileSlice = createEntitySlice({
//   name: 'userProfile',
//   initialState,
//   extraReducers(builder) {
//     builder
//       .addCase(getEntity.fulfilled, (state, action) => {
//         state.loading = false;
//         state.entity = action.payload.data;
//       })
//       .addCase(deleteEntity.fulfilled, state => {
//         state.updating = false;
//         state.updateSuccess = true;
//         state.entity = {};
//       })
//       .addMatcher(isFulfilled(getEntities), (state, action) => {
//         const { data, headers } = action.payload;

//         return {
//           ...state,
//           loading: false,
//           entities: data,
//           totalItems: parseInt(headers['x-total-count'], 10),
//         };
//       })
//       .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
//         state.updating = false;
//         state.loading = false;
//         state.updateSuccess = true;
//         state.entity = action.payload.data;
//       })
//       .addMatcher(isPending(getEntities, getEntity), state => {
//         state.errorMessage = null;
//         state.updateSuccess = false;
//         state.loading = true;
//       })
//       .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
//         state.errorMessage = null;
//         state.updateSuccess = false;
//         state.updating = true;
//       })
//       .addMatcher(isRejected(getEntities, getEntity, createEntity, updateEntity, partialUpdateEntity, deleteEntity), (state, action) => {
//         state.loading = false;
//         state.updating = false;
//         state.updateSuccess = false;
//         state.errorMessage = action.error.message;
//       });
//   },
// });

// export const { reset } = UserProfileSlice.actions;

// // Reducer
// export default UserProfileSlice.reducer;

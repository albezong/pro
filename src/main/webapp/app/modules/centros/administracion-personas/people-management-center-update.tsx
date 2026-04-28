// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { Button, Col, Row, Alert } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
// import dayjs from 'dayjs';

// import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { getEntity, updateEntity, createEntity, reset } from 'app/entities/user-profile/user-profile.reducer';
// import { getEntities as getStates } from 'app/entities/state/state.reducer';
// import { IUserProfile, defaultValue } from 'app/shared/model/user-profile.model';
// import { saveAccountSettings } from 'app/modules/account/settings/settings.reducer';

// export const PeopleManagementCenterUpdate = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<'id'>();
//   const isNew = id === undefined || id === 'new';

//   const userProfileEntity = useAppSelector(state => state.userProfile.entity);
//   const updating = useAppSelector(state => state.userProfile.updating);
//   const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);
//   const states = useAppSelector(state => state.state.entities);

//   const [people, setPeople] = useState<IUserProfile>(defaultValue);
//   const [userFields, setUserFields] = useState({ login: '', firstName: '', lastName: '', email: '' });
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     dispatch(getStates({}));
//     if (isNew) {
//       dispatch(reset()); // Importante: Reseteamos para que no queden datos de ediciones previas
//       setIsInitialized(true);
//     } else {
//       dispatch(getEntity(id));
//     }
//     return () => {
//       dispatch(reset());
//     };
//   }, [id, isNew]);

//   useEffect(() => {
//     if (isInitialized) return;
//     if (!isNew && userProfileEntity && String(userProfileEntity.id) === String(id)) {
//       setPeople({
//         ...userProfileEntity,
//         birthDate: userProfileEntity.birthDate ? dayjs(userProfileEntity.birthDate) : undefined,
//       });
//       setUserFields({
//         login: userProfileEntity.user?.login ?? '',
//         firstName: userProfileEntity.user?.firstName ?? '',
//         lastName: userProfileEntity.user?.lastName ?? '',
//         email: userProfileEntity.user?.email ?? '',
//       });
//       setIsInitialized(true);
//     }
//   }, [userProfileEntity, isNew, id, isInitialized]);

//   useEffect(() => {
//     if (updateSuccess) {
//       navigate('/people-management-center');
//     }
//   }, [updateSuccess]);

//   const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserFields(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
//     setPeople(prev => ({ ...prev, [name]: val }));
//   };

//   const saveEntity = e => {
//     e.preventDefault();

//     // Construimos el objeto del usuario
//     // Si es nuevo, necesitamos pasarle estos datos al objeto user dentro del perfil
//     const userAccount = isNew
//       ? { ...userFields, langKey: 'es', activated: true } // Valores por defecto para nuevos
//       : { ...userProfileEntity.user, ...userFields };

//     const entityToSave: IUserProfile = {
//       ...userProfileEntity,
//       ...people,
//       user: userAccount,
//     };

//     if (isNew) {
//       // Para crear: Enviamos todo el paquete (User + Profile) al createEntity
//       dispatch(createEntity(entityToSave));
//     } else {
//       // Para actualizar: Actualizamos cuenta y luego el perfil
//       dispatch(saveAccountSettings(userAccount));
//       dispatch(updateEntity(entityToSave));
//     }
//   };

//   if (!isInitialized && !isNew) return <div className="p-5 text-center">Cargando datos...</div>;

//   return (
//     <div className="p-4">
//       <form onSubmit={saveEntity}>
//         <Row className="mb-3">
//           <Col md="8">
//             <Button tag={Link} to="/people-management-center" color="secondary" size="sm">
//               <FontAwesomeIcon icon={faArrowLeft} /> Regresar
//             </Button>
//             <h2 className="mt-3">{isNew ? 'Crear Nuevo Perfil' : `Editando: ${userFields.login}`}</h2>
//           </Col>
//         </Row>

//         <Alert color="light" className="border shadow-sm">
//           <h4 className="text-muted">Datos de Cuenta</h4>
//           <Row>
//             <Col md="6" className="mb-3">
//               <label>Nombre de Usuario (Login)</label>
//               <input
//                 className="form-control"
//                 name="login"
//                 value={userFields.login}
//                 onChange={handleUserChange}
//                 disabled={!isNew}
//                 style={!isNew ? { backgroundColor: '#e9ecef' } : {}}
//                 required
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label>Email</label>
//               <input
//                 className="form-control"
//                 name="email"
//                 type="email"
//                 value={userFields.email}
//                 onChange={handleUserChange}
//                 required
//                 minLength={6} // Mínimo de caracteres
//                 maxLength={254} // Máximo de caracteres
//                 pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label>Nombre</label>
//               <input
//                 className="form-control"
//                 name="firstName"
//                 value={userFields.firstName}
//                 onChange={handleUserChange}
//                 minLength={5} // Mínimo de caracteres
//                 maxLength={50} // Máximo de caracteres
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label>Apellido</label>
//               <input
//                 className="form-control"
//                 name="lastName"
//                 value={userFields.lastName}
//                 onChange={handleUserChange}
//                 minLength={5} // Mínimo de caracteres
//                 maxLength={50} // Máximo de caracteres
//               />
//             </Col>
//           </Row>

//           <hr />
//           <h4 className="text-muted">Perfil de Usuario</h4>
//           <Row>
//             <Col md="6" className="mb-3">
//               <label>Teléfono</label>
//               <input
//                 className="form-control"
//                 name="phone"
//                 value={people.phone || ''}
//                 onChange={handlePeopleChange}
//                 minLength={10} // Mínimo de caracteres
//                 maxLength={12} // Máximo de caracteres
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label>Dirección</label>
//               <input
//                 className="form-control"
//                 name="address"
//                 value={people.address || ''}
//                 onChange={handlePeopleChange}
//                 minLength={5} // Mínimo de caracteres
//                 maxLength={150} // Máximo de caracteres
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label>Fecha de Nacimiento</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 name="birthDate"
//                 value={people.birthDate ? people.birthDate.format('YYYY-MM-DD') : ''}
//                 onChange={e => setPeople(prev => ({ ...prev, birthDate: e.target.value ? dayjs(e.target.value) : undefined }))}
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Edad</label>
//               <input
//                 className="form-control"
//                 type="number"
//                 name="age"
//                 value={people.age ?? ''}
//                 onChange={handlePeopleChange}
//                 minLength={5} // Mínimo de caracteres
//                 maxLength={12} // Máximo de caracteres
//                 required // Opcional: para que no lo dejen vacío
//                 placeholder="Edad entre 11 y 120 años"
//               />
//             </Col>
//           </Row>

//           <Row className="align-items-center">
//             <Col md="6" className="mb-3">
//               <label>Estado</label>
//               <select
//                 className="form-select"
//                 name="state"
//                 value={people.state?.id ?? ''}
//                 onChange={e => {
//                   const stateEntity = states.find(s => s.id.toString() === e.target.value);
//                   setPeople(prev => ({ ...prev, state: stateEntity }));
//                 }}
//               >
//                 <option value="" disabled>
//                   Selecciona un estado
//                 </option>
//                 {states.map(s => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </Col>
//             <Col md="6" className="mt-3">
//               <div className="form-check custom-checkbox">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   name="active"
//                   checked={people.active ?? false}
//                   onChange={handlePeopleChange}
//                   id="activeCheck"
//                 />
//                 <label className="form-check-label ms-2" htmlFor="activeCheck" style={{ color: 'black' }}>
//                   Activo
//                 </label>
//               </div>
//             </Col>
//           </Row>

//           <div className="mt-4 d-flex justify-content-end">
//             <Button color="primary" type="submit" disabled={updating}>
//               <FontAwesomeIcon icon={faSave} /> {isNew ? 'Crear Perfil' : 'Guardar Cambios'}
//             </Button>
//           </div>
//         </Alert>
//       </form>
//     </div>
//   );
// };

// export default PeopleManagementCenterUpdate;

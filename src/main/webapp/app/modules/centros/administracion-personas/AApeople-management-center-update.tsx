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

// export const AAPeopleManagementCenterUpdate = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams<'id'>();
//   const isNew = id === undefined;

//   // Selectores de Redux
//   const userProfileEntity = useAppSelector(state => state.userProfile.entity);
//   const updating = useAppSelector(state => state.userProfile.updating);
//   const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);
//   const states = useAppSelector(state => state.state.entities);

//   // Estados locales para los inputs
//   const [people, setPeople] = useState<IUserProfile>(defaultValue);
//   const [userFields, setUserFields] = useState({ login: '', firstName: '', lastName: '', email: '' });
//   const [isInitialized, setIsInitialized] = useState(false);

//   // 1. Carga inicial de datos
//   useEffect(() => {
//     dispatch(getStates({}));
//     if (isNew) {
//       setIsInitialized(true);
//     } else {
//       dispatch(getEntity(id));
//     }

//     // Limpiar estado al desmontar para evitar que datos viejos flasheen al entrar
//     return () => {
//       dispatch(reset());
//     };
//   }, [id]);

//   // 2. Sincronización ÚNICA (El "Cerratón")
//   useEffect(() => {
//     // Si ya inicializamos, NO volvemos a tocar los estados locales aunque Redux cambie
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
//       setIsInitialized(true); // <--- ESTO BLOQUEA QUE REDUX TE BORRE LO QUE ESCRIBES
//     }
//   }, [userProfileEntity, isNew, id, isInitialized]);

//   // 3. Redirección tras éxito
//   useEffect(() => {
//     if (updateSuccess) {
//       navigate('/people-management-center');
//     }
//   }, [updateSuccess]);

//   // Manejadores
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

//     // El objeto del Usuario (nombre, apellido, email)
//     const updatedUserAccount = {
//       ...userProfileEntity.user,
//       ...userFields,
//     };

//     // El objeto del Perfil (teléfono, dirección, etc.)
//     const entityToSave: IUserProfile = {
//       ...userProfileEntity,
//       ...people,
//       user: updatedUserAccount,
//     };

//     // DISPARAMOS AMBAS ACCIONES
//     // 1. Actualizamos los datos básicos de la cuenta (Nombre, Apellido, Email)
//     dispatch(saveAccountSettings(updatedUserAccount));

//     // 2. Actualizamos los datos del perfil
//     if (isNew) {
//       dispatch(createEntity(entityToSave));
//     } else {
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
//             <h2 className="mt-3">{isNew ? 'Nuevo Perfil' : `Editando: ${userFields.login}`}</h2>
//           </Col>
//         </Row>

//         <Alert color="light" className="border shadow-sm">
//           <h4 className="text-muted">Datos de Cuenta</h4>
//           <Row>
//             <Col md="6">
//               <label>Nombre</label>
//               <input className="form-control" name="firstName" value={userFields.firstName} onChange={handleUserChange} />
//             </Col>
//             <Col md="6">
//               <label>Apellido</label>
//               <input className="form-control" name="lastName" value={userFields.lastName} onChange={handleUserChange} />
//             </Col>
//             <Col md="12" className="mt-2">
//               <label>Email</label>
//               <input className="form-control" name="email" value={userFields.email} onChange={handleUserChange} />
//             </Col>
//           </Row>

//           <hr />
//           <h4 className="text-muted">Perfil</h4>
//           <Row>
//             <Col md="6">
//               <label>Teléfono</label>
//               <input className="form-control" name="phone" value={people.phone || ''} onChange={handlePeopleChange} />
//             </Col>
//             <Col md="6">
//               <label>Dirección</label>
//               <input className="form-control" name="address" value={people.address || ''} onChange={handlePeopleChange} />
//             </Col>
//           </Row>

//           <div className="mt-4 text-end">
//             <Button color="primary" type="submit" disabled={updating}>
//               <FontAwesomeIcon icon={faSave} /> {updating ? 'Guardando...' : 'Guardar Cambios'}
//             </Button>
//           </div>
//         </Alert>
//       </form>
//     </div>
//   );
// };

// export default AAPeopleManagementCenterUpdate;

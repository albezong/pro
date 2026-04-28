// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { Button, Col, Row, Alert, Badge } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
// import dayjs from 'dayjs';

// import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { getEntity, updateEntity, createEntity, reset } from 'app/entities/user-profile/user-profile.reducer';
// import { getEntities as getStates } from 'app/entities/state/state.reducer';
// import { IUserProfile, defaultValue } from 'app/shared/model/user-profile.model';
// import { saveAccountSettings } from 'app/modules/account/settings/settings.reducer';
// import { Translate } from 'react-jhipster';

// export const PeopleManagementCenterDetail = () => {
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

//     return () => {
//       dispatch(reset());
//     };
//   }, [id, isNew, dispatch]);

//   // 2. Sincronización ÚNICA (Evita que Redux sobreescriba mientras escribes)
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

//   // 3. Redirección tras éxito
//   useEffect(() => {
//     if (updateSuccess) {
//       navigate('/people-management-center');
//     }
//   }, [updateSuccess, navigate]);

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

//     const updatedUserAccount = {
//       ...userProfileEntity.user,
//       ...userFields,
//     };

//     const entityToSave: IUserProfile = {
//       ...userProfileEntity,
//       ...people,
//       user: updatedUserAccount,
//     };

//     dispatch(saveAccountSettings(updatedUserAccount));

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
//             <dd>
//               <h2 className="mt-3">
//                 Detalle de : <span>{userFields.login}</span>&nbsp;
//               </h2>
//               {people.active ? (
//                 <Badge color="success">
//                   <Translate contentKey="userManagement.activated">Activated</Translate>
//                 </Badge>
//               ) : (
//                 <Badge color="danger">
//                   <Translate contentKey="userManagement.deactivated">Deactivated</Translate>
//                 </Badge>
//               )}
//             </dd>
//           </Col>
//         </Row>

//         <Alert color="light" className="border shadow-sm">
//           <h4 className="text-muted mb-3">Datos de Cuenta</h4>
//           <Row>
//             {/* --- INPUT LOGIN BLOQUEADO --- */}
//             <Col md="6" className="mb-3">
//               <label className="form-label">Nombre de Usuario (Login)</label>
//               <input
//                 className="form-control"
//                 name="login"
//                 value={userFields.login}
//                 onChange={handleUserChange}
//                 disabled={!isNew}
//                 style={!isNew ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Email</label>
//               <input className="form-control" name="email" value={userFields.email} onChange={handleUserChange} disabled={!isNew} />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Nombre</label>
//               <input className="form-control" name="firstName" value={userFields.firstName} onChange={handleUserChange} disabled={!isNew} />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Apellido</label>
//               <input className="form-control" name="lastName" value={userFields.lastName} onChange={handleUserChange} disabled={!isNew} />
//             </Col>
//           </Row>

//           <hr />

//           <h4 className="text-muted mb-3">Datos de Cuenta</h4>
//           <Row>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Teléfono</label>
//               <input
//                 className="form-control"
//                 value={people.phone || ''}
//                 readOnly
//                 style={{ backgroundColor: '#e9ecef' }}
//                 disabled={!isNew}
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Dirección</label>
//               <input
//                 className="form-control"
//                 value={people.address || ''}
//                 readOnly
//                 style={{ backgroundColor: '#e9ecef' }}
//                 disabled={!isNew}
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Fecha de Nacimiento</label>
//               <input
//                 className="form-control"
//                 value={people.birthDate ? people.birthDate.format('YYYY-MM-DD') : ''}
//                 readOnly
//                 style={{ backgroundColor: '#e9ecef' }}
//               />
//             </Col>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Edad</label>
//               <input className="form-control" value={people.age ?? ''} readOnly style={{ backgroundColor: '#e9ecef' }} />
//             </Col>
//           </Row>

//           <Row>
//             <Col md="6" className="mb-3">
//               <label className="form-label">Estado</label>
//               <input className="form-control" value={people.state?.name || 'Sin estado'} readOnly style={{ backgroundColor: '#e9ecef' }} />
//             </Col>
//             <Col md="6" className="mt-4">
//               <div className="form-check">
//                 <input type="checkbox" className="form-check-input" checked={people.active ?? false} disabled />
//                 <label className="form-check-label">Perfil Activo</label>
//               </div>
//             </Col>
//           </Row>
//         </Alert>
//       </form>
//     </div>
//   );
// };

// export default PeopleManagementCenterDetail;

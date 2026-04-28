// import React, { useEffect, useState } from 'react';
// import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
// import { Alert, Button, Col, Row, Carousel, CarouselItem, CarouselIndicators } from 'reactstrap';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';

// import { useNavigate, useParams, Link } from 'react-router-dom';

// import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
// import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { handleRegister, reset as resetRegister } from 'app/modules/account/register/register.reducer';
// import { createEntity, reset as resetProfile } from 'app/entities/user-profile/user-profile.reducer';
// import { getEntities as getStates } from 'app/entities/state/state.reducer';

// import { IUserProfile, defaultValue } from 'app/shared/model/user-profile.model';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// export const PeopleManagementCenterCreate = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const [activeIndex, setActiveIndex] = useState(0); // 0 = Registro, 1 = Perfil
//   const [password, setPassword] = useState('');
//   const [registeredUser, setRegisteredUser] = useState(null); // Guardamos el login creado

//   // Selectores de Redux
//   const states = useAppSelector(state => state.state.entities);
//   const successMessage = useAppSelector(state => state.register.successMessage);
//   const profileSuccess = useAppSelector(state => state.userProfile.updateSuccess);
//   const currentLocale = useAppSelector(state => state.locale.currentLocale);

//   // Perfil local
//   const [people, setPeople] = useState<IUserProfile>(defaultValue);

//   useEffect(() => {
//     dispatch(getStates({}));
//     return () => {
//       dispatch(resetRegister());
//       dispatch(resetProfile());
//     };
//   }, []);

//   // --- LÓGICA PASO 1: REGISTRO ---
//   const handleRegisterSubmit = async ({ username, email, firstPassword }) => {
//     const result = await dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: currentLocale }));

//     if (result.meta.requestStatus === 'fulfilled') {
//       setRegisteredUser(username);
//       toast.success('¡Cuenta creada! Ahora completa tu perfil.');
//       setActiveIndex(1); // Mover al carrusel 2
//     }
//   };

//   // --- LÓGICA PASO 2: PERFIL ---
//   const handleProfileSubmit = () => {
//     // Usamos 'as any' o una interfaz parcial para que TS nos deje enviar el string de la fecha
//     const entityToSave: any = {
//       ...people,
//       user: { login: registeredUser },
//       active: true,
//       // Aquí es donde TS se quejaba. Al ser para el dispatch, el middleware de JHipster se encarga del resto.
//       birthDate: people.birthDate ? dayjs(people.birthDate).toISOString() : null,
//     };

//     dispatch(createEntity(entityToSave));
//   };

//   useEffect(() => {
//     if (profileSuccess) {
//       toast.success('Perfil guardado con éxito.');
//       navigate('/people-management-center');
//       // Aquí podrías redirigir, por ejemplo:
//       // window.location.hash = '/user-profile';
//     }
//   }, [profileSuccess]);

//   const updatePassword = event => setPassword(event.target.value);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setPeople(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="container mt-5">
//       <Button tag={Link} to="/people-management-center" color="secondary" size="sm">
//         <FontAwesomeIcon icon={faArrowLeft} /> Regresar
//       </Button>
//       <br />
//       <h2 className="text-center mb-4">{activeIndex === 0 ? 'Paso 1: Crear Cuenta' : `Paso 2: Perfil de ${registeredUser}`}</h2>

//       <Carousel activeIndex={activeIndex} next={() => {}} previous={() => {}} interval={false}>
//         {/* SLIDE 1: REGISTRO DE USUARIO */}
//         <CarouselItem>
//           <Row className="justify-content-center">
//             <Col md="8" className="bg-light p-4 rounded shadow-sm">
//               <ValidatedForm onSubmit={handleRegisterSubmit}>
//                 <ValidatedField
//                   name="username"
//                   label={translate('global.form.username.label')}
//                   validate={{
//                     required: { value: true, message: translate('register.messages.validate.login.required') },
//                     // Restricción de mínimo 4 caracteres con mensaje
//                     minLength: { value: 4, message: translate('register.messages.validate.login.minlength') },
//                     // Restricción de 50 caracteres con mensaje
//                     maxLength: { value: 50, message: 'El nombre de usuario no puede superar los 50 caracteres' },
//                   }}
//                 />
//                 <ValidatedField
//                   name="email"
//                   label={translate('global.form.email.label')}
//                   type="email"
//                   validate={{
//                     required: { value: true, message: translate('global.messages.validate.email.required') },
//                     validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
//                     // Restricción de mínimo 6 carácter con mensaje
//                     minLength: { value: 6, message: translate('El email de usuario no puede ser menor a 6 caracteres') },
//                     // Restricción de 254 caracteres con mensaje
//                     maxLength: { value: 254, message: 'El email de usuario no puede superar los 254 caracteres' },
//                   }}
//                 />
//                 <ValidatedField
//                   name="firstPassword"
//                   label={translate('global.form.newpassword.label')}
//                   type="password"
//                   onChange={updatePassword}
//                   validate={{
//                     required: { value: true, message: 'Requerido' },
//                     minLength: { value: 8, message: translate('La contraseña no puede ser menor a 8 caracteres') },
//                   }}
//                 />
//                 <PasswordStrengthBar password={password} />
//                 <ValidatedField
//                   name="secondPassword"
//                   label={translate('global.form.confirmpassword.label')}
//                   type="password"
//                   validate={{
//                     validate: v => v === password || translate('global.messages.error.dontmatch'),
//                     minLength: { value: 8, message: translate('La contraseña no puede ser menor a 8 caracteres') },
//                   }}
//                 />
//                 <Button color="primary" type="submit" className="w-100">
//                   Siguiente: Datos de Perfil
//                 </Button>
//               </ValidatedForm>
//             </Col>
//           </Row>
//         </CarouselItem>

//         {/* SLIDE 2: PERFIL DE USUARIO */}
//         <CarouselItem>
//           <Row className="justify-content-center">
//             <Col md="8" className="bg-white p-4 rounded shadow border">
//               <Row>
//                 <Col md="6" className="mb-3">
//                   <label className="form-label">Teléfono</label>
//                   <input
//                     className="form-control"
//                     name="phone"
//                     onChange={handleInputChange}
//                     required
//                     maxLength={20} // Solo permite 20 caracteres
//                     placeholder="Máx. 20 caracteres"
//                   />
//                 </Col>
//                 <Col md="6" className="mb-3">
//                   <label className="form-label">Dirección</label>
//                   <input
//                     className="form-control"
//                     name="address"
//                     onChange={handleInputChange}
//                     required
//                     maxLength={150} // Solo permite 150 caracteres
//                     placeholder="Máx. 150 caracteres"
//                   />
//                 </Col>
//                 <Col md="6" className="mb-3">
//                   <label className="form-label">Fecha de Nacimiento</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     name="birthDate"
//                     onChange={e => setPeople({ ...people, birthDate: dayjs(e.target.value) })}
//                     required
//                   />
//                 </Col>
//                 <Col md="6" className="mb-3">
//                   <label className="form-label">Estado</label>
//                   <select
//                     className="form-select"
//                     name="state"
//                     onChange={e => setPeople({ ...people, state: states.find(s => s.id.toString() === e.target.value) })}
//                     required
//                   >
//                     <option value="">Selecciona...</option>
//                     {states.map(s => (
//                       <option key={s.id} value={s.id}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>
//                 </Col>
//               </Row>
//               <Button color="success" type="submit" className="w-100 mt-3" onClick={handleProfileSubmit}>
//                 Finalizar y Guardar Perfil
//               </Button>
//             </Col>
//           </Row>
//         </CarouselItem>
//       </Carousel>

//       <div className="d-flex justify-content-center mt-3">
//         <div className={`mx-1 p-1 rounded-circle ${activeIndex === 0 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: 12, height: 12 }} />
//         <div className={`mx-1 p-1 rounded-circle ${activeIndex === 1 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: 12, height: 12 }} />
//       </div>
//     </div>
//   );
// };

// export default PeopleManagementCenterCreate;

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Button, Table, Col, Row, Card, CardHeader, CardBody } from 'reactstrap';
// import { JhiItemCount, JhiPagination, TextFormat, getPaginationState } from 'react-jhipster';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faSort,
//   faSortDown,
//   faSortUp,
//   faSearch,
//   faSync,
//   faPlus,
//   faEye,
//   faPencilAlt,
//   faTrash,
//   faEraser,
// } from '@fortawesome/free-solid-svg-icons';
// import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
// import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
// import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
// import { useAppDispatch, useAppSelector } from 'app/config/store';

// import { getEntities as getUserProfiles } from './people-management-center-reducer.spec';
// import { getEntities as getStates } from 'app/entities/state/state.reducer';

// export const PeopleManagementCenter = () => {
//   const dispatch = useAppDispatch();
//   const pageLocation = useLocation();
//   const navigate = useNavigate();

//   const userProfileList = useAppSelector(state => state.userProfile.entities);
//   const loading = useAppSelector(state => state.userProfile.loading);
//   const totalItems = useAppSelector(state => state.userProfile.totalItems);
//   const account = useAppSelector(state => state.authentication.account);

//   const [filters, setFilters] = useState({
//     login: '',
//     email: '',
//     phone: '',
//     address: '',
//     birthDate: '',
//   });

//   const [paginationState, setPaginationState] = useState(
//     overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
//   );

//   // MÉTODO LIMPIO: Solo envía lo que hay en el estado 'filters'
//   const getAllEntities = () => {
//     dispatch(
//       getUserProfiles({
//         page: paginationState.activePage - 1,
//         size: paginationState.itemsPerPage,
//         sort: `${paginationState.sort},${paginationState.order}`,
//         query: filters, // Pasamos el objeto tal cual
//       }),
//     );
//   };

//   // Sincroniza la URL para que al dar atrás/adelante funcione, pero sin lógica compleja
//   const sortEntities = () => {
//     const params = new URLSearchParams();
//     params.set('page', paginationState.activePage.toString());
//     params.set('sort', `${paginationState.sort},${paginationState.order}`);

//     Object.keys(filters).forEach(key => {
//       if (filters[key]) params.set(key, filters[key]);
//     });

//     navigate(`${pageLocation.pathname}?${params.toString()}`);
//     getAllEntities();
//   };

//   useEffect(() => {
//     dispatch(getStates({}));
//   }, []);

//   useEffect(() => {
//     sortEntities();
//   }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]);

//   const handleFilterChange = e => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   const handleFilterSubmit = e => {
//     e.preventDefault();
//     if (paginationState.activePage === 1) {
//       sortEntities();
//     } else {
//       setPaginationState({ ...paginationState, activePage: 1 });
//     }
//   };

//   const clearFilters = () => {
//     setFilters({ login: '', email: '', phone: '', address: '', birthDate: '' });
//     setPaginationState({ ...paginationState, activePage: 1 });
//   };

//   const handlePagination = currentPage => setPaginationState({ ...paginationState, activePage: currentPage });

//   const sort = p => () => {
//     setPaginationState({
//       ...paginationState,
//       order: paginationState.order === ASC ? DESC : ASC,
//       sort: p,
//     });
//   };

//   const getSortIconByFieldName = (fieldName: string) => {
//     return paginationState.sort !== fieldName ? faSort : paginationState.order === ASC ? faSortUp : faSortDown;
//   };

//   return (
//     <div className="container-fluid py-4">
//       <h2 className="mb-4 text-primary">People Management Center</h2>

//       <Card className="border-primary mb-4 shadow-sm">
//         <CardHeader className="bg-primary text-white d-flex align-items-center">
//           <FontAwesomeIcon icon={faSearch} className="me-2" />
//           <span className="fw-bold">Filtros de Búsqueda</span>
//         </CardHeader>
//         <CardBody className="bg-light">
//           <form onSubmit={handleFilterSubmit}>
//             <Row>
//               <Col lg="2" md="4" className="mb-3">
//                 <label className="form-label small fw-bold">Usuario</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="login"
//                   value={filters.login}
//                   onChange={handleFilterChange}
//                   placeholder="Login..."
//                   minLength={4} // Mínimo de caracteres
//                   maxLength={50} // Máximo de caracteres
//                 />
//               </Col>
//               <Col lg="3" md="4" className="mb-3">
//                 <label className="form-label small fw-bold">Email</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="email"
//                   value={filters.email}
//                   onChange={handleFilterChange}
//                   minLength={6} // Mínimo de caracteres
//                   maxLength={254} // Máximo de caracteres
//                 />
//               </Col>
//               <Col lg="2" md="4" className="mb-3">
//                 <label className="form-label small fw-bold">Teléfono</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="phone"
//                   value={filters.phone}
//                   onChange={handleFilterChange}
//                   minLength={10} // Mínimo de caracteres
//                   maxLength={12} // Máximo de caracteres
//                 />
//               </Col>
//               <Col lg="3" md="4" className="mb-3">
//                 <label className="form-label small fw-bold">Dirección</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="address"
//                   value={filters.address}
//                   onChange={handleFilterChange}
//                   minLength={5} // Mínimo de caracteres
//                   maxLength={150} // Máximo de caracteres
//                 />
//               </Col>
//               <Col lg="2" md="4" className="mb-3">
//                 <label className="form-label small fw-bold">F. Nacimiento</label>
//                 <input type="date" className="form-control" name="birthDate" value={filters.birthDate} onChange={handleFilterChange} />
//               </Col>
//               <Col xs="12" className="d-flex justify-content-center gap-3 mt-2">
//                 <Button color="primary" type="submit" className="px-4 shadow-sm">
//                   <FontAwesomeIcon icon={faSearch} /> Buscar
//                 </Button>
//                 <Button color="secondary" type="button" onClick={clearFilters} className="px-4 shadow-sm">
//                   <FontAwesomeIcon icon={faEraser} /> Limpiar
//                 </Button>
//               </Col>
//             </Row>
//           </form>
//         </CardBody>
//       </Card>

//       <div className="d-flex justify-content-end mb-3">
//         <Button color="info" onClick={sortEntities} disabled={loading} className="me-2 shadow-sm">
//           <FontAwesomeIcon icon={faSync} spin={loading} /> Refrescar
//         </Button>
//         <Link to="/people-management-create" className="btn btn-primary shadow-sm">
//           <FontAwesomeIcon icon={faPlus} /> Nuevo Perfil
//         </Link>
//       </div>

//       <div className="table-responsive shadow-sm bg-white rounded">
//         {userProfileList && userProfileList.length > 0 ? (
//           <Table striped hover responsive className="mb-0">
//             <thead className="table-dark">
//               <tr>
//                 <th className="hand" onClick={sort('user.login')}>
//                   Usuario <FontAwesomeIcon icon={getSortIconByFieldName('user.login')} />
//                 </th>
//                 <th className="hand" onClick={sort('user.email')}>
//                   Email <FontAwesomeIcon icon={getSortIconByFieldName('user.email')} />
//                 </th>
//                 <th className="hand" onClick={sort('phone')}>
//                   Teléfono <FontAwesomeIcon icon={getSortIconByFieldName('phone')} />
//                 </th>
//                 <th className="hand" onClick={sort('address')}>
//                   Dirección <FontAwesomeIcon icon={getSortIconByFieldName('address')} />
//                 </th>
//                 <th className="hand" onClick={sort('birthDate')}>
//                   F. Nacimiento <FontAwesomeIcon icon={getSortIconByFieldName('birthDate')} />
//                 </th>
//                 <th>Estado</th>
//                 <th className="text-center">Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {userProfileList.map((userProfile, i) => (
//                 <tr key={`entity-${i}`}>
//                   <td>{userProfile.user?.login || 'N/A'}</td>
//                   <td>{userProfile.user?.email || 'N/A'}</td>
//                   <td>{userProfile.phone || 'N/A'}</td>
//                   <td>{userProfile.address || 'N/A'}</td>
//                   <td>
//                     {userProfile.birthDate ? (
//                       <TextFormat value={userProfile.birthDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
//                     ) : (
//                       'N/A'
//                     )}
//                   </td>
//                   <td>{userProfile.state?.name || 'Sin estado'}</td>
//                   <td className="text-center">
//                     <div className="btn-group">
//                       <Button tag={Link} to={`/people-management-detail/${userProfile.id}`} color="info" size="sm">
//                         <FontAwesomeIcon icon={faEye} />
//                       </Button>
//                       <Button tag={Link} to={`/people-management-update/${userProfile.id}`} color="primary" size="sm">
//                         <FontAwesomeIcon icon={faPencilAlt} />
//                       </Button>
//                       <Button
//                         tag={Link}
//                         to={`/people-management-delete/${userProfile.id}`}
//                         color="danger"
//                         size="sm"
//                         disabled={userProfile.user?.login === account.login}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           !loading && <div className="alert alert-warning text-center m-0">No se encontraron resultados.</div>
//         )}
//       </div>

//       {totalItems > 0 && (
//         <div className="mt-4 mb-5">
//           <div className="d-flex justify-content-center mb-3 flex-wrap gap-3">
//             {/* Bloque Unificado de Control e Información Centrado */}
//             <div className="d-flex align-items-center gap-2 text-secondary flex-wrap justify-content-center">
//               <h6 className="m-0 d-flex align-items-center gap-2 flex-wrap justify-content-center text-center">
//                 Mostrando
//                 <select
//                   className="form-select form-select-sm shadow-sm d-inline-block"
//                   style={{ width: '70px', borderRadius: '8px', cursor: 'pointer' }}
//                   value={paginationState.itemsPerPage}
//                   onChange={e =>
//                     setPaginationState({
//                       ...paginationState,
//                       itemsPerPage: parseInt(e.target.value, 10),
//                       activePage: 1,
//                     })
//                   }
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="50">50</option>
//                 </select>
//                 registros por página
//                 <span className="mx-2 fw-normal text-muted d-none d-md-inline">|</span>
//                 <span>
//                   Del <b>{(paginationState.activePage - 1) * paginationState.itemsPerPage + 1}</b> al{' '}
//                   <b>{Math.min(paginationState.activePage * paginationState.itemsPerPage, totalItems)}</b> de <b>{totalItems}</b> resultados
//                 </span>
//               </h6>
//             </div>
//           </div>

//           {/* Paginación con estilo personalizado */}
//           <div className="d-flex justify-content-center custom-pagination-container">
//             <JhiPagination
//               activePage={paginationState.activePage}
//               onSelect={handlePagination}
//               maxButtons={5}
//               itemsPerPage={paginationState.itemsPerPage}
//               totalItems={totalItems}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PeopleManagementCenter;

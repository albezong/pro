import './user-management.scss';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Col, Row, Card, CardHeader, CardBody } from 'reactstrap';
import { JhiPagination, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp,
  faSearch,
  faSync,
  faPlus,
  faEye,
  faPencilAlt,
  faTrash,
  faEraser,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { getUsersAsAdmin } from './user-management.reducer';
import { getEntities as getProfiles } from 'app/entities/profile/profile.reducer';

export const UserManagement = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  // --- SELECTORES ---
  const users = useAppSelector(state => state.userManagement.users);
  const totalItems = useAppSelector(state => state.userManagement.totalItems);
  const loading = useAppSelector(state => state.userManagement.loading);
  const account = useAppSelector(state => state.authentication.account);
  const perm = usePermission('Usuarios');
  const profiles = useAppSelector(state => state.profile.entities);

  // --- ESTADOS ---

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(pageLocation.search);
    return {
      login: params.get('login') || '',
      profileId: params.get('profileId') || '',
      activated: params.get('activated') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  // --- LÓGICA DE CARGA ---

  const getAllEntities = () => {
    dispatch(
      getUsersAsAdmin({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
        query: filters,
      }),
    );
  };

  const syncQueryParamsAndSearch = () => {
    const params = new URLSearchParams(pageLocation.search);
    params.set('page', paginationState.activePage.toString());
    params.set('sort', `${paginationState.sort},${paginationState.order}`);

    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });

    navigate(`${pageLocation.pathname}?${params.toString()}`, { replace: true });
    getAllEntities();
  };

  useEffect(() => {
    dispatch(getProfiles({}));
  }, []);

  useEffect(() => {
    syncQueryParamsAndSearch();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]);

  // --- MANEJADORES ---
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = e => {
    if (e) e.preventDefault();
    if (paginationState.activePage === 1) {
      syncQueryParamsAndSearch();
    } else {
      setPaginationState(prev => ({ ...prev, activePage: 1 }));
    }
  };

  const clearFilters = () => {
    const blankFilters = { login: '', profileId: '', activated: '' };
    setFilters(blankFilters);

    if (paginationState.activePage === 1) {
      dispatch(
        getUsersAsAdmin({
          page: 0,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
          query: blankFilters,
        }),
      );
      navigate(pageLocation.pathname, { replace: true });
    } else {
      setPaginationState(prev => ({ ...prev, activePage: 1 }));
    }
  };

  const handlePagination = currentPage => setPaginationState({ ...paginationState, activePage: currentPage });

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const getSortIconByFieldName = (fieldName: string) => {
    return paginationState.sort !== fieldName ? faSort : paginationState.order === ASC ? faSortUp : faSortDown;
  };

  // --- NUEVA FUNCIÓN PARA RENDERIZAR IMAGEN DESDE CLOUDINARY O BASE64 ---
  const renderAvatar = (imageStr: string) => {
    if (!imageStr) return null;

    let src = '';

    if (imageStr.startsWith('http')) {
      // Caso Cloudinary / URL externa
      src = imageStr;
    } else if (imageStr.startsWith('data:')) {
      // Caso Base64 ya formateado
      src = imageStr;
    } else {
      // Caso Base64 puro (JHipster a veces manda el string sin el prefijo)
      // Probamos con PNG por defecto, si no, JHipster suele enviar imageContentType
      src = `data:image/png;base64,${imageStr}`;
    }

    return (
      <img
        src={src}
        alt="avatar"
        className="rounded-circle shadow-sm border"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={e => {
          // Si falla el renderizado, ponemos un placeholder visual
          e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=random';
        }}
      />
    );
  };

  return (
    <div className="custom-user-management container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faUserCircle} width="40" />
        </div>
        <h2 className="mb-0 fw-bold">Gestión de Usuarios</h2>
      </div>

      <Card className="filter-card">
        <CardHeader className="d-flex align-items-center justify-content-center py-2">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          <span className="fw-bold">Filtros de Búsqueda</span>
        </CardHeader>
        <hr />
        <CardBody className="filter-card-body">
          <ValidatedForm onSubmit={handleFilterSubmit} defaultValues={filters}>
            <Row className="align-items-start">
              {' '}
              {/* Cambiado a start para que la validación no mueva los otros */}
              {/* LOGIN */}
              <Col md="4" className="mb-3">
                <ValidatedField
                  type="text"
                  name="login"
                  label="Usuario (Login)"
                  placeholder="Buscar por login..."
                  value={filters.login}
                  onChange={handleFilterChange}
                  // Eliminamos 'required' si es un filtro, para que permita buscar en blanco
                  validate={{
                    minLength: { value: 4, message: 'Mínimo 4 caracteres.' },
                    pattern: {
                      value: /^[_.@A-Za-z0-9-]+$/,
                      message: 'Formato inválido.',
                    },
                  }}
                />
              </Col>
              {/* PERFIL - Ahora como ValidatedField */}
              <Col md="4" className="mb-3">
                <ValidatedField
                  type="select"
                  name="profileId"
                  label="Perfil Asignado"
                  value={filters.profileId}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los perfiles...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </ValidatedField>
              </Col>
              {/* ESTADO - Ahora como ValidatedField */}
              <Col md="4" className="mb-3">
                <ValidatedField type="select" name="activated" label="Estado" value={filters.activated} onChange={handleFilterChange}>
                  <option value="">Cualquiera</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </ValidatedField>
              </Col>
              {/* BOTONES */}
              <Col xs="12" className="d-flex justify-content-center gap-3 mt-2">
                <Button color="primary" type="submit" className="px-4 shadow-sm">
                  <FontAwesomeIcon icon={faSearch} /> Buscar
                </Button>
                <Button color="secondary" type="button" onClick={clearFilters} className="px-4 shadow-sm">
                  <FontAwesomeIcon icon={faEraser} /> Limpiar
                </Button>
              </Col>
            </Row>
          </ValidatedForm>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted small fw-bold">Resultados de búsqueda</div>
        <div className="d-flex gap-2">
          <Button color="info" onClick={syncQueryParamsAndSearch} disabled={loading} className="shadow-sm">
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refrescar
          </Button>
          {perm.canCreate && (
            <Button tag={Link} to="/seguridad/usuarios-create" color="success" className="shadow-sm">
              <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
            </Button>
          )}
        </div>
      </div>

      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('login')}>
                Usuario <FontAwesomeIcon icon={getSortIconByFieldName('login')} />
              </th>
              <th>Perfil Personalizado</th>
              <th className="hand" onClick={sort('activated')}>
                Estado <FontAwesomeIcon icon={getSortIconByFieldName('activated')} />
              </th>
              <th>Estado Registro</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, i) => {
                // 1. Intentamos encontrar el perfil de varias formas posibles
                const userProfile = profiles.find(p =>
                  Array.isArray(p.users) ? p.users.some((u: any) => u.id === user.id || u === user.id) : p.userId === user.id,
                );

                console.warn('Perfil[0]:', profiles[0]);
                console.warn('User[0]:', users[0]);
                // DEBUG: Descomenta la siguiente línea para ver en consola si se encuentra el perfil
                // console.log(`Usuario: ${user.login}, Perfil encontrado:`, userProfile);
                return (
                  <tr key={`user-${i}`}>
                    <td className="fw-bold text-secondary">
                      <div className="d-flex align-items-center">
                        <div className="me-2" style={{ width: '35px', height: '35px', flexShrink: 0 }}>
                          {user.imageUrl ? (
                            renderAvatar(user.imageUrl) // ← directo del user, sin buscar perfil
                          ) : (
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center border"
                              style={{ width: '100%', height: '100%' }}
                            >
                              <FontAwesomeIcon icon={faUserCircle} className="text-muted" />
                            </div>
                          )}
                        </div>
                        {user.login}
                      </div>
                    </td>
                    <td>
                      {userProfile ? (
                        <span className="badge bg-info text-dark">{userProfile.name}</span>
                      ) : (
                        <span className="text-muted small italic">Sin perfil</span>
                      )}
                    </td>
                    <td>
                      {user.activated ? (
                        <span className="badge bg-success">Activo</span>
                      ) : (
                        <span className="badge bg-danger">Inactivo</span>
                      )}
                    </td>
                    <td>Registrado</td>
                    <td className="text-center">
                      <div className="btn-group">
                        {perm.canView && (
                          <Button tag={Link} to={`/seguridad/usuarios-detail/${user.login}`} color="link" size="sm" className="text-info">
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        )}
                        {perm.canEdit && (
                          <Button
                            tag={Link}
                            to={`/seguridad/usuarios-update/${user.login}`}
                            color="link"
                            size="sm"
                            className="text-primary"
                          >
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Button>
                        )}
                        {perm.canDelete && (
                          <Button
                            tag={Link}
                            to={`/seguridad/usuarios-delete/${user.login}`}
                            color="link"
                            size="sm"
                            className="text-danger"
                            disabled={account.login === user.login}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="alert alert-warning d-inline-block m-0">No se encontraron usuarios con esos criterios.</div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {totalItems > 0 && (
        <div className="mt-4 mb-5">
          <div className="d-flex justify-content-center mb-3 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2 text-secondary flex-wrap justify-content-center">
              <h6 className="m-0 d-flex align-items-center gap-2 flex-wrap justify-content-center text-center">
                Mostrando
                <select
                  className="form-select form-select-sm shadow-sm d-inline-block"
                  style={{ width: '70px', borderRadius: '8px', cursor: 'pointer' }}
                  value={paginationState.itemsPerPage}
                  onChange={e =>
                    setPaginationState({
                      ...paginationState,
                      itemsPerPage: parseInt(e.target.value, 10),
                      activePage: 1,
                    })
                  }
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                registros por página
                <span className="mx-2 fw-normal text-muted d-none d-md-inline">|</span>
                <span>
                  Del <b>{(paginationState.activePage - 1) * paginationState.itemsPerPage + 1}</b> al{' '}
                  <b>{Math.min(paginationState.activePage * paginationState.itemsPerPage, totalItems)}</b> de <b>{totalItems}</b> resultados
                </span>
              </h6>
            </div>
          </div>
          <div className="d-flex justify-content-center custom-pagination-container">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

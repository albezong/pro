import './profile-permissions-center.scss';

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Col, Row, Card, CardBody, Input, CardHeader } from 'reactstrap';
import { JhiPagination } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faEye,
  faPencilAlt,
  faTrash,
  faShieldAlt,
  faSync,
  faEraser,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { IModulePermission } from 'app/shared/model/module-permission.model';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission'; // Importamos selector
import { reset } from './module-permission.reducer';
import { getEntities as getModules } from 'app/entities/modules/modules.reducer'; // Importamos acciones de entidades
import { getEntities as getProfiles } from 'app/entities/profile/profile.reducer';

export const ProfilePermissionsManagement = () => {
  const dispatch = useAppDispatch();
  const perm = usePermission('Permisos');
  const pageLocation = useLocation();
  const navigate = useNavigate();

  // --- SELECTORS PARA LOS DROPDOWNS ---
  const modules = useAppSelector(state => state.modules.entities);
  const profiles = useAppSelector(state => state.profile.entities);

  // --- ESTADOS LOCALES ---
  const [modulePermissionList, setModulePermissionList] = useState<IModulePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(pageLocation.search);
    return {
      moduleId: params.get('moduleId') || '',
      profileId: params.get('profileId') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    sort: 'id',
    order: ASC,
  });

  // --- FUNCIÓN AXIOS CON FILTROS POR ID (SERIALIZADOS) ---
  const getAllEntities = useCallback(async () => {
    setLoading(true);
    try {
      const { moduleId, profileId } = filters;
      const params: any = {
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      };

      // Filtramos por ID de relación (estándar de JHipster Query Service)
      if (moduleId) {
        params['moduleId.equals'] = moduleId;
      }
      if (profileId) {
        params['profileId.equals'] = profileId;
      }

      const response = await axios.get('/api/module-permissions', { params });
      setModulePermissionList(response.data);
      setTotalItems(parseInt(response.headers['x-total-count'], 10) || 0);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationState, filters]);

  const syncQueryParams = () => {
    const params = new URLSearchParams();
    params.set('page', paginationState.activePage.toString());
    params.set('sort', `${paginationState.sort},${paginationState.order}`);
    if (filters.moduleId) params.set('moduleId', filters.moduleId);
    if (filters.profileId) params.set('profileId', filters.profileId);

    navigate(`${pageLocation.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    dispatch(reset());
    dispatch(getModules({})); // Cargamos módulos para el select
    dispatch(getProfiles({})); // Cargamos perfiles para el select
  }, []);

  useEffect(() => {
    getAllEntities();
    syncQueryParams();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage, filters]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPaginationState(prev => ({ ...prev, activePage: 1 })); // Reset a pág 1 al cambiar filtro
  };

  const clearFilters = () => {
    setFilters({ moduleId: '', profileId: '' });
    setPaginationState(prev => ({ ...prev, activePage: 1 }));
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

  const renderBooleanIcon = (value: boolean | null | undefined) => <Input type="checkbox" checked={!!value} readOnly disabled />;

  return (
    <div className="module-permission-management container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <div className="user-icon-bg me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faShieldAlt} size="2x" />
        </div>
        <h2 className="mb-0 fw-bold">Permisos Perfil</h2>
      </div>

      {/* --- FORMULARIO DE FILTROS SERIALIZADOS --- */}
      <Card className="filter-card mb-4 border-0 shadow-sm">
        <CardHeader className="bg-white d-flex align-items-center justify-content-center py-2">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-muted" />
          <span className="fw-bold text-secondary">Filtros de Búsqueda</span>
        </CardHeader>
        <hr className="m-0" />
        <CardBody className="filter-card-body">
          <Row className="align-items-center justify-content-center">
            {/* SELECT MÓDULO */}
            <Col md="4" className="mb-3">
              <label className="form-label small fw-bold">Filtrar por Módulo</label>
              <Input type="select" name="moduleId" value={filters.moduleId} onChange={handleFilterChange}>
                <option value="">Todos los módulos</option>
                {modules.map(it => (
                  <option value={it.id} key={it.id}>
                    {it.nombre}
                  </option>
                ))}
              </Input>
            </Col>

            {/* SELECT PERFIL */}
            <Col md="4" className="mb-3">
              <label className="form-label small fw-bold">Filtrar por Perfil</label>
              <Input type="select" name="profileId" value={filters.profileId} onChange={handleFilterChange}>
                <option value="">Todos los perfiles</option>
                {profiles.map(it => (
                  <option value={it.id} key={it.id}>
                    {it.name}
                  </option>
                ))}
              </Input>
            </Col>

            <Col xs="12" className="d-flex justify-content-center gap-3 mt-2">
              <Button color="primary" type="submit" className="px-4 shadow-sm">
                <FontAwesomeIcon icon={faSearch} /> Buscar
              </Button>
              <Button color="secondary" type="button" onClick={clearFilters} className="px-4 shadow-sm">
                <FontAwesomeIcon icon={faEraser} /> Limpiar
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted small fw-bold">Resultados de búsqueda</div>
        <div className="d-flex gap-2">
          <Button color="info" onClick={getAllEntities} disabled={loading} className="shadow-sm text-white">
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refrescar
          </Button>
          <Link to="/seguridad/profile-permissions-matrix" className="btn btn-primary shadow-sm">
            <FontAwesomeIcon icon={faShieldAlt} /> Asignar permisos
          </Link>
          {perm.canCreate && (
            <Link to="/seguridad/profile-permissions-create" className="btn btn-success shadow-sm">
              <FontAwesomeIcon icon={faPlus} /> Nuevo Permiso
            </Link>
          )}
        </div>
      </div>

      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('module.nombre')}>
                Módulo <FontAwesomeIcon icon={getSortIconByFieldName('module.nombre')} />
              </th>
              <th className="hand" onClick={sort('profile.name')}>
                Perfil <FontAwesomeIcon icon={getSortIconByFieldName('profile.name')} />
              </th>
              <th className="text-center">Crear</th>
              <th className="text-center">Editar</th>
              <th className="text-center">Borrar</th>
              <th className="text-center">Ver</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modulePermissionList && modulePermissionList.length > 0
              ? modulePermissionList.map((item, i) => (
                  <tr key={item.id}>
                    <td className="fw-bold text-secondary">{item.module?.nombre || 'Sin Módulo'}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-primary border">{item.profile?.name}</span>
                    </td>
                    <td className="text-center">{renderBooleanIcon(item.canCreate)}</td>
                    <td className="text-center">{renderBooleanIcon(item.canEdit)}</td>
                    <td className="text-center">{renderBooleanIcon(item.canDelete)}</td>
                    <td className="text-center">{renderBooleanIcon(item.canView)}</td>
                    <td className="text-center">
                      <div className="btn-group">
                        {perm.canView && (
                          <Button
                            tag={Link}
                            to={`/seguridad/profile-permissions-detail/${item.id}`}
                            color="link"
                            size="sm"
                            className="text-info"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        )}
                        {perm.canEdit && (
                          <Button
                            tag={Link}
                            to={`/seguridad/profile-permissions-update/${item.id}`}
                            color="link"
                            size="sm"
                            className="text-primary"
                          >
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Button>
                        )}
                        {perm.canDelete && (
                          <Button
                            onClick={() => navigate(`/seguridad/profile-permissions-delete/${item.id}`)}
                            color="link"
                            size="sm"
                            className="text-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No se encontraron registros con los filtros seleccionados.
                    </td>
                  </tr>
                )}
          </tbody>
        </Table>
      </div>

      {/* Paginación (Se mantiene igual) */}
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

export default ProfilePermissionsManagement;

import './profile-management.scss';

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
  faIdCard,
  faSync,
  faEraser,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // 👈 Importación de Axios
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { IProfile } from 'app/shared/model/profile.model';

// Al principio de tus imports
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';
import { reset } from './profile.reducer'; // Asegúrate de que la ruta sea correcta

export const ProfileManagement = () => {
  const dispatch = useAppDispatch();
  const perm = usePermission('Perfil');
  const pageLocation = useLocation();
  const navigate = useNavigate();

  // --- ESTADOS LOCALES (Sustituyen al Reducer) ---
  // Antes: const [profileList, setProfileList] = useState([]);
  const [profileList, setProfileList] = useState<IProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [allProfilesForFilter, setAllProfilesForFilter] = useState<IProfile[]>([]);

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(pageLocation.search);
    return {
      name: params.get('name') || '',
      active: params.get('active') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    sort: 'id',
    order: ASC,
  });

  // --- FUNCIÓN PRINCIPAL DE AXIOS ---
  const getAllEntities = useCallback(async () => {
    setLoading(true);
    if (loading) return loading;
    try {
      const { name, active } = filters;

      // Construimos un objeto de params limpio
      const params: any = {
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      };

      // SOLO agrega filtros si tienen valor, para evitar enviar strings vacíos
      if (name.trim() !== '') {
        params['name.contains'] = name; // 👈 JHipster suele usar .contains para strings
      }

      if (active !== '') {
        params['active.equals'] = active === 'true'; // 👈 Convertir string a boolean real
      }

      const response = await axios.get('/api/profiles', { params });

      setProfileList(response.data);
      setTotalItems(parseInt(response.headers['x-total-count'], 10) || 0);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationState, filters]);

  const syncQueryParams = () => {
    const params = new URLSearchParams();
    params.set('page', paginationState.activePage.toString());
    params.set('sort', `${paginationState.sort},${paginationState.order}`);

    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        params.set(key, filters[key]);
      }
    });

    navigate(`${pageLocation.pathname}?${params.toString()}`, { replace: true });
  };

  // --- EFECTO PARA LIMPIAR EL BUG DE REFRESCO ---
  useEffect(() => {
    dispatch(reset());

    // Cargamos una lista completa solo para el dropdown de filtros
    const fetchAll = async () => {
      try {
        const res = await axios.get('/api/profiles', { params: { size: 100 } });
        setAllProfilesForFilter(res.data);
      } catch (e) {
        console.error('Error cargando perfiles para filtro', e);
      }
    };

    fetchAll();
  }, []);

  // Carga inicial y cambios en paginación
  useEffect(() => {
    getAllEntities();
    syncQueryParams();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]);

  // Debounce para búsqueda por texto
  useEffect(() => {
    const delay = setTimeout(() => {
      if (paginationState.activePage !== 1) {
        setPaginationState(prev => ({ ...prev, activePage: 1 }));
      } else {
        getAllEntities();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [filters.name, filters.active]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    getAllEntities();
  };

  const clearFilters = () => {
    setFilters({ name: '', active: '' });
    setPaginationState(prev => ({ ...prev, activePage: 1 }));
    navigate(pageLocation.pathname, { replace: true });
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

  return (
    <div className="profile-management container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faIdCard} size="2x" />
        </div>
        <h2 className="mb-0 fw-bold">Gestión de Perfiles</h2>
      </div>

      <Card className="filter-card">
        <CardHeader className="d-flex align-items-center justify-content-center py-2">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          <span className="fw-bold">Filtros de Búsqueda</span>
        </CardHeader>
        <hr className="m-0" />
        <CardBody className="filter-card-body">
          <form onSubmit={handleFilterSubmit}>
            <Row className="align-items-center">
              {/* SELECT PERFIL */}
              <Col md="4" className="mb-3">
                <label className="form-label small fw-bold">Filtrar por Perfil</label>
                <Input type="select" name="name" value={filters.name} onChange={handleFilterChange}>
                  <option value="">Todos los perfiles</option>
                  {allProfilesForFilter.map(it => (
                    <option value={it.name} key={it.id}>
                      {it.name}
                    </option>
                  ))}
                </Input>
              </Col>

              <Col md="4" className="mb-3">
                <label className="form-label small fw-bold">Estado</label>
                <select className="form-select" name="active" value={filters.active} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
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
          </form>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted small fw-bold">Resultados de búsqueda</div>
        <div className="d-flex gap-2">
          <Button color="info" onClick={getAllEntities} disabled={loading} className="shadow-sm text-white">
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refrescar
          </Button>
          {perm.canCreate && (
            <Button tag={Link} to="/seguridad/profiles-create" color="success" className="shadow-sm">
              <FontAwesomeIcon icon={faPlus} /> Nuevo Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('name')}>
                Perfil <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
              </th>
              <th className="hand text-center" onClick={sort('active')}>
                Estado <FontAwesomeIcon icon={getSortIconByFieldName('active')} />
              </th>
              <th className="hand text-center" onClick={sort('isSuperAdmin')}>
                Superadministrador <FontAwesomeIcon icon={getSortIconByFieldName('isSuperAdmin')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profileList && profileList.length > 0
              ? profileList.map((profile, i) => (
                  <tr key={profile.id}>
                    <td className="fw-bold text-secondary">{profile.name}</td>
                    <td className="text-center">
                      {profile.active ? (
                        <span className="text-success fw-bold">ACTIVO</span>
                      ) : (
                        <span className="text-danger fw-bold">INACTIVO</span>
                      )}
                    </td>
                    <td className="text-center">
                      <Input type="checkbox" checked={profile.isSuperAdmin || false} readOnly disabled />
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                        {perm.canView && (
                          <Button tag={Link} to={`/seguridad/profiles-detail/${profile.id}`} color="link" size="sm" className="text-info">
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        )}
                        {perm.canEdit && (
                          <Button
                            tag={Link}
                            to={`/seguridad/profiles-update/${profile.id}`}
                            color="link"
                            size="sm"
                            className="text-primary"
                          >
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Button>
                        )}
                        {perm.canDelete && (
                          <Button
                            onClick={() => navigate(`/seguridad/profiles-delete/${profile.id}`)}
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
                    <td colSpan={4} className="text-center py-4">
                      No se encontraron perfiles.
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

export default ProfileManagement;

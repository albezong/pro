import './modules-center.scss';

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Col, Row, Card, CardBody, CardHeader, Badge, Input } from 'reactstrap';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faEye,
  faPencilAlt,
  faTrash,
  faCubes, // Icono congruente para Módulos
  faSync,
  faEraser,
  faSearch,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch } from 'app/config/store';
import { reset } from './modules.reducer';
import { usePermission } from 'app/shared/auth/use-permission';
import { IModules } from 'app/shared/model/modules.model'; // Ajusta la ruta si es necesario

export const ModulesManagement = () => {
  const dispatch = useAppDispatch();
  const perm = usePermission('Modulos');
  const pageLocation = useLocation();
  const navigate = useNavigate();

  // --- ESTADOS LOCALES ---
  const [modulesList, setModulesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [allModulesForFilter, setAllModulesForFilter] = useState<any[]>([]);

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(pageLocation.search);
    return {
      nombre: params.get('nombre') || '',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    sort: 'id',
    order: ASC,
  });

  // --- FUNCIÓN PRINCIPAL DE FETCH ---
  const getAllEntities = useCallback(async () => {
    setLoading(true);
    try {
      const { nombre } = filters;
      const params: any = {
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      };

      if (nombre.trim() !== '') {
        params['nombre.contains'] = nombre;
      }

      const response = await axios.get('/api/modules', { params });

      setModulesList(response.data);
      setTotalItems(parseInt(response.headers['x-total-count'], 10) || 0);
    } catch (error) {
      console.error('Error al obtener módulos:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationState, filters]);

  const syncQueryParams = () => {
    const params = new URLSearchParams();
    params.set('page', paginationState.activePage.toString());
    params.set('sort', `${paginationState.sort},${paginationState.order}`);
    if (filters.nombre) params.set('nombre', filters.nombre);

    navigate(`${pageLocation.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const fetchAllForFilter = async () => {
      try {
        // 1. Usamos un número muy alto.
        // 2. Añadimos 'page: 0' explícitamente.
        // 3. Ordenamos por nombre para que el select sea fácil de leer.
        const res = await axios.get('/api/modules', {
          params: {
            page: 0,
            size: 2000, // Forzamos un número exagerado
            sort: 'nombre,asc',
          },
        });

        // Si el backend usa paginación estándar, la lista viene en res.data
        // Pero asegúrate de que no estás recibiendo un objeto con una propiedad 'content'
        const data = res.data.content ? res.data.content : res.data;

        if (Array.isArray(data)) {
          setAllModulesForFilter(data);
        }
      } catch (e) {
        console.error('Error cargando módulos para el filtro', e);
      }
    };

    fetchAllForFilter();
  }, []);

  useEffect(() => {
    getAllEntities();
    syncQueryParams();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    setPaginationState(prev => ({ ...prev, activePage: 1 }));
    getAllEntities();
  };

  const clearFilters = () => {
    setFilters({ nombre: '' });
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

  return (
    <div className="module-management container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faCubes} size="2x" />
        </div>
        <h2 className="mb-0 fw-bold">Gestión de Módulos</h2>
      </div>

      <Card className="filter-card">
        <CardHeader className="bg-white d-flex align-items-center justify-content-center py-2">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-muted" />
          <span className="fw-bold text-secondary">Filtros de Búsqueda</span>
        </CardHeader>
        <hr className="m-0" />
        <CardBody className="filter-card-body">
          <form onSubmit={handleFilterSubmit}>
            <Row className="align-items-center justify-content-center">
              {/* SELECT DE MÓDULO SERIALIZADO */}
              <Col md="4" className="mb-3">
                <label className="form-label small fw-bold">Nombre del Módulo</label>
                <Input type="select" className="form-control" name="nombre" value={filters.nombre} onChange={handleFilterChange}>
                  <option value="">Todos los módulos</option>
                  {allModulesForFilter.map(it => (
                    <option value={it.nombre} key={it.id}>
                      {it.nombre}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col xs="12" className="d-flex justify-content-center gap-3 mt-2">
                <Button color="primary" type="submit" className="custom-btn-search shadow-sm">
                  <FontAwesomeIcon icon={faSearch} /> Buscar
                </Button>
                <Button color="secondary" type="button" onClick={clearFilters} className="custom-btn-clear shadow-sm">
                  <FontAwesomeIcon icon={faEraser} /> Limpiar
                </Button>
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="results-label">Resultados de búsqueda</div>
        <div className="d-flex gap-2">
          <Button color="info" onClick={getAllEntities} disabled={loading} className="shadow-sm text-white border-0">
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refrescar
          </Button>
          {perm.canCreate && (
            <Button tag={Link} to="/seguridad/modules-create" className="custom-btn-add shadow-sm">
              <FontAwesomeIcon icon={faPlus} /> Nuevo Módulo
            </Button>
          )}
        </div>
      </div>

      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0 custom-table">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('nombre')}>
                Nombre del Módulo <FontAwesomeIcon icon={getSortIconByFieldName('nombre')} />
              </th>
              <th className="hand text-center" onClick={sort('fechaCreacion')}>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                Fecha Creación <FontAwesomeIcon icon={getSortIconByFieldName('fechaCreacion')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modulesList.length > 0
              ? modulesList.map((module: any) => (
                  <tr key={module.id}>
                    <td className="fw-bold text-secondary">{module.nombre}</td>
                    <td className="text-center text-muted">
                      {module.fechaCreacion ? <TextFormat type="date" value={module.fechaCreacion} format={APP_LOCAL_DATE_FORMAT} /> : '-'}
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                        {perm.canView && (
                          <Button tag={Link} to={`/seguridad/modules-detail/${module.id}`} color="link" size="sm" className="text-info">
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        )}
                        {perm.canEdit && (
                          <Button tag={Link} to={`/seguridad/modules-update/${module.id}`} color="link" size="sm" className="text-primary">
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Button>
                        )}
                        {perm.canDelete && (
                          <Button
                            onClick={() => navigate(`/seguridad/modules-delete/${module.id}`)}
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
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No se encontraron módulos registrados.
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

export default ModulesManagement;

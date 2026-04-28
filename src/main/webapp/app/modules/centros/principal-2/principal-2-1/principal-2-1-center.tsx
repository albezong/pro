import './principal-2-1.scss';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Badge } from 'reactstrap';
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
  faProjectDiagram,
  faFlag,
  faCheckDouble,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { usePermission } from 'app/shared/auth/use-permission';
// --- IMPORTACIÓN DE DATOS EXTERNOS ---
import { INITIAL_PROJECTS, IProject21 } from './principal-2-1-data';

export const Principal21Management = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal2-1');

  // --- ESTADOS LOCALES ---
  const [projectsList, setProjectsList] = useState<IProject21[]>(INITIAL_PROJECTS);
  const [filters, setFilters] = useState({ nombre: '' });
  const [totalItems, setTotalItems] = useState(INITIAL_PROJECTS.length);

  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: 5,
    sort: 'id',
    order: 'asc',
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const handlePagination = currentPage => setPaginationState({ ...paginationState, activePage: currentPage });

  // --- LÓGICA DE FILTRADO ---
  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    const filtered = INITIAL_PROJECTS.filter(p => p.nombre.toLowerCase().includes(filters.nombre.toLowerCase()));
    setProjectsList(filtered);
    setTotalItems(filtered.length);
  };

  const clearFilters = () => {
    setFilters({ nombre: '' });
    setProjectsList(INITIAL_PROJECTS);
    setTotalItems(INITIAL_PROJECTS.length);
  };

  // --- LÓGICA DE ORDENAMIENTO ---
  const sort = p => () => {
    const isAsc = paginationState.sort === p && paginationState.order === 'asc';
    setPaginationState({ ...paginationState, order: isAsc ? 'desc' : 'asc', sort: p });

    const sorted = [...projectsList].sort((a, b) => {
      if (a[p] < b[p]) return isAsc ? 1 : -1;
      if (a[p] > b[p]) return isAsc ? -1 : 1;
      return 0;
    });
    setProjectsList(sorted);
  };

  const getSortIconByFieldName = (fieldName: string) => {
    return paginationState.sort !== fieldName ? faSort : paginationState.order === 'asc' ? faSortUp : faSortDown;
  };

  const getPriorityBadge = (prioridad: string) => {
    const colors = { Alta: 'danger', Media: 'warning', Baja: 'info' };
    return <Badge color={colors[prioridad] || 'secondary'}>{prioridad}</Badge>;
  };

  return (
    <div className="principal21 container-fluid py-4">
      {/* ENCABEZADO */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faProjectDiagram} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Gestión de Principal 2.1</h2>
          <p className="text-muted mb-0">Control de ejecuciones para proyectos operativos</p>
        </div>
      </div>

      {/* ACCIONES SUPERIORES */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2 align-items-center">{/* Aquí podrías poner el input de búsqueda si lo necesitas */}</div>
        <div className="d-flex gap-2">
          {perm.canCreate && (
            <Button tag={Link} to="/principal-2-routes/principal-2-1-create" color="primary" className="shadow-sm">
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Proyecto
            </Button>
          )}
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('nombre')}>
                Proyecto <FontAwesomeIcon icon={getSortIconByFieldName('nombre')} />
              </th>
              <th className="hand text-center" onClick={sort('prioridad')}>
                <FontAwesomeIcon icon={faFlag} className="me-1" /> Prioridad <FontAwesomeIcon icon={getSortIconByFieldName('prioridad')} />
              </th>
              <th className="hand text-center" onClick={sort('estado')}>
                <FontAwesomeIcon icon={faCheckDouble} className="me-1" /> Estado <FontAwesomeIcon icon={getSortIconByFieldName('estado')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projectsList.length > 0 ? (
              projectsList.map(item => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.nombre}</td>
                  <td className="text-center">{getPriorityBadge(item.prioridad)}</td>
                  <td className="text-center">
                    <span className="small text-uppercase fw-bold text-secondary">{item.estado}</span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      {perm.canView && (
                        <Button
                          tag={Link}
                          to={`/principal-2-routes/principal-2-1-detail/${item.id}`}
                          color="link"
                          size="sm"
                          className="text-info"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      )}

                      {/* Editar — solo si canEdit */}
                      {perm.canEdit && (
                        <Button
                          tag={Link}
                          to={`/principal-2-routes/principal-2-1-update/${item.id}`}
                          color="link"
                          size="sm"
                          className="text-primary"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>
                      )}

                      {/* Eliminar — solo si canDelete */}
                      {perm.canDelete && (
                        <Button
                          tag={Link}
                          to={`/principal-2-routes/principal-2-1-delete/${item.id}`}
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
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINACIÓN ESTÁTICA */}
      {totalItems > 0 && (
        <div className="mt-4 mb-5">
          <div className="d-flex justify-content-center mb-3 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2 text-secondary flex-wrap justify-content-center text-center">
              <h6 className="m-0 d-flex align-items-center gap-2">
                Mostrando
                <select
                  className="form-select form-select-sm shadow-sm"
                  style={{ width: '70px', borderRadius: '8px' }}
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
                </select>
                registros por página
                <span className="mx-2 fw-normal text-muted">|</span>
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

export default Principal21Management;

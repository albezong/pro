import './principal-2-2.scss';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Card, CardBody, CardHeader, Badge } from 'reactstrap';
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
  faSync,
  faEraser,
  faSearch,
  faTasks,
  faUserCircle,
  faHourglassHalf,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import { usePermission } from 'app/shared/auth/use-permission';
import { INITIAL_TASKS, IPrincipal22Task } from './principal-2-2-data';

export const Principal22Management = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal2-2');

  const [tasksList, setTasksList] = useState<IPrincipal22Task[]>(INITIAL_TASKS);
  const [filters, setFilters] = useState({ search: '' });
  const [totalItems, setTotalItems] = useState(INITIAL_TASKS.length);
  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: 5,
    sort: 'id',
    order: 'asc',
  });

  const handlePagination = currentPage => setPaginationState({ ...paginationState, activePage: currentPage });

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilterSubmit = e => {
    e.preventDefault();
    const filtered = INITIAL_TASKS.filter(
      t =>
        t.tarea.toLowerCase().includes(filters.search.toLowerCase()) || t.responsable.toLowerCase().includes(filters.search.toLowerCase()),
    );
    setTasksList(filtered);
  };

  const clearFilters = () => {
    setFilters({ search: '' });
    setTasksList(INITIAL_TASKS);
  };

  const sort = p => () => {
    const isAsc = paginationState.sort === p && paginationState.order === 'asc';
    setPaginationState({ ...paginationState, order: isAsc ? 'desc' : 'asc', sort: p });
    const sorted = [...tasksList].sort((a, b) => {
      if (a[p] < b[p]) return isAsc ? 1 : -1;
      if (a[p] > b[p]) return isAsc ? -1 : 1;
      return 0;
    });
    setTasksList(sorted);
  };

  const getSortIconByFieldName = (fieldName: string) =>
    paginationState.sort !== fieldName ? faSort : paginationState.order === 'asc' ? faSortUp : faSortDown;

  return (
    <div className="principal22 container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-info">
          <FontAwesomeIcon icon={faClipboardList} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Planificación de Tareas</h2>
          <p className="text-muted mb-0">Principal 2.2 - Detalle operativo por responsable</p>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="results-label fw-bold text-primary"></div>
        <div className="d-flex gap-2">
          {perm.canCreate && (
            <Button tag={Link} to="/principal-2-routes/principal-2-2-create" color="info" className="text-white shadow-sm">
              <FontAwesomeIcon icon={faPlus} /> Nueva Tarea
            </Button>
          )}
        </div>
      </div>

      {/* TABLA */}
      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0 custom-table">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('tarea')}>
                <FontAwesomeIcon icon={faTasks} className="me-1" /> Tarea <FontAwesomeIcon icon={getSortIconByFieldName('tarea')} />
              </th>
              <th className="hand" onClick={sort('responsable')}>
                <FontAwesomeIcon icon={faUserCircle} className="me-1" /> Responsable{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('responsable')} />
              </th>
              <th className="hand text-center" onClick={sort('tiempo')}>
                <FontAwesomeIcon icon={faHourglassHalf} className="me-1" /> Estimación{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('tiempo')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasksList.length > 0 ? (
              tasksList.map(task => (
                <tr key={task.id}>
                  <td>
                    <div className="fw-bold">{task.tarea}</div>
                    <small className="text-muted">{task.categoria}</small>
                  </td>
                  <td className="text-secondary">{task.responsable}</td>
                  <td className="text-center fw-bold text-primary">{task.tiempo}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      {/* Ver — siempre visible si puede entrar al módulo */}
                      {perm.canView && (
                        <Button
                          tag={Link}
                          to={`/principal-2-routes/principal-2-2-detail/${task.id}`}
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
                          to={`/principal-2-routes/principal-2-2-update/${task.id}`}
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
                          to={`/principal-2-routes/principal-2-2-delete/${task.id}`}
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
                <td colSpan={5} className="text-center py-5 text-muted">
                  No hay tareas pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINACIÓN */}
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
                  onChange={e => setPaginationState({ ...paginationState, itemsPerPage: parseInt(e.target.value, 10), activePage: 1 })}
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

export default Principal22Management;

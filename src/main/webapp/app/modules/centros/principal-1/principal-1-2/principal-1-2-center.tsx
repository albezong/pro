import './principal-1-2.scss'; // Reutiliza tus estilos para mantener el diseño idéntico
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Badge, Progress } from 'reactstrap';
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
  faUserTie,
  faMicrochip,
  faChartLine,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { usePermission } from 'app/shared/auth/use-permission';
// Al principio de tu archivo Principal12Management.tsx
import { INITIAL_DATA_12 } from './principal-1-2-data';

export const Principal12Management = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal1-2');

  // --- ESTADOS LOCALES ---
  const [itemsList, setItemsList] = useState(INITIAL_DATA_12);
  const [totalItems, setTotalItems] = useState(INITIAL_DATA_12.length);

  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: 5,
    sort: 'id',
    order: 'asc',
  });

  const handlePagination = currentPage => setPaginationState({ ...paginationState, activePage: currentPage });

  const sort = p => () => {
    const isAsc = paginationState.sort === p && paginationState.order === 'asc';
    setPaginationState({
      ...paginationState,
      order: isAsc ? 'desc' : 'asc',
      sort: p,
    });

    const sortedData = [...itemsList].sort((a, b) => {
      if (a[p] < b[p]) return isAsc ? 1 : -1;
      if (a[p] > b[p]) return isAsc ? -1 : 1;
      return 0;
    });
    setItemsList(sortedData);
  };

  const getSortIconByFieldName = (fieldName: string) => {
    return paginationState.sort !== fieldName ? faSort : paginationState.order === 'asc' ? faSortUp : faSortDown;
  };

  // Color de la barra de progreso según la carga
  const getProgressColor = (carga: number) => {
    if (carga > 80) return 'danger';
    if (carga > 50) return 'warning';
    return 'success';
  };

  return (
    <div className="principal12 container-fluid py-4">
      {/* HEADER IDÉNTICO AL 1.1 */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-info">
          <FontAwesomeIcon icon={faLayerGroup} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Gestión de Principal 1.2</h2>
          <small className="text-muted">Monitoreo y Asignación de Recursos Estáticos</small>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="results-label fw-bold text-secondary"></div>
        <div className="d-flex gap-2">
          {perm.canCreate && (
            <Button tag={Link} to="/principal-1-routes/principal-1-2-create" className="shadow-sm" color="primary">
              <FontAwesomeIcon icon={faPlus} /> Asignar Recurso
            </Button>
          )}
        </div>
      </div>

      {/* TABLA CON MISMO DISEÑO */}
      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0 custom-table">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('recurso')}>
                <FontAwesomeIcon icon={faMicrochip} className="me-1" /> Recurso <FontAwesomeIcon icon={getSortIconByFieldName('recurso')} />
              </th>
              <th className="hand" onClick={sort('responsable')}>
                <FontAwesomeIcon icon={faUserTie} className="me-1" /> Responsable{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('responsable')} />
              </th>
              <th className="hand" onClick={sort('carga')}>
                <FontAwesomeIcon icon={faChartLine} className="me-1" /> Uso de Recurso{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('carga')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.length > 0 ? (
              itemsList.map((item: any) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.recurso}</td>
                  <td className="text-secondary">{item.responsable}</td>
                  <td style={{ minWidth: '150px' }}>
                    <div className="d-flex align-items-center gap-2">
                      <Progress
                        value={item.carga}
                        color={getProgressColor(item.carga)}
                        style={{ height: '8px', flexGrow: 1 }}
                        className="rounded-pill"
                      />
                      <small className="fw-bold">{item.carga}%</small>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      {/* Ver — siempre visible si puede entrar al módulo */}
                      {perm.canView && (
                        <Button
                          tag={Link}
                          to={`/principal-1-routes/principal-1-2-detail/${item.id}`}
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
                          to={`/principal-1-routes/principal-1-2-update/${item.id}`}
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
                          to={`/principal-1-routes/principal-1-2-delete/${item.id}`}
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
                  No hay recursos asignados en la vista 1.2.
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

export default Principal12Management;

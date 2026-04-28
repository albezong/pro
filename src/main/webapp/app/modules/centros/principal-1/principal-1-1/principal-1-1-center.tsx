import './principal-1-1.scss';
import React, { useEffect, useState } from 'react';
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
  faCalendarAlt,
  faSitemap,
  faCode,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { usePermission } from 'app/shared/auth/use-permission';
// --- IMPORTACIÓN DE DATOS EXTERNOS ---
import { INITIAL_DATA } from './principal-1-1-data';

export const Principal11Management = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal1-1');

  // --- ESTADOS LOCALES ---
  const [itemsList, setItemsList] = useState(INITIAL_DATA);
  const [totalItems, setTotalItems] = useState(INITIAL_DATA.length);

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

    // Lógica de ordenamiento estático
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

  return (
    <div className="principal11 container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faSitemap} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Gestión de Principal 1.1</h2>
          <small className="text-muted">Administración estática de componentes de sistema</small>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted small fw-bold"></div>
        <div className="d-flex gap-2">
          {perm.canCreate && (
            <Button tag={Link} to="/principal-1-routes/principal-1-1-create" className="shadow-sm" color="primary">
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Registro
            </Button>
          )}
        </div>
      </div>

      {/* TABLA */}
      <div className="table-responsive shadow-sm bg-white rounded border">
        <Table hover striped className="mb-0 custom-table">
          <thead className="table-dark">
            <tr>
              <th className="hand" onClick={sort('codigo')}>
                <FontAwesomeIcon icon={faCode} className="me-1" /> Código <FontAwesomeIcon icon={getSortIconByFieldName('codigo')} />
              </th>
              <th className="hand" onClick={sort('version')}>
                <FontAwesomeIcon icon={faTag} className="me-1" /> Versión <FontAwesomeIcon icon={getSortIconByFieldName('version')} />
              </th>
              <th className="hand text-center" onClick={sort('fechaRevision')}>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Última Revisión{' '}
                <FontAwesomeIcon icon={getSortIconByFieldName('fechaRevision')} />
              </th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.length > 0 ? (
              itemsList.map((item: any) => (
                <tr key={item.id}>
                  <td className="fw-bold text-primary">{item.codigo}</td>
                  <td className="text-center">
                    <Badge color="info" pill outline className="justify-center">
                      v{item.version}
                    </Badge>
                  </td>
                  <td className="text-center text-muted">{item.fechaRevision}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      {/* Ver — siempre visible si puede entrar al módulo */}
                      {perm.canView && (
                        <Button
                          tag={Link}
                          to={`/principal-1-routes/principal-1-1-detail/${item.id}`}
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
                          to={`/principal-1-routes/principal-1-1-update/${item.id}`}
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
                          to={`/principal-1-routes/principal-1-1-delete/${item.id}`}
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
                  No hay datos disponibles en la vista estática.
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

export default Principal11Management;

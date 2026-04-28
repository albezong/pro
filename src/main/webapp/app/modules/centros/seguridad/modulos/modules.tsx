import React, { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Table } from 'reactstrap';

import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from '../../../../entities/module-permission/module-permission.reducer';

export const ModulePermission = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const modulePermissionList = useAppSelector(state => state.modulePermission.entities);

  const loading = useAppSelector(state => state.modulePermission.loading);

  const totalItems = useAppSelector(state => state.modulePermission.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,

        size: paginationState.itemsPerPage,

        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();

    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);

    const page = params.get('page');

    const sort = params.get(SORT);

    if (page && sort) {
      const sortSplit = sort.split(',');

      setPaginationState({
        ...paginationState,

        activePage: +page,

        sort: sortSplit[0],

        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,

      order: paginationState.order === ASC ? DESC : ASC,

      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,

      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;

    const order = paginationState.order;

    if (sortFieldName !== fieldName) {
      return faSort;
    }

    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="module-permission-heading" data-cy="ModulePermissionHeading">
        <Translate contentKey="proyecto3UJhipsterApp.modulePermission.home.title">Module Permissions</Translate>

        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="proyecto3UJhipsterApp.modulePermission.home.refreshListLabel">Refresh List</Translate>
          </Button>

          <Link to="/module-permission/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="proyecto3UJhipsterApp.modulePermission.home.createLabel">Create new Module Permission</Translate>
          </Link>
        </div>
      </h2>

      <div className="table-responsive">
        {modulePermissionList && modulePermissionList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>

                <th className="hand" onClick={sort('moduleName')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.moduleName">Module Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('moduleName')} />
                </th>

                <th className="hand" onClick={sort('canCreate')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canCreate">Can Create</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canCreate')} />
                </th>

                <th className="hand" onClick={sort('canEdit')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canEdit">Can Edit</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canEdit')} />
                </th>

                <th className="hand" onClick={sort('canDelete')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canDelete">Can Delete</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canDelete')} />
                </th>

                <th className="hand" onClick={sort('canView')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canView">Can View</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canView')} />
                </th>

                <th className="hand" onClick={sort('canPrint')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canPrint">Can Print</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canPrint')} />
                </th>

                <th className="hand" onClick={sort('canHistory')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canHistory">Can History</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canHistory')} />
                </th>

                <th className="hand" onClick={sort('canExtra')}>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canExtra">Can Extra</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canExtra')} />
                </th>

                <th>
                  <Translate contentKey="proyecto3UJhipsterApp.modulePermission.profile">Profile</Translate> <FontAwesomeIcon icon="sort" />
                </th>

                <th />
              </tr>
            </thead>

            <tbody>
              {modulePermissionList.map((modulePermission, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/module-permission/${modulePermission.id}`} color="link" size="sm">
                      {modulePermission.id}
                    </Button>
                  </td>

                  <td>{modulePermission.moduleName}</td>

                  <td>{modulePermission.canCreate ? 'true' : 'false'}</td>

                  <td>{modulePermission.canEdit ? 'true' : 'false'}</td>

                  <td>{modulePermission.canDelete ? 'true' : 'false'}</td>

                  <td>{modulePermission.canView ? 'true' : 'false'}</td>

                  <td>{modulePermission.canPrint ? 'true' : 'false'}</td>

                  <td>{modulePermission.canHistory ? 'true' : 'false'}</td>

                  <td>{modulePermission.canExtra ? 'true' : 'false'}</td>

                  <td>
                    {modulePermission.profile ? (
                      <Link to={`/profile/${modulePermission.profile.id}`}>{modulePermission.profile.name}</Link>
                    ) : (
                      ''
                    )}
                  </td>

                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/module-permission/${modulePermission.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>

                      <Button
                        tag={Link}
                        to={`/module-permission/${modulePermission.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>

                      <Button
                        onClick={() =>
                          (window.location.href = `/module-permission/${modulePermission.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.home.notFound">No Module Permissions found</Translate>
            </div>
          )
        )}
      </div>

      {totalItems ? (
        <div className={modulePermissionList && modulePermissionList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>

          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default ModulePermission;

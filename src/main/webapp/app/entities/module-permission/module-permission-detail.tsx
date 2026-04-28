import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './module-permission.reducer';

export const ModulePermissionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const modulePermissionEntity = useAppSelector(state => state.modulePermission.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="modulePermissionDetailsHeading">
          <Translate contentKey="proyecto3UJhipsterApp.modulePermission.detail.title">ModulePermission</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.id}</dd>
          <dt>
            <span id="canCreate">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canCreate">Can Create</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.canCreate ? 'true' : 'false'}</dd>
          <dt>
            <span id="canEdit">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canEdit">Can Edit</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.canEdit ? 'true' : 'false'}</dd>
          <dt>
            <span id="canDelete">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canDelete">Can Delete</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.canDelete ? 'true' : 'false'}</dd>
          <dt>
            <span id="canView">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canView">Can View</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.canView ? 'true' : 'false'}</dd>
          <dt>
            <span id="canHistory">
              <Translate contentKey="proyecto3UJhipsterApp.modulePermission.canHistory">Can History</Translate>
            </span>
          </dt>
          <dd>{modulePermissionEntity.canHistory ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="proyecto3UJhipsterApp.modulePermission.module">Module</Translate>
          </dt>
          <dd>{modulePermissionEntity.module ? modulePermissionEntity.module.nombre : ''}</dd>
          <dt>
            <Translate contentKey="proyecto3UJhipsterApp.modulePermission.profile">Profile</Translate>
          </dt>
          <dd>{modulePermissionEntity.profile ? modulePermissionEntity.profile.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/module-permission" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/module-permission/${modulePermissionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ModulePermissionDetail;

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './modules.reducer';

export const ModulesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const modulesEntity = useAppSelector(state => state.modules.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="modulesDetailsHeading">
          <Translate contentKey="proyecto3UJhipsterApp.modules.detail.title">Modules</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{modulesEntity.id}</dd>
          <dt>
            <span id="nombre">
              <Translate contentKey="proyecto3UJhipsterApp.modules.nombre">Nombre</Translate>
            </span>
          </dt>
          <dd>{modulesEntity.nombre}</dd>
          <dt>
            <span id="fechaCreacion">
              <Translate contentKey="proyecto3UJhipsterApp.modules.fechaCreacion">Fecha Creacion</Translate>
            </span>
          </dt>
          <dd>
            {modulesEntity.fechaCreacion ? (
              <TextFormat value={modulesEntity.fechaCreacion} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/modules" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/modules/${modulesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ModulesDetail;

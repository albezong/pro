import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './profile.reducer';

export const ProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const profileEntity = useAppSelector(state => state.profile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="profileDetailsHeading">
          <Translate contentKey="proyecto3UJhipsterApp.profile.detail.title">Profile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{profileEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="proyecto3UJhipsterApp.profile.name">Name</Translate>
            </span>
          </dt>
          <dd>{profileEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="proyecto3UJhipsterApp.profile.description">Description</Translate>
            </span>
          </dt>
          <dd>{profileEntity.description}</dd>
          <dt>
            <span id="active">
              <Translate contentKey="proyecto3UJhipsterApp.profile.active">Active</Translate>
            </span>
          </dt>
          <dd>{profileEntity.active ? 'true' : 'false'}</dd>
          <dt>
            <span id="isSuperAdmin">
              <Translate contentKey="proyecto3UJhipsterApp.profile.isSuperAdmin">Is Super Admin</Translate>
            </span>
          </dt>
          <dd>{profileEntity.isSuperAdmin ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="proyecto3UJhipsterApp.profile.user">User</Translate>
          </dt>
          <dd>
            {profileEntity.users
              ? profileEntity.users.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.login}</a>
                    {profileEntity.users && i === profileEntity.users.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/profile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/profile/${profileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProfileDetail;

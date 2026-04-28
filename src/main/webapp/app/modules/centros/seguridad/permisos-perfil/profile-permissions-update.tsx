import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getModules } from 'app/entities/modules/modules.reducer';
import { getEntities as getProfiles } from 'app/entities/profile/profile.reducer';
import { createEntity, getEntity, reset, updateEntity } from './module-permission.reducer';

export const ProfilePermissionsUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const modules = useAppSelector(state => state.modules.entities);
  const profiles = useAppSelector(state => state.profile.entities);
  const modulePermissionEntity = useAppSelector(state => state.modulePermission.entity);
  const loading = useAppSelector(state => state.modulePermission.loading);
  const updating = useAppSelector(state => state.modulePermission.updating);
  const updateSuccess = useAppSelector(state => state.modulePermission.updateSuccess);

  const handleClose = () => {
    navigate(`/seguridad/profile-permissions-center`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
    dispatch(getModules({}));
    dispatch(getProfiles({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...modulePermissionEntity,
      ...values,
      module: modules.find(it => it.id.toString() === values.module?.toString()),
      profile: profiles.find(it => it.id.toString() === values.profile?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? { canView: false, canCreate: false, canEdit: false, canDelete: false, canHistory: false }
      : {
          ...modulePermissionEntity,
          module: modulePermissionEntity?.module?.id,
          profile: modulePermissionEntity?.profile?.id,
        };

  return (
    <div className="p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Row className="justify-content-center">
        <Col md="12">
          <h2
            id="proyecto3UJhipsterApp.modulePermission.home.createOrEditLabel"
            data-cy="ModulePermissionCreateUpdateHeading"
            className="h4 fw-bold"
          >
            <Translate contentKey="proyecto3UJhipsterApp.modulePermission.home.createOrEditLabel">
              Create or edit a ModulePermission
            </Translate>
          </h2>
          <hr />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              <ValidatedField
                label={translate('proyecto3UJhipsterApp.modulePermission.canCreate')}
                id="module-permission-canCreate"
                name="canCreate"
                data-cy="canCreate"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('proyecto3UJhipsterApp.modulePermission.canEdit')}
                id="module-permission-canEdit"
                name="canEdit"
                data-cy="canEdit"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('proyecto3UJhipsterApp.modulePermission.canDelete')}
                id="module-permission-canDelete"
                name="canDelete"
                data-cy="canDelete"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('proyecto3UJhipsterApp.modulePermission.canView')}
                id="module-permission-canView"
                name="canView"
                data-cy="canView"
                check
                type="checkbox"
              />
              <ValidatedField
                id="module-permission-module"
                name="module"
                data-cy="module"
                label={translate('proyecto3UJhipsterApp.modulePermission.module')}
                type="select"
              >
                <option value="" key="0" />
                {modules
                  ? modules.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.nombre}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="module-permission-profile"
                name="profile"
                data-cy="profile"
                label={translate('proyecto3UJhipsterApp.modulePermission.profile')}
                type="select"
              >
                <option value="" key="0" />
                {profiles
                  ? profiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/seguridad/profile-permissions-center"
                replace
                color="info"
              >
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePermissionsUpdate;

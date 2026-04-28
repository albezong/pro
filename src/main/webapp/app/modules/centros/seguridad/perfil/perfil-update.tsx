import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities, updateEntity, createEntity, reset } from './profile.reducer';

export const ProfileUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const profileEntity = useAppSelector(state => state.profile.entity);
  const loading = useAppSelector(state => state.profile.loading);
  const updating = useAppSelector(state => state.profile.updating);
  const updateSuccess = useAppSelector(state => state.profile.updateSuccess);

  const handleClose = () => {
    navigate('/seguridad/profiles-center');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntities(id));
    }
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(isNew ? 'Perfil creado' : 'Perfil actualizado correctamente');
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    // 1. Limpieza del ID
    const entityId = isNew ? undefined : Number(id);

    // 2. Construcción limpia del objeto
    // Priorizamos los valores del formulario (values) sobre la entidad cargada (profileEntity)
    const entity = {
      ...profileEntity, // Datos base
      ...values, // Datos del formulario
      id: entityId, // Forzamos el ID de la URL
      active: !!values.active, // Forzamos booleano real
      isSuperAdmin: !!values.isSuperAdmin, // Forzamos booleano real
      users: mapIdList(values.users),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...profileEntity,
          users: profileEntity?.users?.map(e => e.id.toString()),
        };

  return (
    <div className="p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <div className="d-flex align-items-center mb-3">
            <Button tag={Link} to="/seguridad/profiles-center" color="link" className="text-secondary p-0 me-3">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0">{isNew ? 'Crear Perfil' : 'Actualizar Perfil'}</h3>
          </div>

          <Card className="border-0 shadow-sm">
            <CardBody className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-light p-2 rounded me-3 text-primary">
                  <FontAwesomeIcon icon={faIdCard} size="lg" />
                </div>
                <div>
                  <h5 className="mb-0 text-dark">Información del Perfil</h5>
                  <small className="text-muted">Configura los permisos y usuarios asignados</small>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">Cargando datos...</div>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  <ValidatedField
                    name="name"
                    label="Nombre del Perfil"
                    type="text"
                    minLength={4} // Mínimo de caracteres
                    maxLength={100} // Máximo de caracteres
                    validate={{
                      required: { value: true, message: 'Requerido' },
                      minLength: { value: 4, message: 'El nombre del perfil no puede ser menor a 4 caracteres' },
                      maxLength: { value: 100, message: 'El nombre del perfil no puede exceder los 100 caracteres.' },
                    }}
                  />

                  <ValidatedField
                    name="description"
                    label="Descripción"
                    type="textarea"
                    rows="3"
                    minLength={4} // Mínimo de caracteres
                    maxLength={255} // Máximo de caracteres
                    validate={{
                      required: { value: true, message: 'Requerido' },
                      minLength: { value: 4, message: 'El nombre del perfil no puede ser menor a 4 caracteres' },
                      maxLength: { value: 255, message: 'La descripcion del perfil no puede exceder los 255 caracteres.' },
                    }}
                  />

                  <br />

                  <ValidatedField name="active" label="¿Perfil Activo?" type="checkbox" check isBoolean />

                  <ValidatedField name="isSuperAdmin" label="¿Es Super Administrador?" type="checkbox" check isBoolean />

                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button tag={Link} to="/seguridad/profiles-center" color="secondary" outline>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" disabled={updating}>
                      <FontAwesomeIcon icon={faSave} /> {updating ? ' Guardando...' : ' Guardar Cambios'}
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileUpdate;

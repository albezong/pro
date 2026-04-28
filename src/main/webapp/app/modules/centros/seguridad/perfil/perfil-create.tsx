import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster'; // Añadimos isNumber por si acaso
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { createEntity, reset } from './profile.reducer';

export const ProfileCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(state => state.userManagement.users);
  const updating = useAppSelector(state => state.profile.updating);
  const updateSuccess = useAppSelector(state => state.profile.updateSuccess);

  useEffect(() => {
    dispatch(reset());
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Perfil creado exitosamente');
      navigate('/seguridad/profiles-center');
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    console.warn('Valores crudos del formulario:', values);

    const entity = {
      ...values,
      // Forzamos true/false. Si es undefined, será false.
      active: !!values.active,
      isSuperAdmin: !!values.isSuperAdmin,
      users: values.users ? values.users.map(id => ({ id })) : [],
    };

    dispatch(createEntity(entity));
  };

  return (
    <div className="p-4">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="border-0 shadow-sm">
            <CardBody className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-light p-2 rounded me-3">
                  <FontAwesomeIcon icon={faIdCard} className="text-primary" size="lg" />
                </div>
                <h4 className="mb-0">Nuevo Perfil de Seguridad</h4>
              </div>

              <ValidatedForm onSubmit={saveEntity}>
                {/* NOMBRE */}
                <ValidatedField
                  name="name"
                  label="Nombre del Perfil"
                  type="text"
                  autoFocus // Ayuda a que React registre el campo
                  minLength={4} // Mínimo de caracteres
                  maxLength={100} // Máximo de caracteres
                  validate={{
                    required: { value: true, message: 'Requerido' },
                    minLength: { value: 4, message: 'El nombre del perfil no puede ser menor a 4 caracteres' },
                    maxLength: { value: 100, message: 'El nombre del perfil no puede exceder los 100 caracteres.' },
                  }}
                />

                {/* DESCRIPCIÓN */}
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

                {/* CHECKBOXES - Simplificados al máximo */}
                <ValidatedField
                  name="active"
                  label="¿Perfil Activo?"
                  type="checkbox"
                  check
                  isBoolean // 👈 Agrega esto
                />

                <ValidatedField
                  name="isSuperAdmin"
                  label="¿Es Super Administrador?"
                  type="checkbox"
                  check
                  isBoolean // 👈 Agrega esto
                />

                <br />

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button tag={Link} to="/seguridad/profiles-center" color="secondary" outline>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon={faSave} /> {updating ? ' Guardando...' : ' Guardar Perfil'}
                  </Button>
                </div>
              </ValidatedForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileCreate;

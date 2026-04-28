import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody } from 'reactstrap';
import { ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCubes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, reset } from './modules.reducer';
import dayjs from 'dayjs';

export const ModulesCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updating = useAppSelector(state => state.modules.updating);
  const updateSuccess = useAppSelector(state => state.modules.updateSuccess);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Módulo creado exitosamente');
      navigate('/seguridad/modules-center'); // Ajusta esta ruta si tu listado está en otra dirección
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...values,
      fechaCreacion: dayjs().format('YYYY-MM-DD'),
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
                  <FontAwesomeIcon icon={faCubes} className="text-primary" size="lg" />
                </div>
                <h4 className="mb-0">Nuevo Módulo del Sistema</h4>
              </div>

              <ValidatedForm onSubmit={saveEntity}>
                {/* NOMBRE DEL MÓDULO */}
                <ValidatedField
                  name="nombre"
                  label="Nombre del Módulo"
                  id="modules-nombre"
                  type="text"
                  autoFocus
                  minLength={4} // Mínimo de caracteres
                  maxLength={100} // Máximo de caracteres
                  validate={{
                    required: { value: true, message: 'Requerido' },
                    minLength: { value: 4, message: 'El nombre no puede ser menor a 4 caracteres' },
                    maxLength: { value: 100, message: 'El nombre no puede exceder los 100 caracteres.' },
                  }}
                />

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button tag={Link} to="/seguridad/modules-center" color="secondary" outline>
                    <FontAwesomeIcon icon={faArrowLeft} /> Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon={faSave} />
                    {updating ? ' Guardando...' : ' Guardar Módulo'}
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

export default ModulesCreate;

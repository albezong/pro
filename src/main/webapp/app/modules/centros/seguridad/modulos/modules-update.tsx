import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Spinner } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faCubes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, updateEntity, reset } from './modules.reducer';

export const ModulesUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const modulesEntity = useAppSelector(state => state.modules.entity);
  const loading = useAppSelector(state => state.modules.loading);
  const updating = useAppSelector(state => state.modules.updating);
  const updateSuccess = useAppSelector(state => state.modules.updateSuccess);

  const handleClose = () => {
    navigate('/seguridad/modules-center');
  };

  useEffect(() => {
    // Como es solo lógica de Update, asumimos que el ID siempre existe
    dispatch(getEntity(id));

    return () => {
      dispatch(reset());
    };
  }, [id]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Módulo actualizado correctamente');
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...modulesEntity,
      ...values,
      id: Number(id),
      // La fecha se actualiza automáticamente al momento de hacer el submit
      fechaCreacion: dayjs().format('YYYY-MM-DD'),
    };

    dispatch(updateEntity(entity));
  };

  const defaultValues = () => ({
    ...modulesEntity,
  });

  return (
    <div className="p-4">
      <Row className="justify-content-center">
        <Col md="8">
          {/* Encabezado con botón de regreso */}
          <div className="d-flex align-items-center mb-3">
            <Button onClick={handleClose} color="link" className="text-secondary p-0 me-3">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0">Actualizar Módulo</h3>
          </div>

          <Card className="border-0 shadow-sm">
            <CardBody className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-light p-2 rounded me-3 text-primary">
                  <FontAwesomeIcon icon={faCubes} size="lg" />
                </div>
                <div>
                  <h5 className="mb-0 text-dark">Información del Módulo</h5>
                  <small className="text-muted">Modifica los detalles técnicos del módulo seleccionado</small>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2 text-muted">Cargando datos del módulo...</p>
                </div>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {/* Solo mostramos el nombre, el ID y la fecha se manejan internamente */}
                  <ValidatedField
                    name="nombre"
                    label="Nombre del Módulo"
                    type="text"
                    minLength={4} // Mínimo de caracteres
                    maxLength={100} // Máximo de caracteres
                    validate={{
                      required: { value: true, message: 'Requerido' },
                      minLength: { value: 4, message: 'El nombre no puede ser menor a 4 caracteres' },
                      maxLength: { value: 100, message: 'El nombre no puede exceder los 100 caracteres.' },
                    }}
                  />

                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button onClick={handleClose} color="secondary" outline>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" disabled={updating}>
                      <FontAwesomeIcon icon={faSave} /> {updating ? ' Actualizando...' : ' Guardar Cambios'}
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

export default ModulesUpdate;

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Spinner, Alert } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faArrowLeft,
  faTasks,
  faInfoCircle,
  faUserCircle,
  faHourglassHalf,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS ---
import { INITIAL_TASKS, IPrincipal22Task } from './principal-2-2-data';

export const Principal22Update = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [taskInitialData, setTaskInitialData] = useState<IPrincipal22Task | undefined>(undefined);

  // Obtener la data basada en el id de forma estática
  const staticData = useMemo(() => {
    return INITIAL_TASKS.find(item => item.id === Number(id));
  }, [id]);

  const handleClose = () => {
    navigate('/principal-2-routes/principal-2-2-center');
  };

  useEffect(() => {
    // Simulación de carga estética
    const timer = setTimeout(() => {
      if (staticData) {
        setTaskInitialData(staticData);
      }
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  const saveEntity = values => {
    setUpdating(true);
    // Simulación de guardado estático
    setTimeout(() => {
      setUpdating(false);
      setUpdateSuccess(true);
    }, 1200);
  };

  return (
    <div className="principal22-update p-4">
      <Row className="justify-content-center">
        <Col md="8">
          {/* Encabezado con botón de regreso */}
          <div className="d-flex align-items-center mb-3">
            <Button onClick={handleClose} color="link" className="text-secondary p-0 me-3 shadow-none">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0 fw-bold">Actualizar Tarea Operativa</h3>
          </div>

          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              {!updateSuccess ? (
                <>
                  {/* Header interno del formulario */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light p-2 rounded me-3 text-info">
                      <FontAwesomeIcon icon={faClipboardList} size="lg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-dark fw-bold">Detalle del Cronograma</h5>
                      <small className="text-muted">Ajustando parámetros de la sección 2.2</small>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="info" />
                      <p className="mt-2 text-muted">Recuperando datos de la tarea...</p>
                    </div>
                  ) : (
                    <ValidatedForm defaultValues={taskInitialData} onSubmit={saveEntity}>
                      <Row>
                        {/* NOMBRE DE LA TAREA */}
                        <Col md="12">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">
                              <FontAwesomeIcon icon={faTasks} className="me-2 text-muted" />
                              Descripción de la Tarea
                            </label>
                            <ValidatedField
                              name="tarea"
                              type="text"
                              validate={{
                                required: { value: true, message: 'Este campo es obligatorio.' },
                                maxLength: { value: 150, message: 'Máximo 150 caracteres.' },
                              }}
                            />
                          </div>
                        </Col>

                        {/* RESPONSABLE */}
                        <Col md="6">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">
                              <FontAwesomeIcon icon={faUserCircle} className="me-2 text-muted" />
                              Responsable
                            </label>
                            <ValidatedField
                              name="responsable"
                              type="text"
                              validate={{ required: { value: true, message: 'Debe asignar un responsable.' } }}
                            />
                          </div>
                        </Col>

                        {/* ESTIMACIÓN (TIEMPO) */}
                        <Col md="6">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">
                              <FontAwesomeIcon icon={faHourglassHalf} className="me-1 text-muted" /> Estimación
                            </label>
                            <ValidatedField
                              name="tiempo"
                              type="text"
                              placeholder="Ej: 2h, 1 día..."
                              validate={{ required: { value: true, message: 'Ingrese el tiempo estimado.' } }}
                            />
                          </div>
                        </Col>

                        {/* CATEGORÍA */}
                        <Col md="12">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1 small text-uppercase">Categoría / Etiqueta</label>
                            <ValidatedField name="categoria" type="select">
                              <option value="Desarrollo">Desarrollo</option>
                              <option value="Diseño">Diseño</option>
                              <option value="Infraestructura">Infraestructura</option>
                              <option value="Documentación">Documentación</option>
                            </ValidatedField>
                          </div>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4 gap-2">
                        <Button onClick={handleClose} color="secondary" outline>
                          Cancelar
                        </Button>
                        <Button color="info" type="submit" disabled={updating} className="px-4 shadow-sm text-white">
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          {updating ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                      </div>
                    </ValidatedForm>
                  )}
                </>
              ) : (
                /* MENSAJE DE ÉXITO CON ANIMACIÓN 😉 */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-info fw-bold">¡Tarea actualizada!</h3>
                  <p className="text-muted">Los cambios se han procesado correctamente para esta sesión.</p>

                  <Alert color="primary" className="mt-4 d-inline-block border-0 shadow-sm bg-opacity-10">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-info" />
                    <strong>Simulación:</strong> Los datos son locales y no requieren conexión al servidor.
                  </Alert>

                  <div className="mt-4">
                    <Button color="info" className="px-4 shadow-sm text-white" onClick={handleClose}>
                      Volver a la Planificación
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ESTILOS DE ANIMACIÓN BOUNCE */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .principal22-update .card {
          border-radius: 15px;
        }

        .principal22-update .form-control, 
        .principal22-update .form-select {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Principal22Update;

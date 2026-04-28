import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Spinner, Alert } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faProjectDiagram, faInfoCircle, faFlag, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS ---
import { INITIAL_PROJECTS, IProject21 } from './principal-2-1-data';

export const Principal21Update = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [proyectoInitialData, setProyectoInitialData] = useState<IProject21 | undefined>(undefined);

  // Obtener la data basada en el id para precargar el formulario de forma estática
  const staticData = useMemo(() => {
    return INITIAL_PROJECTS.find(item => item.id === Number(id));
  }, [id]);

  const handleClose = () => {
    navigate('/principal-2-routes/principal-2-1-center');
  };

  useEffect(() => {
    // Simulación de carga (700ms para mostrar el Spinner y dar feedback visual)
    const timer = setTimeout(() => {
      if (staticData) {
        setProyectoInitialData(staticData);
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
    <div className="principal21-update p-4">
      <Row className="justify-content-center">
        <Col md="8">
          {/* Encabezado con botón de regreso */}
          <div className="d-flex align-items-center mb-3">
            <Button onClick={handleClose} color="link" className="text-secondary p-0 me-3 shadow-none">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0 fw-bold">Actualizar Proyecto Operativo</h3>
          </div>

          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              {!updateSuccess ? (
                <>
                  {/* Header interno del formulario */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light p-2 rounded me-3 text-primary">
                      <FontAwesomeIcon icon={faProjectDiagram} size="lg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-dark fw-bold">Información de Gestión</h5>
                      <small className="text-muted">Modificando parámetros de la sección 2.1</small>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted">Recuperando datos del proyecto...</p>
                    </div>
                  ) : (
                    <ValidatedForm defaultValues={proyectoInitialData} onSubmit={saveEntity}>
                      <Row>
                        {/* NOMBRE DEL PROYECTO */}
                        <Col md="12">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">Nombre del Proyecto</label>
                            <ValidatedField
                              name="nombre"
                              type="text"
                              validate={{
                                required: { value: true, message: 'Este campo es obligatorio.' },
                                maxLength: { value: 100, message: 'Máximo 100 caracteres.' },
                              }}
                            />
                          </div>
                        </Col>

                        {/* PRIORIDAD */}
                        <Col md="6">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">
                              <FontAwesomeIcon icon={faFlag} className="me-2 text-muted" />
                              Prioridad
                            </label>
                            <ValidatedField
                              name="prioridad"
                              type="select"
                              validate={{ required: { value: true, message: 'Seleccione una prioridad.' } }}
                            >
                              <option value="Alta">Alta</option>
                              <option value="Media">Media</option>
                              <option value="Baja">Baja</option>
                            </ValidatedField>
                          </div>
                        </Col>

                        {/* ESTADO */}
                        <Col md="6">
                          <div className="mb-3">
                            <label className="fw-bold text-secondary mb-1">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-muted" />
                              Estado
                            </label>
                            <ValidatedField
                              name="estado"
                              type="select"
                              validate={{ required: { value: true, message: 'Seleccione un estado.' } }}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En Progreso">En Progreso</option>
                              <option value="En Revisión">En Revisión</option>
                              <option value="Completado">Completado</option>
                            </ValidatedField>
                          </div>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4 gap-2">
                        <Button onClick={handleClose} color="secondary" outline>
                          Cancelar
                        </Button>
                        <Button color="primary" type="submit" disabled={updating} className="px-4 shadow-sm">
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
                  <h3 className="text-success fw-bold">¡Proyecto actualizado!</h3>
                  <p className="text-muted">Los cambios se han aplicado correctamente en esta sesión estática.</p>

                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> Los datos son ficticios y no persisten en la base de datos real.
                  </Alert>

                  <div className="mt-4">
                    <Button color="primary" className="px-4 shadow-sm" onClick={handleClose}>
                      Volver al Listado
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

        .principal21-update .card {
          border-radius: 15px;
        }

        .principal21-update .form-control, 
        .principal21-update .form-select {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Principal21Update;

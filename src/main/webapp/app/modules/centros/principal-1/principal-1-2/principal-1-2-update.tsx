import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Spinner, Alert } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faLayerGroup, faInfoCircle, faMicrochip, faUserTie, faChartLine } from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS ---
import { INITIAL_DATA_12, IPrincipal12 } from './principal-1-2-data';

export const Principal12Update = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [recursoInitialData, setRecursoInitialData] = useState<IPrincipal12 | undefined>(undefined);

  // Obtener la data basada en el id para precargar el formulario
  const staticData = useMemo(() => {
    return INITIAL_DATA_12.find(item => item.id === Number(id));
  }, [id]);

  const handleClose = () => {
    navigate('/principal-1-routes/principal-1-2-center');
  };

  useEffect(() => {
    // Simulación de carga de datos desde el JS estático (600ms para mostrar el Spinner)
    const timer = setTimeout(() => {
      if (staticData) {
        setRecursoInitialData(staticData);
      }
      setLoading(false);
    }, 600);
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
    <div className="principal12-update p-4">
      <Row className="justify-content-center">
        <Col md="8">
          {/* Encabezado con botón de regreso */}
          <div className="d-flex align-items-center mb-3">
            <Button onClick={handleClose} color="link" className="text-secondary p-0 me-3">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0 fw-bold">Actualizar Recurso</h3>
          </div>

          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              {!updateSuccess ? (
                <>
                  {/* Header interno del formulario */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light p-2 rounded me-3 text-info">
                      <FontAwesomeIcon icon={faLayerGroup} size="lg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-dark font-weight-bold">Información de Infraestructura</h5>
                      <small className="text-muted">Modificando parámetros de la capa 1.2</small>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="info" />
                      <p className="mt-2 text-muted">Obteniendo datos del recurso...</p>
                    </div>
                  ) : (
                    <ValidatedForm defaultValues={recursoInitialData} onSubmit={saveEntity}>
                      <Row>
                        <Col md="12">
                          <div className="mb-3">
                            <label htmlFor="recurso-nombre">
                              <FontAwesomeIcon icon={faMicrochip} className="me-2 text-muted" />
                              Nombre del Recurso
                            </label>
                            <ValidatedField
                              name="recurso"
                              id="recurso-nombre"
                              type="text"
                              validate={{
                                required: { value: true, message: 'Este campo es obligatorio.' },
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="6">
                          <div className="mb-3">
                            <label htmlFor="recurso-responsable">
                              <FontAwesomeIcon icon={faUserTie} className="me-2 text-muted" />
                              Responsable
                            </label>
                            <ValidatedField
                              name="responsable"
                              id="recurso-responsable"
                              type="text"
                              validate={{
                                required: { value: true, message: 'Este campo es obligatorio.' },
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="6">
                          <div className="mb-3">
                            <label htmlFor="recurso-carga">
                              <FontAwesomeIcon icon={faChartLine} className="me-2 text-muted" />
                              Uso de Recurso (%)
                            </label>
                            <ValidatedField
                              name="carga"
                              id="recurso-carga"
                              type="number"
                              validate={{
                                required: { value: true, message: 'Este campo es obligatorio.' },
                                min: { value: 0, message: 'Mínimo 0' },
                                max: { value: 100, message: 'Máximo 100' },
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4 gap-2">
                        <Button onClick={handleClose} color="secondary" outline>
                          Cancelar
                        </Button>
                        <Button color="info" type="submit" disabled={updating} className="px-4 shadow-sm text-white">
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          {updating ? 'Procesando...' : 'Guardar Cambios'}
                        </Button>
                      </div>
                    </ValidatedForm>
                  )}
                </>
              ) : (
                /* MENSAJE DE ÉXITO CON ANIMACIÓN (ESTILO 1.1) */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-success fw-bold">¡Recurso actualizado!</h3>
                  <p className="text-muted">Los parámetros de carga y asignación se han actualizado visualmente.</p>

                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> El dato ficticio no se guardará en la base de datos (Efecto Estático).
                  </Alert>

                  <div className="mt-4">
                    <Button color="info" className="px-4 text-white" onClick={handleClose}>
                      Regresar al Listado
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ESTILOS DE ANIMACIÓN */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .principal12-update .card {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default Principal12Update;

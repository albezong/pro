import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faArrowLeft,
  faClipboardList,
  faInfoCircle,
  faTasks,
  faUserCircle,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

export const Principal22Create = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setIsSaving(true);

    // Simulación de guardado estático (coherente con el flujo de la sección 2)
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="principal22-create container py-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm border-0 rounded-3">
            <CardBody className="p-4">
              {/* HEADER CON ICONO DE CLIPBOARD (CONGRUENTE CON 2.2 MANAGEMENT) */}
              <div className="d-flex align-items-center mb-4 text-info">
                <div className="bg-light p-3 rounded-circle me-3">
                  <FontAwesomeIcon icon={faClipboardList} size="2x" />
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">Nueva Tarea</h2>
                  <small className="text-muted">Principal 2.2 - Planificación Operativa</small>
                </div>
              </div>

              <hr className="mb-4" />

              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <Row>
                    {/* NOMBRE DE LA TAREA */}
                    <Col md="12">
                      <FormGroup>
                        <Label for="tarea" className="fw-bold">
                          <FontAwesomeIcon icon={faTasks} className="me-2 text-muted" />
                          Descripción de la Tarea
                        </Label>
                        <Input type="text" id="tarea" placeholder="Ej: Configuración de entornos de red" required />
                      </FormGroup>
                    </Col>

                    {/* RESPONSABLE */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="responsable" className="fw-bold">
                          <FontAwesomeIcon icon={faUserCircle} className="me-2 text-muted" />
                          Responsable Asignado
                        </Label>
                        <Input type="text" id="responsable" placeholder="Nombre del encargado" required />
                      </FormGroup>
                    </Col>

                    {/* ESTIMACIÓN DE TIEMPO */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="tiempo" className="fw-bold">
                          <FontAwesomeIcon icon={faHourglassHalf} className="me-2 text-muted" />
                          Estimación (Horas)
                        </Label>
                        <Input type="text" id="tiempo" placeholder="Ej: 8h" required />
                      </FormGroup>
                    </Col>

                    {/* CATEGORÍA */}
                    <Col md="12">
                      <FormGroup>
                        <Label for="categoria" className="fw-bold">
                          Categoría / Área
                        </Label>
                        <Input type="select" id="categoria" required>
                          <option value="">Seleccione una categoría...</option>
                          <option value="Seguridad">Seguridad</option>
                          <option value="Diseño">Diseño</option>
                          <option value="DBA">DBA</option>
                          <option value="QA">QA</option>
                          <option value="DevOps">DevOps</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between">
                    <Button tag={Link} to="/principal-2-routes/principal-2-2-center" color="secondary" outline>
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Cancelar
                    </Button>
                    <Button color="info" type="submit" className="px-4 shadow-sm text-white" disabled={isSaving}>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {isSaving ? 'Registrando...' : 'Registrar Tarea'}
                    </Button>
                  </div>
                </form>
              ) : (
                /* MENSAJE DE ÉXITO CON LA CARITA 😉 */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-success fw-bold">¡Tarea registrada exitosamente!</h3>
                  <p className="text-muted">La tarea ha sido añadida al cronograma de forma visual.</p>

                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm text-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> Al ser una demo, el cambio es volátil y no se guardará permanentemente.
                  </Alert>

                  <div className="mt-4">
                    <Button
                      tag={Link}
                      to="/principal-2-routes/principal-2-2-center"
                      color="link"
                      className="text-secondary me-3 text-decoration-none"
                    >
                      Regresar al cronograma
                    </Button>
                    <Button color="info" onClick={() => setIsSuccess(false)} className="px-4 shadow-sm text-white">
                      Registrar otra tarea
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ESTILOS PARA LA ANIMACIÓN Y DISEÑO */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        .principal22-create .card {
          border-radius: 20px;
        }

        .principal22-create .form-control, 
        .principal22-create .form-select {
          border-radius: 10px;
          padding: 0.6rem 1rem;
          border: 1px solid #e0e0e0;
        }

        .principal22-create .form-control:focus {
            border-color: #0dcaf0;
            box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Principal22Create;

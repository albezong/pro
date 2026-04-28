import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faProjectDiagram, faInfoCircle, faFlag, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

export const Principal21Create = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setIsSaving(true);

    // Simulación de guardado estático
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="principal21-create container py-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm border-0 rounded-3">
            <CardBody className="p-4">
              {/* HEADER CON ICONO DE PROYECTO DIAGRAM (CONGRUENTE CON 2.1) */}
              <div className="d-flex align-items-center mb-4 text-primary">
                <div className="bg-light p-3 rounded-circle me-3">
                  <FontAwesomeIcon icon={faProjectDiagram} size="2x" />
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">Nuevo Proyecto</h2>
                  <small className="text-muted">Principal 2.1 - Control Operativo</small>
                </div>
              </div>

              <hr className="mb-4" />

              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <Row>
                    {/* NOMBRE DEL PROYECTO */}
                    <Col md="12">
                      <FormGroup>
                        <Label for="nombre" className="fw-bold">
                          Nombre del Proyecto
                        </Label>
                        <Input type="text" id="nombre" placeholder="Ej: Optimización de Infraestructura" required />
                      </FormGroup>
                    </Col>

                    {/* PRIORIDAD */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="prioridad" className="fw-bold">
                          <FontAwesomeIcon icon={faFlag} className="me-2" />
                          Prioridad
                        </Label>
                        <Input type="select" id="prioridad" required>
                          <option value="">Seleccione...</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* ESTADO */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="estado" className="fw-bold">
                          <FontAwesomeIcon icon={faCheckDouble} className="me-2" />
                          Estado Inicial
                        </Label>
                        <Input type="select" id="estado" required>
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="En Revisión">En Revisión</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between">
                    <Button tag={Link} to="/principal-2-routes/principal-2-1-center" color="secondary" outline>
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" className="px-4 shadow-sm" disabled={isSaving}>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {isSaving ? 'Guardando...' : 'Crear Proyecto'}
                    </Button>
                  </div>
                </form>
              ) : (
                /* MENSAJE DE ÉXITO CON LA CARITA 😉 */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-success fw-bold">¡Proyecto creado exitosamente!</h3>
                  <p className="text-muted">El registro ha sido procesado de forma estática.</p>

                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm text-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> Al ser un entorno de demostración, el dato no se guardará en la base de datos persistente.
                  </Alert>

                  <div className="mt-4">
                    <Button
                      tag={Link}
                      to="/principal-2-routes/principal-2-1-center"
                      color="link"
                      className="text-secondary me-3 text-decoration-none"
                    >
                      Regresar al listado
                    </Button>
                    <Button color="primary" onClick={() => setIsSuccess(false)} className="px-4 shadow-sm">
                      Crear otro proyecto
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ESTILOS PARA LA ANIMACIÓN */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        .principal21-create .card {
          border-radius: 20px;
        }

        .principal21-create .form-control, 
        .principal21-create .form-select {
          border-radius: 10px;
          padding: 0.6rem 1rem;
        }
      `}</style>
    </div>
  );
};

export default Principal21Create;

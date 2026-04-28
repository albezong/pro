import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faLayerGroup, faInfoCircle, faMicrochip, faUserTie, faChartLine } from '@fortawesome/free-solid-svg-icons';

export const Principal12Create = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    // Simulamos la creación estática
    setIsSuccess(true);

    // Opcional: Redirección automática tras 3.5 segundos
    // setTimeout(() => {
    //   navigate('/principal-1-routes/principal-1-2-center');
    // }, 3500);
  };

  return (
    <div className="principal12-create container py-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow border-0">
            <CardBody className="p-4">
              {/* HEADER CON ICONO DE CAPAS (1.2) */}
              <div className="d-flex align-items-center mb-4 text-info">
                <FontAwesomeIcon icon={faLayerGroup} size="2x" className="me-3" />
                <h2 className="mb-0 fw-bold">Asignar Nuevo Recurso - Principal 1.2</h2>
              </div>

              <hr />

              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="recurso" className="fw-bold">
                          <FontAwesomeIcon icon={faMicrochip} className="me-2" />
                          Nombre del Recurso
                        </Label>
                        <Input type="text" id="recurso" placeholder="Ej: Servidor de Aplicaciones" required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="responsable" className="fw-bold">
                          <FontAwesomeIcon icon={faUserTie} className="me-2" />
                          Responsable
                        </Label>
                        <Input type="text" id="responsable" placeholder="Nombre del encargado" required />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="carga" className="fw-bold">
                          <FontAwesomeIcon icon={faChartLine} className="me-2" />
                          Uso de Recurso (%)
                        </Label>
                        <Input type="number" id="carga" min="0" max="100" placeholder="0-100" required />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between">
                    <Button tag={Link} to="/principal-1-routes/principal-1-2-center" color="secondary" outline>
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver
                    </Button>
                    <Button color="info" type="submit" className="px-4 shadow-sm text-white">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Asignar Recurso
                    </Button>
                  </div>
                </form>
              ) : (
                /* MENSAJE DE ÉXITO CON ANIMACIÓN DE CARITA */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-success fw-bold">¡Módulo creado exitosamente!</h3>
                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> El dato ficticio no se guardará en la base de datos (Efecto Estático).
                  </Alert>
                  <div className="mt-4">
                    <Button tag={Link} to="/principal-1-routes/principal-1-2-center" color="link" className="text-secondary">
                      Regresar al listado
                    </Button>
                    <Button color="info" className="ms-3 text-white" onClick={() => setIsSuccess(false)}>
                      Crear otro
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ESTILOS PARA LA ANIMACIÓN (Idénticos a la 1.1) */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink 1.5s infinite;
        }

        @keyframes wink {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .principal12-create .card {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default Principal12Create;

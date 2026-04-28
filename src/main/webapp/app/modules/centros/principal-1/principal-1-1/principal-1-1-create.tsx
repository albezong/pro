import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faSitemap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export const Principal11Create = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    // Simulamos la creación
    setIsSuccess(true);

    // Regresamos a la lista después de 3 segundos para que vean el mensaje
    setTimeout(() => {
      // navigate('/principal-1-1');
    }, 3500);
  };

  return (
    <div className="principal11-create container py-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow border-0">
            <CardBody className="p-4">
              {/* HEADER */}
              <div className="d-flex align-items-center mb-4 text-primary">
                <FontAwesomeIcon icon={faSitemap} size="2x" className="me-3" />
                <h2 className="mb-0 fw-bold">Nuevo Componente - Principal 1.1</h2>
              </div>

              <hr />

              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="codigo" className="fw-bold">
                          Código del Componente
                        </Label>
                        <Input
                          type="text"
                          id="codigo"
                          placeholder="Ej: COMP-Omega"
                          required
                          minLength={8} // Mínimo de caracteres
                          maxLength={12} // Máximo de caracteres
                          validate={{
                            required: { value: true, message: 'Requerido' },
                            minLength: { value: 8, message: 'El codigo no puede ser menor a 8 caracteres' },
                            maxLength: { value: 12, message: 'El codigo no puede superar los 12 caracteres' },
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="version" className="fw-bold">
                          Versión
                        </Label>
                        <Input
                          type="text"
                          id="version"
                          placeholder="1.0.0"
                          required
                          minLength={3} // Mínimo de caracteres
                          maxLength={3} // Máximo de caracteres
                          validate={{
                            required: { value: true, message: 'Requerido' },
                            minLength: { value: 8, message: 'La version no puede ser menor a 3 caracteres' },
                            maxLength: { value: 12, message: 'La version no puede ser mayor a 3 caracteres' },
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="fecha" className="fw-bold">
                          Fecha de Revisión
                        </Label>
                        <Input type="date" id="fecha" required />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between">
                    <Button tag={Link} to="/principal-1-routes/principal-1-1-center" color="secondary" outline>
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver
                    </Button>
                    <Button color="primary" type="submit" className="px-4 shadow-sm">
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Guardar Registro
                    </Button>
                  </div>
                </form>
              ) : (
                /* MENSAJE DE ÉXITO CON ANIMACIÓN */
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
                    <Button tag={Link} to="/principal-1-routes/principal-1-1-center" color="link" className="ms-3 text-secondary">
                      Regresar al listado
                    </Button>
                    <Button color="primary" onClick={() => setIsSuccess(false)}>
                      Crear otro
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
          animation: wink 1.5s infinite;
        }

        @keyframes wink {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .principal11-create .card {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default Principal11Create;

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Spinner, Alert } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faSitemap, faInfoCircle, faCode, faTag, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS EXTERNOS ---
import { INITIAL_DATA } from './principal-1-1-data';

export const Principal11Update = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [entity, setEntity] = useState<any>(null);

  // Obtener la data basada en el id para precargar el formulario
  const staticData = useMemo(() => {
    return INITIAL_DATA.find(data => data.id === parseInt(id || '0', 10));
  }, [id]);

  const handleClose = () => {
    navigate('/principal-1-routes/principal-1-1-center');
  };

  useEffect(() => {
    // Simulación de carga basada en los datos de INITIAL_DATA
    const timer = setTimeout(() => {
      setEntity({
        id,
        codigo: staticData?.codigo || 'N/A',
        version: staticData?.version || '0.0.0',
        fechaRevision: staticData?.fechaRevision || '',
      });
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  const saveEntity = values => {
    setUpdating(true);
    // Simulación de guardado
    setTimeout(() => {
      setUpdating(false);
      setUpdateSuccess(true);
    }, 1000);
  };

  return (
    <div className="principal11-update p-4">
      <Row className="justify-content-center">
        <Col md="8">
          {/* Encabezado */}
          <div className="d-flex align-items-center mb-3">
            <Button onClick={handleClose} color="link" className="text-secondary p-0 me-3">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="mb-0 fw-bold">Actualizar Componente</h3>
          </div>

          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              {!updateSuccess ? (
                <>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light p-2 rounded me-3 text-primary">
                      <FontAwesomeIcon icon={faSitemap} size="lg" />
                    </div>
                    <div>
                      <h5 className="mb-0 text-dark font-weight-bold">Información Técnica</h5>
                      <small className="text-muted">Editando registro</small>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted">Cargando datos del componente...</p>
                    </div>
                  ) : (
                    <ValidatedForm defaultValues={entity} onSubmit={saveEntity}>
                      <Row>
                        <Col md="12">
                          <ValidatedField
                            name="codigo"
                            label="Código del Componente"
                            type="text"
                            minLength={8} // Mínimo de caracteres
                            maxLength={12} // Máximo de caracteres
                            validate={{
                              required: { value: true, message: 'Requerido' },
                              minLength: { value: 8, message: 'El codigo no puede ser menor a 8 caracteres' },
                              maxLength: { value: 12, message: 'El codigo no puede superar los 12 caracteres' },
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <ValidatedField
                            name="version"
                            label="Versión"
                            type="text"
                            minLength={3} // Mínimo de caracteres
                            maxLength={3} // Máximo de caracteres
                            validate={{
                              required: { value: true, message: 'Requerido' },
                              minLength: { value: 8, message: 'La version no puede ser menor a 3 caracteres' },
                              maxLength: { value: 12, message: 'La version no puede ser mayor a 3 caracteres' },
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <ValidatedField
                            name="fechaRevision"
                            label="Fecha de Revisión"
                            type="date"
                            validate={{
                              required: { value: true, message: 'La fecha es obligatoria.' },
                            }}
                          />
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4 gap-2">
                        <Button onClick={handleClose} color="secondary" outline>
                          Cancelar
                        </Button>
                        <Button color="primary" type="submit" disabled={updating} className="px-4 shadow-sm">
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          {updating ? 'Procesando...' : 'Guardar Cambios'}
                        </Button>
                      </div>
                    </ValidatedForm>
                  )}
                </>
              ) : (
                /* MENSAJE DE ÉXITO CON ANIMACIÓN */
                <div className="text-center py-4">
                  <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
                    😉
                  </div>
                  <h3 className="text-success fw-bold">¡Componente actualizado!</h3>
                  <p className="text-muted">Los cambios en el código, versión y fecha se han aplicado visualmente.</p>

                  <Alert color="warning" className="mt-4 d-inline-block border-0 shadow-sm">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    <strong>Nota:</strong> El dato ficticio no se guardará en la base de datos (Efecto Estático).
                  </Alert>

                  <div className="mt-4">
                    <Button color="primary" className="px-4" onClick={handleClose}>
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
      `}</style>
    </div>
  );
};

export default Principal11Update;

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Progress, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faLayerGroup,
  faInfoCircle,
  faMicrochip,
  faUserTie,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS ---
import { INITIAL_DATA_12, IPrincipal12 } from './principal-1-2-data';
import { usePermission } from 'app/shared/auth/use-permission';

export const Principal12Detail = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal1-2');
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [recursoEntity, setRecursoEntity] = useState<IPrincipal12 | null>(null);

  // Obtener la data basada en el id para congruencia
  const staticData = useMemo(() => {
    return INITIAL_DATA_12.find(item => item.id === Number(id));
  }, [id]);

  useEffect(() => {
    // Simulamos carga de datos para activar el spinner como en la 1.1
    const timer = setTimeout(() => {
      if (staticData) {
        setRecursoEntity(staticData);
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  // Color de la barra de progreso (Congruente con Management)
  const getProgressColor = (carga: number) => {
    if (carga > 80) return 'danger';
    if (carga > 50) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="info" />
        <p className="mt-2 text-muted">Cargando detalles de infraestructura...</p>
      </div>
    );
  }

  if (!recursoEntity) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">No se encontró la información del recurso.</h4>
        <Button onClick={() => navigate('/principal-1-routes/principal-1-2-center')} color="info" className="mt-3 text-white">
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="principal12-detail container-fluid py-4">
      {/* Encabezado Principal */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-info">
          <FontAwesomeIcon icon={faLayerGroup} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle del Recurso</h2>
          <p className="text-muted mb-0">Información técnica de infraestructura - Principal 1.2</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="8">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                <h5 className="mb-0 fw-bold text-secondary">Especificaciones del Recurso</h5>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row>
                {/* Nombre del Recurso */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faMicrochip} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Recurso de Sistema</label>
                  </div>
                  <span className="fs-5 fw-bold text-info d-block">{recursoEntity.recurso}</span>
                </Col>

                {/* Responsable */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faUserTie} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Responsable Asignado</label>
                  </div>
                  <span className="fs-5 text-secondary d-block">{recursoEntity.responsable}</span>
                </Col>

                {/* Uso/Carga de Recurso */}
                <Col md="12" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Carga de Trabajo Actual</label>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <Progress
                      value={recursoEntity.carga}
                      color={getProgressColor(recursoEntity.carga)}
                      style={{ height: '15px', flexGrow: 1 }}
                      className="rounded-pill shadow-sm"
                    />
                    <span className="fw-bold fs-5">{recursoEntity.carga}%</span>
                  </div>
                </Col>

                {/* Descripción */}
                <Col md="12" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Descripción del Activo</label>
                  </div>
                  <p className="text-secondary bg-light p-3 rounded border-start border-4 border-info">
                    {recursoEntity.descripcion ||
                      'Este recurso pertenece a la capa de infraestructura optimizada para la gestión en la vista 1.2.'}
                  </p>
                </Col>
              </Row>

              {/* APARTADO CON ANIMACIÓN Y NOTA (Igual a 1.1) */}
              <Alert color="info" className="d-flex align-items-center justify-content-center border-0 shadow-sm my-4 py-3">
                <div className="wink-animation me-3" style={{ fontSize: '2rem' }}>
                  😉
                </div>
                <div className="small text-center">
                  <span className="text-muted">Nota: Los datos mostrados son ficticios y no persisten en BD (Entorno de Vista).</span>
                </div>
              </Alert>

              <hr className="my-4 border-dashed" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button
                  onClick={() => navigate('/principal-1-routes/principal-1-2-center')}
                  color="secondary"
                  outline
                  className="px-4 shadow-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Volver al Listado
                </Button>

                {perm.canEdit && (
                  <Button
                    tag={Link}
                    to={`/principal-1-routes/principal-1-2-update/${recursoEntity.id}`}
                    color="info"
                    className="px-4 shadow-sm text-white"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Recurso
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="text-center mt-4">
            <small className="text-muted italic">Vista de consulta de datos estáticos - Principal 1.2</small>
          </div>
        </Col>
      </Row>

      {/* ESTILOS DE ANIMACIÓN (Bounce idéntico a 1.1) */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 2s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }
        
        .border-dashed {
          border-top: 1px dashed #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default Principal12Detail;

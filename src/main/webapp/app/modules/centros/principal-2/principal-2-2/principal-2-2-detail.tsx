import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faTasks,
  faUserCircle,
  faHourglassHalf,
  faInfoCircle,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS ---
import { INITIAL_TASKS, IPrincipal22Task } from './principal-2-2-data';
import { usePermission } from 'app/shared/auth/use-permission';

export const Principal22Detail = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal2-2');
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [taskEntity, setTaskEntity] = useState<IPrincipal22Task | null>(null);

  // Buscar la tarea por ID de forma estática
  const staticData = useMemo(() => {
    return INITIAL_TASKS.find(item => item.id === Number(id));
  }, [id]);

  useEffect(() => {
    // Simulación de carga estética
    const timer = setTimeout(() => {
      if (staticData) {
        setTaskEntity(staticData);
      }
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="info" />
        <p className="mt-2 text-muted">Cargando detalles de la planificación...</p>
      </div>
    );
  }

  if (!taskEntity) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">No se encontró la información de la tarea.</h4>
        <Button onClick={() => navigate('/principal-2-routes/principal-2-2-center')} color="info" className="mt-3 text-white">
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="principal22-detail container-fluid py-4">
      {/* Encabezado Principal */}
      <div className="d-flex align-items-center mb-4">
        <div className="shadow-sm p-3 rounded bg-white text-info me-3">
          <FontAwesomeIcon icon={faClipboardList} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle de Planificación</h2>
          <p className="text-muted mb-0">Gestión de Tareas - Vista Principal 2.2</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="9">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                  <h5 className="mb-0 fw-bold text-secondary">Ficha Técnica Operativa</h5>
                </div>
                <Badge color="light" className="text-info border">
                  MODO LECTURA
                </Badge>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row>
                {/* Nombre de la Tarea */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faTasks} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Descripción de la Tarea</label>
                  </div>
                  <span className="fs-5 fw-bold text-dark d-block">{taskEntity.tarea}</span>
                  <Badge color="info" outline className="mt-1">
                    {taskEntity.categoria}
                  </Badge>
                </Col>

                {/* Responsable */}
                <Col md="3" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faUserCircle} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Responsable</label>
                  </div>
                  <span className="fw-bold text-secondary">{taskEntity.responsable}</span>
                </Col>

                {/* Estimación */}
                <Col md="3" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faHourglassHalf} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Estimación</label>
                  </div>
                  <span className="fw-bold text-primary">{taskEntity.tiempo}</span>
                </Col>
              </Row>

              {/* APARTADO CON ANIMACIÓN 😉 */}
              <Alert
                color="info"
                className="d-flex align-items-center justify-content-center border-0 shadow-sm my-4 py-3 bg-opacity-10 text-info"
              >
                <div className="wink-animation me-3" style={{ fontSize: '2rem' }}>
                  😉
                </div>
                <div className="small text-center text-dark">
                  <strong>Nota de Visualización:</strong> Estos datos pertenecen al cronograma estático.
                  <br /> <span className="text-muted">Las modificaciones se reflejarán localmente durante la sesión.</span>
                </div>
              </Alert>

              <hr className="my-4 border-dashed" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button
                  onClick={() => navigate('/principal-2-routes/principal-2-2-center')}
                  color="secondary"
                  outline
                  className="px-4 shadow-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Regresar al Listado
                </Button>

                {perm.canEdit && (
                  <Button
                    tag={Link}
                    to={`/principal-2-routes/principal-2-2-update/${taskEntity.id}`}
                    color="info"
                    className="px-4 shadow-sm text-white"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Registro
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <p className="text-center mt-3 text-muted small italic">Sistema de Gestión de Tareas - Auditoría Principal 2.2</p>
        </Col>
      </Row>

      {/* ESTILOS DE ANIMACIÓN */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 2s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.15); }
        }
        
        .border-dashed {
          border-top: 1px dashed #dee2e6;
        }

        .principal22-detail .card {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default Principal22Detail;

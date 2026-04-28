import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faProjectDiagram,
  faCalendarAlt,
  faInfoCircle,
  faFlag,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS ESTÁTICOS (Debe existir este archivo con los proyectos) ---
import { INITIAL_PROJECTS, IProject21 } from './principal-2-1-data';
import { usePermission } from 'app/shared/auth/use-permission';

export const Principal21Detail = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal2-1');
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [proyectoEntity, setProyectoEntity] = useState<IProject21 | null>(null);

  // Buscar el proyecto por ID de forma estática
  const staticData = useMemo(() => {
    return INITIAL_PROJECTS.find(item => item.id === Number(id));
  }, [id]);

  useEffect(() => {
    // Simulación de carga para mantener la estética de la App
    const timer = setTimeout(() => {
      if (staticData) {
        setProyectoEntity(staticData);
      }
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  // Badge de prioridad
  const getPriorityBadge = (prioridad: string) => {
    const colors = { Alta: 'danger', Media: 'warning', Baja: 'info' };
    return (
      <Badge color={colors[prioridad] || 'secondary'} pill>
        {prioridad}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (!proyectoEntity) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">No se encontró la información del proyecto.</h4>
        <Button onClick={() => navigate('/principal-2-routes/principal-2-1-center')} color="primary" className="mt-3">
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="principal21-detail container-fluid py-4">
      {/* Encabezado Principal */}
      <div className="d-flex align-items-center mb-4">
        <div className="shadow-sm p-3 rounded bg-white text-primary me-3">
          <FontAwesomeIcon icon={faProjectDiagram} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle de Proyecto</h2>
          <p className="text-muted mb-0">Gestión Operativa - Vista Principal 2.1</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="9">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-primary me-2" />
                  <h5 className="mb-0 fw-bold text-secondary">Ficha Técnica Operativa</h5>
                </div>
                <Badge color="light" className="text-primary border">
                  ESTÁTICO
                </Badge>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row>
                {/* Nombre del Proyecto */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faProjectDiagram} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Nombre del Proyecto</label>
                  </div>
                  <span className="fs-5 fw-bold text-dark d-block">{proyectoEntity.nombre}</span>
                </Col>

                {/* Prioridad */}
                <Col md="3" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faFlag} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Prioridad</label>
                  </div>
                  <div>{getPriorityBadge(proyectoEntity.prioridad)}</div>
                </Col>

                {/* Estado */}
                <Col md="3" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-muted me-2" size="sm" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Estado Actual</label>
                  </div>
                  <span className="fw-bold">{proyectoEntity.estado}</span>
                </Col>
              </Row>

              {/* APARTADO CON ANIMACIÓN (CONGRUENTE CON 1.1 y 1.2) */}
              <Alert
                color="primary"
                className="d-flex align-items-center justify-content-center border-0 shadow-sm my-4 py-3 bg-opacity-10 text-primary"
              >
                <div className="wink-animation me-3" style={{ fontSize: '2rem' }}>
                  😉
                </div>
                <div className="small text-center text-dark">
                  <strong>Información de Visualización:</strong> Esta vista renderiza datos de prueba.
                  <br /> <span className="text-muted">No se requiere conexión a base de datos para este módulo.</span>
                </div>
              </Alert>

              <hr className="my-4 border-dashed" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button
                  onClick={() => navigate('/principal-2-routes/principal-2-1-center')}
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
                    to={`/principal-2-routes/principal-2-1-update/${proyectoEntity.id}`}
                    color="primary"
                    className="px-4 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Registro
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <p className="text-center mt-3 text-muted small italic">Visualización de auditoría interna - Principal 2.1</p>
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

        .principal21-detail .card {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default Principal21Detail;

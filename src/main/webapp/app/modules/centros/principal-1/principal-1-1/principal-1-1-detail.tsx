import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPencilAlt, faSitemap, faCalendarAlt, faInfoCircle, faCode, faTag } from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS EXTERNOS ---
import { INITIAL_DATA } from './principal-1-1-data';
import { usePermission } from 'app/shared/auth/use-permission';

export const Principal11Detail = () => {
  const navigate = useNavigate();
  const perm = usePermission('Principal1-1');
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState<any>(null);

  // Obtener la data basada en el id para que sea congruente con el Center
  const staticData = useMemo(() => {
    return INITIAL_DATA.find(data => data.id === parseInt(id || '0', 10));
  }, [id]);

  useEffect(() => {
    // Simulamos una carga de datos estática basada en el ID y INITIAL_DATA
    const timer = setTimeout(() => {
      setEntity({
        id,
        codigo: staticData?.codigo || 'N/A',
        version: staticData?.version || '0.0.0',
        fechaRevision: staticData?.fechaRevision || 'N/A',
        descripcion: 'Componente de núcleo para el procesamiento de datos en la capa principal 1.1.',
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, staticData]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Cargando detalles del componente...</p>
      </div>
    );
  }

  return (
    <div className="principal11-detail container-fluid py-4">
      {/* Encabezado Principal */}
      <div className="d-flex align-items-center mb-4">
        <div className="me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faSitemap} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle del Componente</h2>
          <p className="text-muted mb-0">Información técnica del registro</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="8">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                <h5 className="mb-0 fw-bold text-secondary">Especificaciones Técnicas</h5>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row>
                {/* Código del Componente */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCode} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Código Identificador</label>
                  </div>
                  <span className="fs-5 fw-bold text-primary d-block">{entity.codigo}</span>
                </Col>

                {/* Versión */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faTag} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Versión Actual</label>
                  </div>
                  <Badge color="info" pill className="px-3 py-2">
                    v{entity.version}
                  </Badge>
                </Col>

                {/* Fecha de Revisión */}
                <Col md="6" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Última Revisión</label>
                  </div>
                  <div className="p-2 border rounded bg-light d-inline-block fw-bold text-dark">{entity.fechaRevision}</div>
                </Col>

                {/* Descripción */}
                <Col md="12" className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Descripción General</label>
                  </div>
                  <p className="text-secondary bg-light p-3 rounded border-start border-4 border-info">{entity.descripcion}</p>
                </Col>
              </Row>

              {/* APARTADO CON ANIMACIÓN Y NOTA */}
              <Alert color="info" className="d-flex align-items-center justify-content-center border-0 shadow-sm my-4 py-3">
                <div className="wink-animation me-3" style={{ fontSize: '2rem' }}>
                  😉
                </div>
                <div className="small">
                  <span className="text-muted">Nota: Los datos mostrados son ficticios y no persisten en BD.</span>
                </div>
              </Alert>

              <hr className="my-4 border-dashed" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button
                  onClick={() => navigate('/principal-1-routes/principal-1-1-center')}
                  color="secondary"
                  outline
                  className="px-4 shadow-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Volver al Listado
                </Button>

                {perm.canEdit && (
                  <Button tag={Link} to={`/principal-1-routes/principal-1-1-update/${id}`} color="primary" className="px-4 shadow-sm">
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Componente
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="text-center mt-4">
            <small className="text-muted italic">Vista de consulta de datos estáticos - Principal 1.1</small>
          </div>
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
          50% { transform: translateY(-5px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Principal11Detail;

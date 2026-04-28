import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge, Spinner } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPencilAlt, faCubes, faCalendarAlt, faInfoCircle, faHashtag } from '@fortawesome/free-solid-svg-icons';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './modules.reducer';
import { usePermission } from 'app/shared/auth/use-permission';

export const ModulesDetail = () => {
  const dispatch = useAppDispatch();
  const perm = usePermission('Modulos');
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const modulesEntity = useAppSelector(state => state.modules.entity);
  const loading = useAppSelector(state => state.modules.loading);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-2 text-muted">Cargando detalles del módulo...</p>
      </div>
    );
  }

  if (!modulesEntity || !modulesEntity.id) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">No se encontró la información del módulo.</h4>
        <Button onClick={() => navigate('/seguridad/modules-center')} color="primary" className="mt-3">
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="module-management container-fluid py-4">
      {/* Encabezado Principal */}
      <div className="d-flex align-items-center mb-4">
        <div className="module-icon-bg me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faCubes} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle del Módulo</h2>
          <p className="text-muted mb-0">Visualizando información técnica de: {modulesEntity.nombre}</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="8">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                <h5 className="mb-0 fw-bold text-secondary">Especificaciones del Registro</h5>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row className="mb-4">
                {/* Nombre del Módulo */}
                <Col md="6" className="mb-4 mb-md-0">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCubes} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Nombre del Módulo</label>
                  </div>
                  <span className="fs-5 fw-bold text-dark d-block">{modulesEntity.nombre}</span>
                </Col>
                {/* Fecha de Registro */}
                <Col md="6">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-2" />
                    <label className="small text-uppercase fw-bold text-muted mb-0">Fecha de Registro</label>
                  </div>
                  <div className="p-3 border rounded bg-light d-inline-block">
                    {modulesEntity.fechaCreacion ? (
                      <span className="text-dark fw-bold">
                        <TextFormat value={modulesEntity.fechaCreacion} type="date" format={APP_LOCAL_DATE_FORMAT} />
                      </span>
                    ) : (
                      <span className="text-muted italic">No registrada</span>
                    )}
                  </div>
                </Col>
              </Row>

              <hr className="my-4 border-dashed" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button onClick={() => navigate('/seguridad/modules-center')} color="secondary" outline className="px-4 shadow-sm">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Volver a la lista
                </Button>

                {perm.canEdit && (
                  <Button tag={Link} to={`/seguridad/modules-update/${modulesEntity.id}`} color="primary" className="px-4 shadow-sm">
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Módulo
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ModulesDetail;

import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faShieldAlt,
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faLock,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './module-permission.reducer';
import { usePermission } from 'app/shared/auth/use-permission';

export const ProfilePermissionsDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const perm = usePermission('Permisos');

  const modulePermissionEntity = useAppSelector(state => state.modulePermission.entity);
  const loading = useAppSelector(state => state.modulePermission.loading);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id]);

  if (loading) return <div className="text-center py-5">Cargando...</div>;
  if (!modulePermissionEntity?.id) return <div className="text-center py-5">No se encontró el permiso.</div>;

  // Helper para renderizar los badges de permisos
  const PermissionBadge = ({ label, value, icon }: { label: string; value: boolean; icon: any }) => (
    <div className="p-3 border rounded shadow-sm bg-white d-flex align-items-center mb-3">
      <FontAwesomeIcon icon={icon} className={`me-3 ${value ? 'text-success' : 'text-danger'}`} size="lg" />
      <div className="flex-grow-1">
        <span className="fw-bold d-block">{label}</span>
        <small className="text-muted">{value ? 'Permitido' : 'Restringido'}</small>
      </div>
      <div className="ms-auto">
        {value ? (
          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
        )}
      </div>
    </div>
  );

  return (
    <div className="module-permission-management container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex align-items-center mb-4">
        <div className="user-icon-bg me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faShieldAlt} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle de Permisos</h2>
          <p className="text-muted mb-0">Módulo: {modulePermissionEntity.moduleName}</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                  <h5 className="mb-0 fw-bold text-secondary">Configuración del Módulo</h5>
                </div>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              {/* Información Principal */}
              <Row className="mb-4">
                <Col md="6">
                  <label className="small text-uppercase fw-bold text-muted d-block mb-2">Nombre del Módulo</label>
                  <div className="d-flex flex-wrap gap-2">
                    {modulePermissionEntity.module ? (
                      <Badge color="primary" pill className="px-3 py-2 fw-normal fs-6 shadow-sm">
                        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                        {modulePermissionEntity.module.nombre}
                      </Badge>
                    ) : (
                      <span className="text-muted italic small">Sin módulo asignado</span>
                    )}
                  </div>
                </Col>
                <Col md="6" className="text-md-end mt-3 mt-md-0">
                  <label className="small text-uppercase fw-bold text-muted d-block mb-2">Perfil Vinculado</label>
                  <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                    {modulePermissionEntity.profile ? (
                      <Badge color="info" pill className="px-3 py-2 fw-normal fs-6 shadow-sm">
                        {modulePermissionEntity.profile.name}
                      </Badge>
                    ) : (
                      <span className="text-muted italic small">Sin perfil asignado</span>
                    )}
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Grid de Permisos */}
              <h6 className="mb-3 text-uppercase fw-bold text-muted" style={{ fontSize: '0.8rem' }}>
                Acciones Disponibles
              </h6>
              <Row>
                <Col md="4">
                  <PermissionBadge label="Crear" value={!!modulePermissionEntity.canCreate} icon={faShieldAlt} />
                </Col>
                <Col md="4">
                  <PermissionBadge label="Editar" value={!!modulePermissionEntity.canEdit} icon={faPencilAlt} />
                </Col>
                <Col md="4">
                  <PermissionBadge label="Eliminar" value={!!modulePermissionEntity.canDelete} icon={faLock} />
                </Col>
                <Col md="4">
                  <PermissionBadge label="Visualizar" value={!!modulePermissionEntity.canView} icon={faCheckCircle} />
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Botones de Acción */}
              <div className="d-flex justify-content-between">
                <Button
                  onClick={() => navigate('/seguridad/profile-permissions-center')}
                  color="secondary"
                  outline
                  className="px-4 shadow-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Volver a la lista
                </Button>

                {perm.canEdit && (
                  <Button
                    tag={Link}
                    to={`/seguridad/profile-permissions-update/${modulePermissionEntity.id}`}
                    color="primary"
                    className="px-4 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Permisos Perfil
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

export default ProfilePermissionsDetail;

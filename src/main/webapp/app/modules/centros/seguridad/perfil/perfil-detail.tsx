import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faUserShield,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { IProfile } from 'app/shared/model/profile.model';
import { usePermission } from 'app/shared/auth/use-permission';

export const ProfileDetail = () => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const perm = usePermission('Perfil');

  // Estado local para evitar reducers
  const [profileEntity, setProfileEntity] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IProfile>(`/api/profiles/${id}`);
        setProfileEntity(response.data);
      } catch (error) {
        console.error('Error al obtener el detalle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEntity();
  }, [id]);

  if (loading) return <div className="text-center py-5">Cargando...</div>;
  if (!profileEntity) return <div className="text-center py-5">No se encontró el perfil.</div>;

  return (
    <div className="profile-management container-fluid py-4">
      {/* Encabezado igual al de la lista */}
      <div className="d-flex align-items-center mb-4">
        <div className="user-icon-bg me-3 shadow-sm p-2 rounded bg-white text-primary">
          <FontAwesomeIcon icon={faIdCard} size="2x" />
        </div>
        <div>
          <h2 className="mb-0 fw-bold">Detalle del Perfil</h2>
          <p className="text-muted mb-0">Información completa de {profileEntity.name}</p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md="10">
          <Card className="shadow-sm border-0 rounded-3">
            <CardHeader className="bg-white py-3 border-bottom-0">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
                <h5 className="mb-0 fw-bold text-secondary">Información General</h5>
              </div>
            </CardHeader>
            <hr className="m-0" />
            <CardBody className="p-4">
              <Row className="mb-4">
                <Col md="6" className="mb-3">
                  <label className="small text-uppercase fw-bold text-muted d-block">Nombre del Perfil</label>
                  <span className="fs-5 fw-bold text-dark">{profileEntity.name}</span>
                </Col>
                <Col md="6" className="mb-3 text-md-end">
                  <label className="small text-uppercase fw-bold text-muted d-block">Estado</label>
                  {profileEntity.active ? (
                    <Badge color="success" className="px-3 py-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> ACTIVO
                    </Badge>
                  ) : (
                    <Badge color="danger" className="px-3 py-2">
                      <FontAwesomeIcon icon={faTimesCircle} className="me-1" /> INACTIVO
                    </Badge>
                  )}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md="12">
                  <label className="small text-uppercase fw-bold text-muted d-block">Descripción</label>
                  <p className="text-secondary bg-light p-3 rounded border">{profileEntity.description || 'Sin descripción disponible.'}</p>
                </Col>
              </Row>

              <Row className="mb-4 align-items-center">
                <Col md="6">
                  <div className="p-3 border rounded shadow-sm bg-white d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className={`me-3 ${profileEntity.isSuperAdmin ? 'text-warning' : 'text-muted'}`}
                      size="2x"
                    />
                    <div>
                      <span className="fw-bold d-block">Super Administrador</span>
                      <small className="text-muted">
                        {profileEntity.isSuperAdmin ? 'Este perfil tiene permisos totales' : 'Perfil de usuario estándar'}
                      </small>
                    </div>
                    <div className="ms-auto">
                      <input
                        type="checkbox"
                        checked={profileEntity.isSuperAdmin ?? false}
                        readOnly
                        className="form-check-input"
                        style={{ transform: 'scale(1.5)', cursor: 'default' }}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <label className="small text-uppercase fw-bold text-muted d-block mb-2">Usuarios Vinculados</label>
                  <div className="d-flex flex-wrap gap-2">
                    {profileEntity.users && profileEntity.users.length > 0 ? (
                      profileEntity.users.map(val => (
                        <Badge key={val.id} color="info" pill className="px-3 py-2 fw-normal">
                          {val.login}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted italic">Sin usuarios asignados</span>
                    )}
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Botonera de Acciones */}
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <Button onClick={() => navigate('/seguridad/profiles-center')} color="secondary" outline className="px-4 shadow-sm">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Volver a la lista
                </Button>

                {perm.canEdit && (
                  <Button tag={Link} to={`/seguridad/profiles-update/${profileEntity.id}`} color="primary" className="px-4 shadow-sm">
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Editar Perfil
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

export default ProfileDetail;

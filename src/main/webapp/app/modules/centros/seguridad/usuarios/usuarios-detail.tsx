import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Label, Alert, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPencilAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUser, updateUser, getRoles, reset } from './user-management.reducer';
import { getEntities as getProfiles, updateEntity as updateProfile } from 'app/entities/profile/profile.reducer';
import { usePermission } from 'app/shared/auth/use-permission';

export const UsuariosDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const perm = usePermission('Usuarios');

  const { login } = useParams<'login'>();

  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [initialProfileId, setInitialProfileId] = useState('');

  const user = useAppSelector(state => state.userManagement.user);
  const profiles = useAppSelector(state => state.profile.entities);

  const currentProfileData = profiles.find(p => p.id.toString() === selectedProfileId);

  useEffect(() => {
    dispatch(getUser(login));
    dispatch(getRoles());
    dispatch(getProfiles({}));
    return () => {
      dispatch(reset());
    };
  }, [login]);

  useEffect(() => {
    if (user.id && profiles.length > 0) {
      const currentProfile = profiles.find(p => p.users && p.users.some(u => u.id === user.id));
      if (currentProfile) {
        setSelectedProfileId(currentProfile.id.toString());
        setInitialProfileId(currentProfile.id.toString());
      }
    }
  }, [user, profiles]);

  return (
    <div className="p-4">
      {/* CABECERA */}
      <Row className="mb-3">
        <Col md="8">
          <dd>
            <h2 className="mt-3">
              Detalle de : <span>{login}</span>&nbsp;
            </h2>
            {user.activated ? <Badge color="success">Activated</Badge> : <Badge color="danger">Deactivated</Badge>}
          </dd>
        </Col>
      </Row>

      {/* AVATAR */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: '70px', height: '70px', flexShrink: 0 }}>
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="avatar"
              className="rounded-circle border shadow-sm"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center border"
              style={{ width: '100%', height: '100%' }}
            >
              <FontAwesomeIcon icon={faUserCircle} size="2x" className="text-muted" />
            </div>
          )}
        </div>
        <div>
          <div className="fw-bold fs-5">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-muted small">{user.email}</div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <Alert color="light" className="border shadow-sm p-4">
        <h4 className="text-muted mb-3">Datos de Cuenta</h4>
        <Row>
          <Col md="6" className="mb-3">
            <label className="form-label">Login</label>
            <input
              className="form-control"
              value={user.login || ''}
              readOnly
              style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
            />
          </Col>
          <Col md="6" className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={user.email || ''} readOnly style={{ backgroundColor: '#e9ecef' }} />
          </Col>
          <Col md="6" className="mb-3">
            <label className="form-label">Nombre</label>
            <input className="form-control" value={user.firstName || ''} readOnly style={{ backgroundColor: '#e9ecef' }} />
          </Col>
          <Col md="6" className="mb-3">
            <label className="form-label">Apellido</label>
            <input className="form-control" value={user.lastName || ''} readOnly style={{ backgroundColor: '#e9ecef' }} />
          </Col>
        </Row>

        <hr />

        <h4 className="text-muted mb-3">Información del Perfil</h4>
        <Row>
          <Col md="6" className="mb-3">
            <Label for="profileId">Asignar Perfil Personalizado</Label>
            <select
              className="form-select border-primary"
              id="profileId"
              value={selectedProfileId}
              onChange={e => setSelectedProfileId(e.target.value)}
              disabled
            >
              <option value="">Sin Perfil</option>
              {profiles.map(p => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Col>
          <Col md="6" className="mb-3">
            <label className="form-label">Descripción del Perfil</label>
            <input
              className="form-control"
              value={currentProfileData?.description || 'N/A'}
              readOnly
              style={{ backgroundColor: '#e9ecef' }}
            />
          </Col>
          <Col md="6" className="mt-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" checked={user.activated ?? false} disabled />
              <label className="form-check-label">Cuenta con acceso permitido</label>
            </div>
          </Col>
        </Row>
      </Alert>

      <div className="d-flex flex-wrap justify-content-between gap-3">
        <Button onClick={() => navigate('/seguridad/usuarios-center')} color="secondary" outline className="px-4 shadow-sm">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Volver a la lista
        </Button>

        {perm.canEdit && (
          <Button tag={Link} to={`/seguridad/usuarios-update/${user.login}`} color="primary" className="px-4 shadow-sm">
            <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
            Editar Usuario
          </Button>
        )}
      </div>
    </div>
  );
};

export default UsuariosDetail;

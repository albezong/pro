import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faUserCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUser, updateUser, reset } from './user-management.reducer';
import { getEntities as getProfiles, updateEntity as updateProfileEntity } from 'app/entities/profile/profile.reducer';

export const UsuariosUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { login } = useParams<'login'>();

  const [userFields, setUserFields] = useState({ id: '', login: '', firstName: '', lastName: '', email: '', activated: true });
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [initialProfileId, setInitialProfileId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const userEntity = useAppSelector(state => state.userManagement.user);
  const updating = useAppSelector(state => state.userManagement.updating);
  const updateSuccess = useAppSelector(state => state.userManagement.updateSuccess);
  const profiles = useAppSelector(state => state.profile.entities);

  useEffect(() => {
    dispatch(getUser(login));
    dispatch(getProfiles({}));
    return () => {
      dispatch(reset());
    };
  }, [login]);

  useEffect(() => {
    if (isInitialized) return;
    if (userEntity && userEntity.login === login && profiles.length > 0) {
      setUserFields({
        id: userEntity.id,
        login: userEntity.login,
        firstName: userEntity.firstName || '',
        lastName: userEntity.lastName || '',
        email: userEntity.email || '',
        activated: userEntity.activated,
      });
      setImagePreview(userEntity.imageUrl || '');
      const currentProfile = profiles.find(p => p.users && p.users.some(u => u.id === userEntity.id));
      if (currentProfile) {
        setSelectedProfileId(currentProfile.id.toString());
        setInitialProfileId(currentProfile.id.toString());
      }
      setIsInitialized(true);
    }
  }, [userEntity, profiles, isInitialized]);

  useEffect(() => {
    if (updateSuccess) navigate('/seguridad/usuarios-center');
  }, [updateSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserFields(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // ─── VALIDACIÓN DE IMAGEN IGUAL AL CREATE ──────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Validar Tipo
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes (JPG, PNG, WEBP)');
        e.target.value = ''; // Limpiar input
        setImageFile(null);
        return;
      }

      // 2. Validar Tamaño (2MB)
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error('La imagen es demasiado pesada. Máximo 2MB');
        e.target.value = ''; // Limpiar input
        setImageFile(null);
        return;
      }

      // Si todo está bien, actualizar previsualización y estado
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset_pwa');
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dosthluti/image/upload', { method: 'POST', body: formData });
      const data = await res.json();
      return data.secure_url || null;
    } catch {
      return null;
    }
  };

  const saveUser = async e => {
    e.preventDefault();

    let finalImageUrl = userEntity.imageUrl || '';

    if (imageFile) {
      toast.info('Subiendo nueva imagen...');
      const uploaded = await uploadToCloudinary(imageFile);
      if (uploaded) {
        finalImageUrl = uploaded;
        toast.success('Imagen subida correctamente.');
      } else {
        toast.error('No se pudo subir la imagen.');
      }
    }

    const userToUpdate = { ...userEntity, ...userFields, imageUrl: finalImageUrl };
    const resultAction = await dispatch(updateUser(userToUpdate));

    if (updateUser.fulfilled.match(resultAction)) {
      if (selectedProfileId !== initialProfileId) {
        if (initialProfileId) {
          const oldProfile = profiles.find(p => p.id.toString() === initialProfileId);
          if (oldProfile) {
            await dispatch(
              updateProfileEntity({
                ...oldProfile,
                users: oldProfile.users.filter(u => u.id !== userFields.id).map(u => ({ id: u.id })),
              }),
            );
          }
        }
        if (selectedProfileId) {
          const newProfile = profiles.find(p => p.id.toString() === selectedProfileId);
          if (newProfile) {
            await dispatch(
              updateProfileEntity({
                ...newProfile,
                users: [...(newProfile.users ? newProfile.users.map(u => ({ id: u.id })) : []), { id: userFields.id }],
              }),
            );
          }
        }
      }
    }
  };

  if (!isInitialized) return <div className="p-5 text-center">Cargando datos...</div>;

  return (
    <div className="p-4">
      <form onSubmit={saveUser}>
        <Row className="mb-3">
          <Col md="8">
            <h2 className="mt-3">
              Editando Usuario: <span className="text-primary">{userFields.login}</span>
            </h2>
          </Col>
        </Row>

        <Alert color="light" className="border shadow-sm">
          {/* SECCIÓN DE FOTO CON VALIDACIONES */}
          <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded border">
            <div style={{ width: '85px', height: '85px', flexShrink: 0 }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="avatar"
                  className="rounded-circle border shadow-sm"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center border"
                  style={{ width: '100%', height: '100%' }}
                >
                  <FontAwesomeIcon icon={faUserCircle} size="3x" className="text-muted" />
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <label className="form-label mb-1 fw-bold">Actualizar foto de perfil</label>
              <input
                type="file"
                className="form-control form-control-sm"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <small className="text-muted d-block mt-1">JPG, PNG o WEBP. Máx 2MB. Deja vacío para mantener la actual.</small>
            </div>
          </div>

          <h4 className="text-muted mb-3 border-bottom pb-2">Datos de Cuenta</h4>
          <Row>
            <Col md="6" className="mb-3">
              <label className="form-label fw-bold">
                Nombre de Usuario (Login) <FontAwesomeIcon icon={faLock} size="xs" className="text-muted ms-1" />
              </label>
              <input className="form-control bg-light" name="login" value={userFields.login} disabled style={{ cursor: 'not-allowed' }} />
            </Col>
            <Col md="6" className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input className="form-control" name="email" type="email" value={userFields.email} onChange={handleInputChange} required />
            </Col>
            <Col md="6" className="mb-3">
              <label className="form-label fw-bold">Nombre</label>
              <input className="form-control" name="firstName" value={userFields.firstName} onChange={handleInputChange} />
            </Col>
            <Col md="6" className="mb-3">
              <label className="form-label fw-bold">Apellidos</label>
              <input className="form-control" name="lastName" value={userFields.lastName} onChange={handleInputChange} />
            </Col>
          </Row>

          <hr className="my-4" />

          <h4 className="text-muted mb-3 border-bottom pb-2">Seguridad y Perfiles</h4>
          <Row className="align-items-center">
            <Col md="6" className="mb-3">
              <label className="form-label fw-bold">Asignar Perfil Personalizado</label>
              <select className="form-select border-primary" value={selectedProfileId} onChange={e => setSelectedProfileId(e.target.value)}>
                <option value="">Sin Perfil Especial</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col md="6" className="mb-3">
              <div className="form-check form-switch mt-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="activated"
                  id="activated"
                  checked={userFields.activated}
                  onChange={handleInputChange}
                />
                <label className="form-check-label fw-bold ms-2" htmlFor="activated">
                  Estado del Usuario:{' '}
                  {userFields.activated ? <span className="text-success">Activado</span> : <span className="text-danger">Inactivo</span>}
                </label>
              </div>
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-between border-top pt-3">
            <Button tag={Link} to="/seguridad/usuarios-center" color="secondary" outline>
              <FontAwesomeIcon icon={faArrowLeft} /> Regresar
            </Button>
            <Button color="success" type="submit" disabled={updating} className="px-4 shadow-sm">
              <FontAwesomeIcon icon={faSave} /> {updating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </Alert>
      </form>
    </div>
  );
};

export default UsuariosUpdate;

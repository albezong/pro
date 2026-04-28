import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Label, Progress, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faArrowRight, faArrowLeft, faTrash, faUserPlus, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { handleRegister, reset as resetRegister } from 'app/modules/account/register/register.reducer';
import { getEntities as getProfiles, updateEntity } from 'app/entities/profile/profile.reducer';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface CreatedUser {
  id: number;
  login: string;
  email: string;
  imageUrl?: string;
}

export const UsuariosCreateCarousel = () => {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profiles = useAppSelector(state => state.profile.entities);
  const loadingRegister = useAppSelector(state => state.register.loading);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  useEffect(() => {
    dispatch(resetRegister());
    dispatch(getProfiles({}));
  }, []);

  // ─── FUNCIÓN CLOUDINARY ─────────────────────────────────────────────────────
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = 'dosthluti';
    const uploadPreset = 'preset_pwa'; // Asegúrate que sea UNSIGNED en Cloudinary

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error('Error subiendo a Cloudinary:', error);
      return null;
    }
  };

  // ─── PASO 1: Crear usuario INACTIVO ────────────────────────────────────────
  const handleCreateUser = async values => {
    const regData = {
      login: values.login,
      email: values.email,
      password: values.firstPassword,
      langKey: currentLocale || 'es',
    };

    try {
      const resultAction = await dispatch(handleRegister(regData));

      if (handleRegister.fulfilled.match(resultAction)) {
        try {
          const userRes = await axios.get(`/api/admin/users/${values.login}`);
          const userData = userRes.data;

          // SUBIDA A CLOUDINARY
          let cloudUrl = '';
          if (imageFile) {
            toast.info('Subiendo imagen...');
            const uploadedUrl = await uploadToCloudinary(imageFile);
            if (uploadedUrl) {
              cloudUrl = uploadedUrl;
              toast.success('Imagen subida a la nube.');
            } else {
              toast.error('La imagen no se pudo subir, se continuará sin ella.');
            }
          }

          setCreatedUser({ ...userData, imageUrl: cloudUrl });
          setStep(1);
        } catch (err) {
          console.error(err);
          toast.error('Error al obtener datos del usuario creado');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error en el registro');
    }
  };

  // ─── PASO 2: Asignar perfil personalizado ──────────────────────────────────
  const handleAssignProfile = async () => {
    if (!selectedProfileId) {
      toast.warning('Selecciona un perfil para continuar.');
      return;
    }
    if (!createdUser?.id) return;

    setLoadingProfile(true);
    try {
      const selectedProfile = profiles.find(p => p.id.toString() === selectedProfileId.toString());

      if (selectedProfile) {
        const existingUsers = selectedProfile.users ? selectedProfile.users.map((u: any) => ({ id: u.id })) : [];

        const updatedProfile = {
          ...selectedProfile,
          users: [...existingUsers, { id: createdUser.id }],
          // sin image aquí
        };

        await dispatch(updateEntity(updatedProfile));

        // ✅ Si tienes una entidad separada por usuario (ej. UserProfile o similar),
        // guarda la imagen ahí. Si no, guarda en el User directamente:
        // Guarda la imagen en el User directamente
        if (createdUser.imageUrl) {
          await axios.put(`/api/admin/users/${createdUser.login}`, {
            id: createdUser.id,
            login: createdUser.login,
            email: createdUser.email,
            imageUrl: createdUser.imageUrl,
            activated: false,
            langKey: 'es',
            authorities: ['ROLE_USER', 'ROLE_ADMIN'], // <-- agrega ROLE_ADMIN
          });
        }

        toast.success('Perfil y foto asignados correctamente.');
        navigate('/seguridad/usuarios-center');
      }
    } catch (error) {
      toast.error('Error al asignar el perfil.');
      console.error(error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSkipProfile = () => {
    toast.info('Usuario creado sin perfil asignado.');
    navigate('/seguridad/usuarios-center');
  };

  const handleCancelClick = () => {
    if (createdUser) {
      setShowCancelModal(true);
    } else {
      navigate('/seguridad/usuarios-center');
    }
  };

  const handleCancelWithDelete = async () => {
    if (!createdUser?.login) return;
    setLoadingProfile(true);
    try {
      await axios.delete(`/api/admin/users/${createdUser.login}`);
      toast.info(`Usuario "${createdUser.login}" eliminado.`);
    } catch {
      toast.error('Error al eliminar. Bórralo manualmente.');
    } finally {
      setLoadingProfile(false);
      setShowCancelModal(false);
      navigate('/seguridad/usuarios-center');
    }
  };

  const steps = ['Datos del Usuario', 'Asignar Perfil'];
  const isLoading = loadingRegister || loadingProfile;

  return (
    <div className="custom-user-management container-fluid py-4">
      <div className="view-header d-flex align-items-center justify-content-between mb-2">
        <h3 className="mb-0 text-secondary">Crear Nuevo Usuario</h3>
        <Button color="link" className="text-danger p-0" onClick={handleCancelClick}>
          <FontAwesomeIcon icon={faTimes} /> Cancelar
        </Button>
      </div>
      <hr className="header-divider" />

      <Row className="justify-content-center mb-4">
        <Col md="8">
          <div className="d-flex justify-content-between mb-1">
            {steps.map((s, i) => (
              <span key={i} className={`fw-bold small ${i === step ? 'text-primary' : i < step ? 'text-success' : 'text-muted'}`}>
                {i < step ? '✓ ' : `${i + 1}. `} {s}
              </span>
            ))}
          </div>
          <Progress value={(step / (steps.length - 1)) * 100} color="success" style={{ height: '6px' }} />
        </Col>
      </Row>

      {step === 0 && (
        <Row className="justify-content-center">
          <Col md="10" lg="8">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faUserPlus} className="text-primary fs-5" />
              <h5 className="mb-0">Información del usuario</h5>
            </div>

            <ValidatedForm onSubmit={handleCreateUser}>
              <ValidatedField
                name="login"
                label="Usuario (Login)"
                labelCol={{ md: 3 }}
                inputCol={{ md: 9 }}
                row
                minLength={4} // Mínimo de caracteres
                maxLength={50} // Máximo de caracteres
                validate={{
                  required: { value: true, message: 'El login es requerido.' },
                  pattern: { value: /^[_.@A-Za-z0-9-]+$/, message: 'Usuario inválido.' },

                  minLength: { value: 4, message: 'El login no puede ser menor a 4 caracteres' },
                  maxLength: { value: 50, message: 'El login no puede exceder los 100 caracteres.' },
                }}
              />

              <ValidatedField
                name="email"
                label="Correo electrónico"
                labelCol={{ md: 3 }}
                inputCol={{ md: 9 }}
                row
                type="email"
                minLength={5} // Mínimo de caracteres
                maxLength={254} // Máximo de caracteres
                validate={{
                  required: { value: true, message: 'El correo es requerido.' },
                  validate: v => isEmail(v) || 'Correo inválido.',

                  minLength: { value: 5, message: 'El correo no puede ser menor a 5 caracteres' },
                  maxLength: { value: 254, message: 'El correo no puede exceder los 254 caracteres.' },
                }}
              />

              <ValidatedField
                name="firstPassword"
                label="Contraseña"
                labelCol={{ md: 3 }}
                inputCol={{ md: 9 }}
                row
                type="password"
                onChange={e => setPassword(e.target.value)}
                validate={{
                  required: { value: true, message: 'La contraseña es requerida.' },
                  minLength: { value: 4, message: 'Mínimo 4 caracteres.' },
                }}
              />

              <Row>
                <Col md={{ size: 9, offset: 3 }}>
                  <PasswordStrengthBar password={password} />
                </Col>
              </Row>

              <ValidatedField
                name="secondPassword"
                label="Confirmar contraseña"
                labelCol={{ md: 3 }}
                inputCol={{ md: 9 }}
                row
                type="password"
                validate={{
                  required: { value: true, message: 'Confirma tu contraseña.' },
                  validate: v => v === password || 'Las contraseñas no coinciden.',
                }}
              />

              <div className="mb-4 row">
                <Label for="foto" md="3" className="fw-bold">
                  Foto de Perfil
                </Label>
                <Col md="9">
                  <input
                    type="file"
                    id="foto"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp" // Formatos específicos
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // 1. Validar Tipo (MIME type)
                        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
                        if (!validImageTypes.includes(file.type)) {
                          toast.error('Solo se permiten imágenes (JPG, PNG, WEBP)');
                          e.target.value = ''; // Limpiar el input
                          setImageFile(null);
                          return;
                        }

                        // 2. Validar Tamaño (Ejemplo: 2MB = 2 * 1024 * 1024 bytes)
                        const maxSizeInMB = 2;
                        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
                        if (file.size > maxSizeInBytes) {
                          toast.error(`La imagen es demasiado pesada. Máximo ${maxSizeInMB}MB`);
                          e.target.value = ''; // Limpiar el input
                          setImageFile(null);
                          return;
                        }

                        // Si pasa las validaciones
                        setImageFile(file);
                      }
                    }}
                  />
                  <small className="text-muted d-block">Formatos: JPG, PNG o WEBP. Tamaño máximo: 2MB.</small>
                </Col>
              </div>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button color="success" type="submit" disabled={isLoading}>
                  <FontAwesomeIcon icon={faArrowRight} /> {isLoading ? 'Procesando...' : 'Crear Usuario y Continuar'}
                </Button>
              </div>
            </ValidatedForm>
          </Col>
        </Row>
      )}

      {step === 1 && createdUser && (
        <Row className="justify-content-center">
          <Col md="10" lg="8">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faIdCard} className="text-success fs-5" />
              <h5 className="mb-0">
                Asignar perfil a <strong>{createdUser.login}</strong>
              </h5>
            </div>

            <div className="alert alert-success py-2 mb-4 text-center">
              {createdUser.imageUrl && (
                <img
                  src={createdUser.imageUrl}
                  alt="Preview"
                  className="rounded-circle mb-2 border shadow-sm"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              )}
              <br />
              <small>
                ✅ Usuario <strong>{createdUser.login}</strong> creado. Asígnale un perfil.
              </small>
            </div>

            <Row className="mb-4 align-items-center">
              <Label md="3" for="profileId" className="fw-bold">
                Perfil Personalizado:
              </Label>
              <Col md="9">
                <select
                  id="profileId"
                  className="form-select"
                  value={selectedProfileId}
                  onChange={e => setSelectedProfileId(e.target.value)}
                >
                  <option value="">Sin Perfil Especial</option>
                  {profiles.map(p => (
                    <option value={p.id} key={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4 gap-2">
              <Button color="secondary" outline onClick={() => setStep(0)} disabled={isLoading}>
                <FontAwesomeIcon icon={faArrowLeft} /> Volver
              </Button>
              <div className="d-flex gap-2">
                <Button color="warning" outline onClick={handleSkipProfile} disabled={isLoading}>
                  Finalizar sin perfil
                </Button>
                <Button color="success" onClick={handleAssignProfile} disabled={isLoading || !selectedProfileId}>
                  <FontAwesomeIcon icon={faSave} /> {loadingProfile ? 'Asignando...' : 'Asignar y Finalizar'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Modal isOpen={showCancelModal} toggle={() => setShowCancelModal(false)} centered>
        <ModalHeader toggle={() => setShowCancelModal(false)}>¿Cancelar creación?</ModalHeader>
        <ModalBody>
          <p>
            El usuario <strong>{createdUser?.login}</strong> ya existe como inactivo.
          </p>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button color="danger" onClick={handleCancelWithDelete} disabled={isLoading}>
            <FontAwesomeIcon icon={faTrash} /> Eliminar usuario
          </Button>
          <Button color="secondary" onClick={() => setShowCancelModal(false)}>
            Volver
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UsuariosCreateCarousel;

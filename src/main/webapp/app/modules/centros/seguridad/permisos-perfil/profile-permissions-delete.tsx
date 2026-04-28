import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './module-permission.reducer';

export const ProfilePermissionsDelete = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [isDeleting, setIsDeleting] = useState(false);

  // Selectores del Reducer
  const modulePermissionEntity = useAppSelector(state => state.modulePermission.entity);
  const updateSuccess = useAppSelector(state => state.modulePermission.updateSuccess);
  const loading = useAppSelector(state => state.modulePermission.loading);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (updateSuccess && isDeleting) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleClose = () => {
    navigate('/seguridad/profile-permissions-center');
  };

  const confirmDelete = async () => {
    if (!modulePermissionEntity || !modulePermissionEntity.id) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteEntity(modulePermissionEntity.id));
      navigate('/seguridad/profile-permissions-center');
    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen toggle={handleClose} backdrop="static">
      <ModalHeader toggle={handleClose} className="bg-danger text-white border-0">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Confirmar Eliminación de Permiso
      </ModalHeader>
      <ModalBody className="py-4">
        {loading ? (
          <div className="text-center my-3">
            <Spinner color="danger" />
            <p className="mt-2 text-muted">Cargando detalles...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h5 className="fw-bold">¿Eliminar estos permisos?</h5>
            </div>
            <p className="text-center px-3">
              Estás a punto de eliminar los permisos configurados para el módulo: <br />
              <strong className="text-danger" style={{ fontSize: '1.2rem' }}>
                {`${modulePermissionEntity?.module?.nombre || 'N/A'}`}
              </strong>
              <br />
              <strong className="text-danger" style={{ fontSize: '1.2rem' }}>
                {`Perfil asociado: ${modulePermissionEntity?.profile?.name || 'N/A'}`}
              </strong>
            </p>

            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3 border-0 shadow-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-3 fa-2x" />
              <div>Esta acción es irreversible. El perfil perderá acceso inmediato a las funciones de este módulo.</div>
            </Alert>
          </>
        )}
      </ModalBody>
      <ModalFooter className="bg-light border-0">
        <Button color="secondary" outline onClick={handleClose} disabled={isDeleting || loading}>
          <FontAwesomeIcon icon={faBan} className="me-1" /> Cancelar
        </Button>
        <Button color="danger" onClick={confirmDelete} disabled={isDeleting || loading} className="shadow-sm">
          {isDeleting ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faTrash} />}
          &nbsp; {isDeleting ? 'Eliminando...' : 'Eliminar Permiso'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ProfilePermissionsDelete;

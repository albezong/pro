import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
// Usamos getEntities porque así definiste el GET ONE en tu reducer
import { getEntities, deleteEntity } from './profile.reducer';
import { getUsers, updateUser } from 'app/modules/administration/user-management/user-management.reducer';

export const ProfileDelete = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [isCleaning, setIsCleaning] = useState(false);

  // Selectores
  const profileEntity = useAppSelector(state => state.profile.entity);
  const users = useAppSelector(state => state.userManagement.users);
  const updateSuccess = useAppSelector(state => state.profile.updateSuccess);
  const loading = useAppSelector(state => state.profile.loading);

  useEffect(() => {
    if (id) {
      // En tu reducer, esta es la que trae el objeto por ID
      dispatch(getEntities(id));
      dispatch(getUsers({}));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleClose = () => {
    navigate('/seguridad/profiles-center');
  };

  const confirmDelete = async () => {
    if (!profileEntity || !profileEntity.id) return;

    setIsCleaning(true);

    try {
      // 1. Buscamos usuarios que tengan este perfil
      const usersWithThisProfile = users.filter(u => u.authorities && u.authorities.includes(profileEntity.name));

      if (usersWithThisProfile.length > 0) {
        // 2. Limpiamos las relaciones en paralelo
        const updatePromises = usersWithThisProfile.map(user => {
          const updatedUser = {
            ...user,
            authorities: user.authorities.filter(auth => auth !== profileEntity.name),
          };
          return dispatch(updateUser(updatedUser));
        });

        await Promise.all(updatePromises);
      }

      // 3. Finalmente borramos
      // Pasamos el ID directamente
      await dispatch(deleteEntity(profileEntity.id));
    } catch (error) {
      console.error('Error en el proceso de borrado:', error);
      setIsCleaning(false);
    }
  };

  return (
    <Modal isOpen toggle={handleClose} backdrop="static">
      <ModalHeader toggle={handleClose} className="bg-danger text-white">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Confirmar Eliminación
      </ModalHeader>
      <ModalBody className="py-4">
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <>
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <h5 className="fw-bold">¿Eliminar Perfil?</h5>
            </div>
            <p className="text-center">
              ¿Estás seguro de que deseas eliminar el perfil: <br />
              <strong className="text-primary">{profileEntity?.name || `ID: ${id}`}</strong>?
            </p>
            {/* fade={false} quita el warning del timeout de Reactstrap */}
            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Se desvinculará automáticamente a los usuarios de este perfil.
            </Alert>
          </>
        )}
      </ModalBody>
      <ModalFooter className="bg-light">
        <Button color="secondary" outline onClick={handleClose} disabled={isCleaning || loading}>
          <FontAwesomeIcon icon={faBan} className="me-1" /> Cancelar
        </Button>
        <Button color="danger" onClick={confirmDelete} disabled={isCleaning || loading}>
          {isCleaning ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faTrash} />}
          &nbsp; {isCleaning ? 'Limpiando...' : 'Eliminar Perfil'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ProfileDelete;

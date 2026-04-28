import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUser, deleteUser } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getProfiles, updateEntity as updateProfile } from 'app/entities/profile/profile.reducer';

export const UsuariosDelete = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { login } = useParams<'login'>();
  const [isCleaning, setIsCleaning] = useState(false);

  const user = useAppSelector(state => state.userManagement.user);
  const profiles = useAppSelector(state => state.profile.entities);
  const updateSuccess = useAppSelector(state => state.userManagement.updateSuccess);

  useEffect(() => {
    if (login) {
      dispatch(getUser(login));
      dispatch(getProfiles({})); // Cargamos perfiles para buscar la relación
    }
  }, [login, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleClose = () => {
    navigate('/seguridad/usuarios-center');
  };

  const confirmDelete = async () => {
    if (!user.login) return;

    setIsCleaning(true);

    try {
      // 1. BUSCAR EL PERFIL QUE CONTIENE AL USUARIO
      const profileWithUser = profiles.find(p => p.users && p.users.some(u => u.login === user.login));

      if (profileWithUser) {
        console.warn('Limpiando relación en perfil:', profileWithUser.name);

        // 2. FILTRAR LA LISTA (QUITAR AL USUARIO ACTUAL)
        const updatedUsersList = profileWithUser.users.filter(u => u.login !== user.login).map(u => ({ id: u.id })); // Solo enviamos IDs para evitar Error 400

        const profileToUpdate = {
          ...profileWithUser,
          users: updatedUsersList,
        };

        // 3. ACTUALIZAR PERFIL ANTES DE BORRAR
        await dispatch(updateProfile(profileToUpdate));
        console.warn('Relación limpiada con éxito.');
      }

      // 4. BORRAR USUARIO FINALMENTE
      dispatch(deleteUser(user.login));
    } catch (error) {
      console.error('Error durante la limpieza automática:', error);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirmar eliminación</ModalHeader>
      <ModalBody>
        ¿Estás seguro de que deseas eliminar al usuario <b>{user.login}</b>?
        <br />
        <small className="text-muted">El sistema desvinculará automáticamente al usuario de sus perfiles antes de eliminarlo.</small>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose} disabled={isCleaning}>
          <FontAwesomeIcon icon={faBan} />
          &nbsp; Cancelar
        </Button>
        <Button color="danger" onClick={confirmDelete} disabled={isCleaning}>
          {isCleaning ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faTrash} />}
          &nbsp; {isCleaning ? 'Limpiando...' : 'Eliminar Usuario'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UsuariosDelete;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle, faCubes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './modules.reducer';

export const ModulesDelete = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [isDeleting, setIsDeleting] = useState(false);

  // Selectores
  const modulesEntity = useAppSelector(state => state.modules.entity);
  const updateSuccess = useAppSelector(state => state.modules.updateSuccess);
  const loading = useAppSelector(state => state.modules.loading);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (updateSuccess && isDeleting) {
      toast.success('Módulo eliminado correctamente');
      handleClose();
    }
  }, [updateSuccess]);

  const handleClose = () => {
    navigate('/seguridad/modules-center');
  };

  const confirmDelete = async () => {
    if (!modulesEntity || !modulesEntity.id) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteEntity(modulesEntity.id));
    } catch (error) {
      console.error('Error al eliminar el módulo:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen toggle={handleClose} backdrop="static">
      <ModalHeader toggle={handleClose} className="bg-danger text-white border-0">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Confirmar Eliminación
      </ModalHeader>
      <ModalBody className="py-4">
        {loading ? (
          <div className="text-center py-4">
            <Spinner color="danger" />
            <p className="mt-2 text-muted">Cargando información...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faCubes} />
              </div>
              <h5 className="fw-bold">¿Eliminar Módulo?</h5>
            </div>
            <p className="text-center px-3">
              ¿Estás seguro de que deseas eliminar permanentemente el módulo: <br />
              <strong className="text-dark">{modulesEntity?.nombre || `ID: ${id}`}</strong>?
            </p>

            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3 mx-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" size="lg" />
              <div>Esta acción no se puede deshacer y podría afectar las funcionalidades asociadas a este módulo.</div>
            </Alert>
          </>
        )}
      </ModalBody>
      <ModalFooter className="bg-light border-0">
        <Button color="secondary" outline onClick={handleClose} disabled={isDeleting || loading}>
          <FontAwesomeIcon icon={faBan} className="me-1" /> Cancelar
        </Button>
        <Button color="danger" onClick={confirmDelete} disabled={isDeleting || loading} className="shadow-sm">
          {isDeleting ? (
            <>
              <Spinner size="sm" className="me-2" />
              Eliminando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Eliminar Módulo
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModulesDelete;

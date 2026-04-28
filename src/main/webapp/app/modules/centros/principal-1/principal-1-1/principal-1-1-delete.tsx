import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle, faSitemap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// --- IMPORTACIÓN DE DATOS EXTERNOS ---
import { INITIAL_DATA } from './principal-1-1-data';

export const Principal11Delete = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const idParam = useParams<{ id: string }>().id ?? '0';
  const entity = INITIAL_DATA.find(item => item.id === parseInt(idParam, 10));

  const handleClose = () => {
    navigate('/principal-1-routes/principal-1-1-center'); // Ruta de tu gestión principal
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    // Simulamos una petición asíncrona de borrado
    setTimeout(() => {
      setIsDeleting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <Modal isOpen toggle={handleClose} backdrop="static" centered>
      {!showSuccess ? (
        <>
          <ModalHeader toggle={handleClose} className="bg-danger text-white border-0">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Confirmar Eliminación de Componente
          </ModalHeader>
          <ModalBody className="py-4">
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faSitemap} />
              </div>
              <h5 className="fw-bold text-dark">¿Eliminar Componente de Sistema?</h5>
            </div>
            <p className="text-center px-3">
              ¿Estás seguro de que deseas eliminar permanentemente el registro con <br />
              <strong className="text-danger">Codigo: {entity?.codigo}</strong>?
            </p>

            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3 mx-2 border-0 shadow-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" size="lg" />
              <div>Esta acción es irreversible y el componente dejará de figurar en el inventario de la vista 1.1.</div>
            </Alert>
          </ModalBody>
          <ModalFooter className="bg-light border-0">
            <Button color="secondary" outline onClick={handleClose} disabled={isDeleting}>
              <FontAwesomeIcon icon={faBan} className="me-1" /> Cancelar
            </Button>
            <Button color="danger" onClick={confirmDelete} disabled={isDeleting} className="shadow-sm">
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="me-2" /> Eliminando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="me-2" /> Eliminar Registro
                </>
              )}
            </Button>
          </ModalFooter>
        </>
      ) : (
        /* VISTA DE ÉXITO ESTÁTICA CON ANIMACIÓN */
        <>
          <ModalBody className="text-center py-5">
            <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
              😉
            </div>
            <h3 className="text-success fw-bold">¡Registro eliminado exitosamente!</h3>
            <p className="text-muted">El componente ha sido removido de la vista actual.</p>

            <Alert color="info" className="mt-4 mx-3 border-0 shadow-sm small">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              <strong>Nota:</strong> El dato ficticio no se guardará en la base de datos (Efecto Estático).
            </Alert>

            <Button color="primary" className="mt-3 px-4" onClick={handleClose}>
              Entendido
            </Button>
          </ModalBody>
        </>
      )}

      {/* ESTILOS PARA LA CARITA GUIÑANDO */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
      `}</style>
    </Modal>
  );
};

export default Principal11Delete;

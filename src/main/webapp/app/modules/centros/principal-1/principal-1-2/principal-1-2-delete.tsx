import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle, faLayerGroup, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Importamos los datos de la 1.2
import { INITIAL_DATA_12 } from './principal-1-2-data';

export const Principal12Delete = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recursoNombre, setRecursoNombre] = useState('');

  // Buscamos el recurso estáticamente al cargar
  useEffect(() => {
    const recursoEncontrado = INITIAL_DATA_12.find(item => item.id === Number(id));
    if (recursoEncontrado) {
      setRecursoNombre(recursoEncontrado.recurso);
    }
  }, [id]);

  const handleClose = () => {
    navigate('/principal-1-routes/principal-1-2-center');
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    // Simulación de borrado estático
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
            Confirmar Liberación de Recurso
          </ModalHeader>

          <ModalBody className="py-4">
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faLayerGroup} />
              </div>
              <h5 className="fw-bold text-dark">¿Liberar Recurso de Infraestructura?</h5>
            </div>

            <p className="text-center px-3">
              ¿Estás seguro de que deseas desvincular permanentemente el recurso: <br />
              <strong className="text-danger">{recursoNombre || 'Cargando recurso...'}</strong>?
            </p>

            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3 mx-2 border-0 shadow-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" size="lg" />
              <div>Esta acción liberará la carga de trabajo asociada en la vista estática 1.2.</div>
            </Alert>
          </ModalBody>

          <ModalFooter className="bg-light border-0">
            <Button color="secondary" outline onClick={handleClose} disabled={isDeleting}>
              <FontAwesomeIcon icon={faBan} className="me-1" /> Cancelar
            </Button>
            <Button color="danger" onClick={confirmDelete} disabled={isDeleting} className="shadow-sm">
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="me-2" /> Liberando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="me-2" /> Liberar Recurso
                </>
              )}
            </Button>
          </ModalFooter>
        </>
      ) : (
        /* VISTA DE ÉXITO CON LA CARITA ANIMADA */
        <>
          <ModalBody className="text-center py-5">
            <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
              😉
            </div>
            <h3 className="text-success fw-bold">¡Recurso liberado exitosamente!</h3>
            <p className="text-muted">La infraestructura ha sido removida del monitoreo actual.</p>

            <Alert color="info" className="mt-4 mx-3 border-0 shadow-sm small">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              <strong>Nota:</strong> El dato ficticio no se guardará en la base de datos (Efecto Estático).
            </Alert>

            <Button color="info" className="mt-3 px-4 text-white" onClick={handleClose}>
              Entendido
            </Button>
          </ModalBody>
        </>
      )}

      {/* ESTILOS PARA LA ANIMACIÓN BOUNCE (Igual que en la 1.1) */}
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

export default Principal12Delete;

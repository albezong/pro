import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTrash, faExclamationTriangle, faProjectDiagram, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Importamos los datos y la interfaz de la 2.1
import { INITIAL_PROJECTS } from './principal-2-1-data';

export const Principal21Delete = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  // --- ESTADOS LOCALES ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [proyectoNombre, setProyectoNombre] = useState('');

  // Buscamos el proyecto estáticamente al cargar mediante el parámetro de la URL
  useEffect(() => {
    const proyectoEncontrado = INITIAL_PROJECTS.find(item => item.id === Number(id));
    if (proyectoEncontrado) {
      setProyectoNombre(proyectoEncontrado.nombre);
    }
  }, [id]);

  const handleClose = () => {
    navigate('/principal-2-routes/principal-2-1-center');
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    // Simulación de borrado estático (efecto visual)
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
            Confirmar Eliminación de Proyecto
          </ModalHeader>

          <ModalBody className="py-4">
            <div className="text-center mb-3">
              <div className="display-4 text-danger mb-2">
                <FontAwesomeIcon icon={faProjectDiagram} />
              </div>
              <h5 className="fw-bold text-dark">¿Eliminar Proyecto Operativo?</h5>
            </div>

            <p className="text-center px-3">
              ¿Estás seguro de que deseas eliminar permanentemente el proyecto: <br />
              <strong className="text-danger">{proyectoNombre || 'Cargando proyecto...'}</strong>?
            </p>

            <Alert color="warning" fade={false} className="small d-flex align-items-center mt-3 mx-2 border-0 shadow-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" size="lg" />
              <div>Esta acción removerá el registro de la gestión actual en la vista 2.1.</div>
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
                  <FontAwesomeIcon icon={faTrash} className="me-2" /> Eliminar Proyecto
                </>
              )}
            </Button>
          </ModalFooter>
        </>
      ) : (
        /* VISTA DE ÉXITO CON LA CARITA ANIMADA 😉 */
        <>
          <ModalBody className="text-center py-5">
            <div className="wink-animation mb-3" style={{ fontSize: '60px' }}>
              😉
            </div>
            <h3 className="text-success fw-bold">¡Proyecto eliminado!</h3>
            <p className="text-muted">El registro ha sido removido de la lista operativa.</p>

            <Alert color="info" className="mt-4 mx-3 border-0 shadow-sm small text-start">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              <strong>Nota:</strong> Los datos son volátiles. Al recargar la página, el proyecto volverá a aparecer (Efecto Estático).
            </Alert>

            <Button color="primary" className="mt-3 px-4 shadow-sm" onClick={handleClose}>
              Regresar al Listado
            </Button>
          </ModalBody>
        </>
      )}

      {/* ESTILOS PARA LA ANIMACIÓN */}
      <style>{`
        .wink-animation {
          display: inline-block;
          animation: wink-bounce 1.5s infinite;
        }

        @keyframes wink-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        
        .modal-content {
          border-radius: 15px;
          border: none;
        }
      `}</style>
    </Modal>
  );
};

export default Principal21Delete;

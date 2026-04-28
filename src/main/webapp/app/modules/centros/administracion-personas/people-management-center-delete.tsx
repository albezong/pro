// import React, { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBan, faTrash } from '@fortawesome/free-solid-svg-icons';

// import { useAppDispatch, useAppSelector } from 'app/config/store';
// // Usamos el reducer de UserProfile que es el que tiene el ID que manejas en la tabla
// import { getEntity, deleteEntity } from 'app/entities/user-profile/user-profile.reducer';

// export const PeopleManagementCenterDelete = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   // Obtenemos el ID de la URL
//   const { id } = useParams<'id'>();

//   // Selector para saber si se borró con éxito o si está cargando
//   const userProfileEntity = useAppSelector(state => state.userProfile.entity);
//   const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);

//   useEffect(() => {
//     if (id) {
//       dispatch(getEntity(id));
//     }
//   }, [id, dispatch]);

//   useEffect(() => {
//     if (updateSuccess) {
//       handleClose();
//     }
//   }, [updateSuccess]);

//   const handleClose = () => {
//     navigate('/people-management-center');
//   };

//   const confirmDelete = () => {
//     if (id) {
//       dispatch(deleteEntity(id));
//     }
//   };

//   return (
//     <Modal isOpen toggle={handleClose}>
//       <ModalHeader toggle={handleClose}>Confirmar eliminación</ModalHeader>
//       <ModalBody>
//         ¿Estás seguro de que deseas eliminar el perfil de <b>{userProfileEntity?.user?.login}</b>?
//         <br />
//         <small className="text-danger">Esta acción no se puede deshacer.</small>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={handleClose}>
//           <FontAwesomeIcon icon={faBan} />
//           &nbsp; Cancelar
//         </Button>
//         <Button color="danger" onClick={confirmDelete}>
//           <FontAwesomeIcon icon={faTrash} />
//           &nbsp; Eliminar Perfil
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default PeopleManagementCenterDelete;

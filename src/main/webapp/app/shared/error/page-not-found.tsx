import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Página 404 adaptada - también se usa cuando el usuario no tiene permisos
 * y PermissionGuard redirige con redirect=true.
 */
const PageNotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h4 className="text-muted mb-3">Página no encontrada o acceso denegado</h4>
        <p className="text-muted mb-4">
          La página que buscas no existe o no tienes permisos para acceder a ella.
          <br />
          Si crees que deberías tener acceso, contacta al administrador del sistema.
        </p>
        <Link to="/" className="btn btn-primary px-4">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;

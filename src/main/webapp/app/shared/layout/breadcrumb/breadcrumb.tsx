import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb as RSBreadcrumb, BreadcrumbItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Función para formatear el texto (ej: "usuarios-center" -> "Usuarios Center")
  const formatName = string => {
    return string.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <nav aria-label="breadcrumb" className="ms-3 mt-3">
      <RSBreadcrumb listClassName="custom-breadcrumb">
        <BreadcrumbItem>
          <Link to="/" className="breadcrumb-link">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Inicio
          </Link>
        </BreadcrumbItem>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <BreadcrumbItem key={to} active={isLast}>
              {isLast ? (
                <span className="current-page">{formatName(value)}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {formatName(value)}
                </Link>
              )}
            </BreadcrumbItem>
          );
        })}
      </RSBreadcrumb>
    </nav>
  );
};

export default Breadcrumb;

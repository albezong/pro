import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import { usePermission } from './use-permission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface PermissionMenuItemProps {
  moduleName: string;
  to: string;
  icon?: IconProp;
  label: string;
}

/**
 * A NavItem that only renders if the user has canView on the module.
 * Used in the dynamic navbar.
 */
const PermissionMenuItem = ({ moduleName, to, icon, label }: PermissionMenuItemProps) => {
  const { canView } = usePermission(moduleName);
  if (!canView) return null;
  return (
    <NavItem>
      <NavLink to={to} className="nav-link">
        {icon && <FontAwesomeIcon icon={icon} className="me-1" />}
        {label}
      </NavLink>
    </NavItem>
  );
};

export default PermissionMenuItem;

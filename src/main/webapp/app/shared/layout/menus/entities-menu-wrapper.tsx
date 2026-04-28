import React from 'react';
import { translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import EntitiesMenuItems from 'app/entities/menu';
import { usePermission } from 'app/shared/auth/use-permission';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

/**
 * Dropdown "Entities" que solo aparece si el usuario tiene canView en al menos
 * uno de los módulos de entidades (Perfil, Permisos, Modulos).
 * ROLE_ADMIN siempre lo ve.
 */
const EntitiesMenuWrapper = () => {
  // Hooks siempre primero
  const authorities = useAppSelector(s => s.authentication.account?.authorities ?? []);
  const isAdmin = hasAnyAuthority(authorities, [AUTHORITIES.ADMIN]);
  const loaded = useAppSelector(s => s.permission?.loaded);

  const perfil = usePermission('Perfil');
  const permisos = usePermission('Permisos');
  const modulos = usePermission('Modulos');

  // No-admin espera que carguen los permisos
  if (!isAdmin && !loaded) return null;

  const anyVisible = perfil.canView || permisos.canView || modulos.canView;
  if (!anyVisible) return null;

  return (
    <NavDropdown
      icon="th-list"
      name={translate('global.menu.entities.main')}
      id="entity-menu"
      data-cy="entity"
      style={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <EntitiesMenuItems />
    </NavDropdown>
  );
};

export default EntitiesMenuWrapper;

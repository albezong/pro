import React from 'react';
import { Translate } from 'react-jhipster';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { usePermission } from 'app/shared/auth/use-permission';

/**
 * Entities menu — items are shown only if the user has canView on that module.
 * ROLE_ADMIN always sees everything (usePermission returns FULL_ACCESS for admins).
 */
const EntitiesMenu = () => {
  // Hooks siempre primero
  const perfil = usePermission('Perfil');
  const permisos = usePermission('Permisos');
  const modulos = usePermission('Modulos');

  return (
    <>
      {perfil.canView && (
        <MenuItem icon="asterisk" to="/profile">
          <Translate contentKey="global.menu.entities.profile" />
        </MenuItem>
      )}
      {permisos.canView && (
        <MenuItem icon="asterisk" to="/module-permission">
          <Translate contentKey="global.menu.entities.modulePermission" />
        </MenuItem>
      )}
      {modulos.canView && (
        <MenuItem icon="asterisk" to="/modules">
          <Translate contentKey="global.menu.entities.modules" />
        </MenuItem>
      )}
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;

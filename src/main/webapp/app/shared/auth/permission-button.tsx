import React from 'react';
import { Button, ButtonProps } from 'reactstrap';
import { usePermission } from './use-permission';
import { ModuleAccess } from 'app/shared/reducers/permission';

interface PermissionButtonProps extends ButtonProps {
  moduleName: string;
  requiredAction: keyof ModuleAccess;
  children: React.ReactNode;
}

/**
 * A button that only renders if the user has the required action on the module.
 * No if/else needed in views.
 *
 * Example:
 *   <PermissionButton moduleName="Usuarios" requiredAction="canCreate" color="primary">
 *     Nuevo Usuario
 *   </PermissionButton>
 */
const PermissionButton = ({ moduleName, requiredAction, children, ...buttonProps }: PermissionButtonProps) => {
  const access = usePermission(moduleName);
  if (!access[requiredAction]) return null;
  return <Button {...buttonProps}>{children}</Button>;
};

export default PermissionButton;

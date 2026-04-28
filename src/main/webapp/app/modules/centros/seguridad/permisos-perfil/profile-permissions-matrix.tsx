import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card, CardBody, Table, Input, CardHeader, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faShieldAlt, faSync, faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getProfiles } from 'app/entities/profile/profile.reducer';
import { getEntities as getModules } from 'app/entities/modules/modules.reducer';
import { fetchPermissions } from 'app/shared/reducers/permission';
import axios from 'axios';
import { toast } from 'react-toastify';

type PermRow = {
  id: any;
  moduleId: any;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canHistory: boolean;
};

const ALL_PERMS: (keyof Omit<PermRow, 'id' | 'moduleId' | 'moduleName'>)[] = ['canView', 'canCreate', 'canEdit', 'canDelete', 'canHistory'];

export const ProfilePermissionsMatrix = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.profile.entities);
  const modules = useAppSelector(state => state.modules.entities);

  const [selectedProfile, setSelectedProfile] = useState('');
  const [permissionsMatrix, setPermissionsMatrix] = useState<PermRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Perfil seleccionado completo
  const selectedProfileObj = profiles.find(p => p.id.toString() === selectedProfile);
  const isSuperAdmin = !!selectedProfileObj?.isSuperAdmin;

  useEffect(() => {
    dispatch(getProfiles({}));
    dispatch(getModules({}));
  }, []);

  // Cuando cambia isSuperAdmin, rellena o vacía todos los checkboxes
  useEffect(() => {
    if (permissionsMatrix.length === 0) return;
    if (isSuperAdmin) {
      setPermissionsMatrix(prev =>
        prev.map(row => ({
          ...row,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canHistory: true,
        })),
      );
    }
  }, [isSuperAdmin]);

  const loadPermissions = async () => {
    if (!selectedProfile) {
      toast.error('Selecciona un perfil primero');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/module-permissions?profileId.equals=${selectedProfile}`);
      const existing = response.data;

      const matrix: PermRow[] = modules.map(mod => {
        const perm = existing.find(p => p.module?.id === mod.id);
        // Si el perfil es superAdmin, todos los permisos en true
        const allTrue = isSuperAdmin;
        return {
          id: perm?.id || null,
          moduleId: mod.id,
          moduleName: mod.nombre,
          canView: allTrue || perm?.canView || false,
          canCreate: allTrue || perm?.canCreate || false,
          canEdit: allTrue || perm?.canEdit || false,
          canDelete: allTrue || perm?.canDelete || false,
          canHistory: allTrue || perm?.canHistory || false,
        };
      });
      setPermissionsMatrix(matrix);
    } catch (e) {
      toast.error('Error al cargar la matriz');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index: number, field: string) => {
    // Si es superAdmin, no permitir desmarcado manual
    if (isSuperAdmin) {
      toast.info('Este perfil es SuperAdmin — todos los permisos están activos.');
      return;
    }
    const newMatrix = [...permissionsMatrix];
    newMatrix[index][field] = !newMatrix[index][field];
    setPermissionsMatrix(newMatrix);
  };

  // Marcar/desmarcar toda una columna
  const toggleColumn = (field: string) => {
    if (isSuperAdmin) return;
    const allChecked = permissionsMatrix.every(row => row[field]);
    setPermissionsMatrix(prev => prev.map(row => ({ ...row, [field]: !allChecked })));
  };

  const saveAll = async () => {
    setLoading(true);
    try {
      const promises = permissionsMatrix.map(row => {
        const payload = {
          id: row.id,
          canView: row.canView,
          canCreate: row.canCreate,
          canEdit: row.canEdit,
          canDelete: row.canDelete,
          canHistory: row.canHistory,
          module: { id: row.moduleId },
          profile: selectedProfileObj,
        };
        return row.id ? axios.put(`/api/module-permissions/${row.id}`, payload) : axios.post('/api/module-permissions', payload);
      });

      await Promise.all(promises);
      toast.success('Todos los permisos han sido guardados');
      loadPermissions();
      dispatch(fetchPermissions());
    } catch (e) {
      toast.error('Error al guardar algunos permisos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-0 py-3 d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
          <h4 className="fw-bold mb-0">Asignación de Permisos por Perfil</h4>
          {isSuperAdmin && (
            <Badge color="warning" pill className="ms-2">
              <FontAwesomeIcon icon={faStar} className="me-1" /> SuperAdmin — Acceso Total
            </Badge>
          )}
        </CardHeader>
        <CardBody>
          <div className="d-flex align-items-end gap-3 mb-4 bg-light p-3 rounded">
            <div style={{ flex: 1 }}>
              <label className="small fw-bold text-muted">Selecciona un perfil</label>
              <Input type="select" value={selectedProfile} onChange={e => setSelectedProfile(e.target.value)}>
                <option value="">Seleccione...</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isSuperAdmin ? '⭐' : ''}
                  </option>
                ))}
              </Input>
            </div>
            <Button color="primary" onClick={loadPermissions} disabled={loading || !selectedProfile}>
              <FontAwesomeIcon icon={faSync} spin={loading} /> Cargar permisos
            </Button>
            <Button color="success" onClick={saveAll} disabled={loading || permissionsMatrix.length === 0}>
              <FontAwesomeIcon icon={faSave} /> Guardar permisos
            </Button>
          </div>

          {isSuperAdmin && (
            <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faStar} />
              <span>
                Este perfil es <strong>SuperAdmin</strong>. Todos los permisos están activos y no pueden desactivarse individualmente.
              </span>
            </div>
          )}

          <div className="table-responsive">
            <Table hover bordered className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th className="text-start" style={{ width: '250px' }}>
                    Módulo
                  </th>
                  {['canView', 'canCreate', 'canEdit', 'canDelete', 'canHistory'].map(field => (
                    <th key={field}>
                      <div
                        style={{ cursor: isSuperAdmin ? 'default' : 'pointer' }}
                        onClick={() => toggleColumn(field)}
                        title={isSuperAdmin ? '' : 'Clic para marcar/desmarcar toda la columna'}
                      >
                        {{ canView: 'Ver', canCreate: 'Crear', canEdit: 'Editar', canDelete: 'Eliminar', canHistory: 'Historial' }[field]}
                        {!isSuperAdmin && (
                          <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                            ▲▼ todo
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.length > 0 ? (
                  permissionsMatrix.map((row, idx) => (
                    <tr key={row.moduleId}>
                      <td className="text-start fw-bold">{row.moduleName}</td>
                      {ALL_PERMS.map(field => (
                        <td key={field}>
                          <Input
                            type="checkbox"
                            checked={row[field]}
                            onChange={() => handleCheckboxChange(idx, field)}
                            disabled={isSuperAdmin}
                            style={isSuperAdmin ? { accentColor: '#f0ad4e', cursor: 'default' } : {}}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-muted py-4">
                      Seleccione un perfil y presione Cargar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="mt-3">
            <Button tag={Link} to="/seguridad/profile-permissions-center" color="link" className="text-muted">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver a la gestión
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePermissionsMatrix;

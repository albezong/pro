import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card, CardBody, Table, Input, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faShieldAlt, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getProfiles } from 'app/entities/profile/profile.reducer';
import { getEntities as getModules } from 'app/entities/modules/modules.reducer';
import { fetchPermissions } from 'app/shared/reducers/permission';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ProfilePermissionsMatrix = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.profile.entities);
  const modules = useAppSelector(state => state.modules.entities);

  const [selectedProfile, setSelectedProfile] = useState('');
  const [permissionsMatrix, setPermissionsMatrix] = useState<
    Array<{
      id: any;
      moduleId: any;
      moduleName: string;
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canHistory: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getProfiles({}));
    dispatch(getModules({}));
  }, []);

  // Cargar permisos existentes cuando se selecciona un perfil
  const loadPermissions = async () => {
    if (!selectedProfile) {
      toast.error('Selecciona un perfil primero');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/module-permissions?profileId.equals=${selectedProfile}`);
      const existing = response.data;

      // Cruzamos los módulos totales con los permisos existentes
      const matrix = modules.map(mod => {
        const perm = existing.find(p => p.module?.id === mod.id);
        return {
          id: perm?.id || null, // Si no existe, es null para saber que es un POST
          moduleId: mod.id,
          moduleName: mod.nombre,
          canView: perm?.canView || false,
          canCreate: perm?.canCreate || false,
          canEdit: perm?.canEdit || false,
          canDelete: perm?.canDelete || false,
          canHistory: perm?.canHistory || false,
        };
      });
      setPermissionsMatrix(matrix);
    } catch (e) {
      toast.error('Error al cargar la matriz');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index, field) => {
    const newMatrix = [...permissionsMatrix];
    newMatrix[index][field] = !newMatrix[index][field];
    setPermissionsMatrix(newMatrix);
  };

  const saveAll = async () => {
    setLoading(true);
    try {
      const profileObj = profiles.find(p => p.id.toString() === selectedProfile);

      // Enviamos cada permiso (puedes optimizar esto con un endpoint bulk en el backend)
      const promises = permissionsMatrix.map(row => {
        const payload = {
          id: row.id,
          canView: row.canView,
          canCreate: row.canCreate,
          canEdit: row.canEdit,
          canDelete: row.canDelete,
          canHistory: row.canHistory,
          module: { id: row.moduleId },
          profile: profileObj,
        };
        return row.id ? axios.put(`/api/module-permissions/${row.id}`, payload) : axios.post('/api/module-permissions', payload);
      });

      await Promise.all(promises);
      toast.success('Todos los permisos han sido guardados');
      loadPermissions(); // Recargamos para obtener los IDs nuevos
      dispatch(fetchPermissions()); // Refrescamos permisos en el frontend
    } catch (e) {
      toast.error('Error al guardar algunos permisos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-0 py-3">
          <h4 className="fw-bold mb-0">Asignación de Permisos por Perfil</h4>
        </CardHeader>
        <CardBody>
          <div className="d-flex align-items-end gap-3 mb-4 bg-light p-3 rounded">
            <div style={{ flex: 1 }}>
              <label className="small fw-bold text-muted">Selecciona un perfil</label>
              <Input type="select" value={selectedProfile} onChange={e => setSelectedProfile(e.target.value)}>
                <option value="">Seleccione...</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
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

          <div className="table-responsive">
            <Table hover bordered className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th className="text-start" style={{ width: '250px' }}>
                    Módulo
                  </th>
                  <th>Consultar (Ver)</th>
                  <th>Agregar (Crear)</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.length > 0 ? (
                  permissionsMatrix.map((row, idx) => (
                    <tr key={row.moduleId}>
                      <td className="text-start fw-bold">{row.moduleName}</td>
                      <td>
                        <Input type="checkbox" checked={row.canView} onChange={() => handleCheckboxChange(idx, 'canView')} />
                      </td>
                      <td>
                        <Input type="checkbox" checked={row.canCreate} onChange={() => handleCheckboxChange(idx, 'canCreate')} />
                      </td>
                      <td>
                        <Input type="checkbox" checked={row.canEdit} onChange={() => handleCheckboxChange(idx, 'canEdit')} />
                      </td>
                      <td>
                        <Input type="checkbox" checked={row.canDelete} onChange={() => handleCheckboxChange(idx, 'canDelete')} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-muted py-4">
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

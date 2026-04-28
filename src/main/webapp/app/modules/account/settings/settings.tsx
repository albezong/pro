import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card, CardBody, Badge } from 'reactstrap';
import { translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faShieldAlt, faKey, faCheckCircle, faTimesCircle, faSave } from '@fortawesome/free-solid-svg-icons';

import { languages, locales } from 'app/config/translation';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { reset, saveAccountSettings } from './settings.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);
  const authorities = useAppSelector(s => s.authentication.account?.authorities ?? []);
  const isAdmin = hasAnyAuthority(authorities, [AUTHORITIES.ADMIN]);
  const perms = useAppSelector(s => s.permission?.permissions);
  const loaded = useAppSelector(s => s.permission?.loaded);

  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '', langKey: 'es' });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  // Hidrata los campos cuando account llega
  useEffect(() => {
    if (account?.login && !initialized) {
      setFields({
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        email: account.email || '',
        langKey: account.langKey || 'es',
      });
      setInitialized(true);
    }
  }, [account, initialized]);

  useEffect(() => {
    if (successMessage) toast.success(translate(successMessage));
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveAccountSettings({ ...account, ...fields }));
  };

  const moduleEntries = perms?.modules ? Object.entries(perms.modules) : [];

  const permLabel = (val: boolean) =>
    val ? (
      <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
    ) : (
      <FontAwesomeIcon icon={faTimesCircle} className="text-danger opacity-25" />
    );

  if (!account?.login) return <div className="p-5 text-center text-muted">Cargando perfil...</div>;

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '960px' }}>
      {/* ── AVATAR + NOMBRE ────────────────────────────────────────────── */}
      <div className="text-center mb-4">
        <div className="mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
          {account.imageUrl ? (
            <img
              src={account.imageUrl}
              alt="avatar"
              className="rounded-circle border shadow"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-light border shadow d-flex align-items-center justify-content-center"
              style={{ width: '100%', height: '100%' }}
            >
              <FontAwesomeIcon icon={faUserCircle} size="3x" className="text-muted" />
            </div>
          )}
        </div>
        <h4 className="fw-bold mb-0">
          {account.firstName || account.login} {account.lastName}
        </h4>
        <div className="text-muted small">{account.email}</div>
        <div className="mt-2 d-flex justify-content-center gap-2 flex-wrap">
          {isAdmin && (
            <Badge color="danger" pill>
              Admin
            </Badge>
          )}
          {perms?.isSuperAdmin && (
            <Badge color="warning" pill>
              Super Admin
            </Badge>
          )}
          {account.activated ? (
            <Badge color="success" pill>
              Activo
            </Badge>
          ) : (
            <Badge color="secondary" pill>
              Inactivo
            </Badge>
          )}
        </div>
      </div>

      {/* ── PERMISOS POR MÓDULO ──────────────────────────────────────────── */}
      {!isAdmin && loaded && moduleEntries.length > 0 && (
        <Card className="shadow-sm mb-4">
          <CardBody>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
              Módulos y Permisos
            </h5>
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Módulo</th>
                    <th className="text-center">Ver</th>
                    <th className="text-center">Crear</th>
                    <th className="text-center">Editar</th>
                    <th className="text-center">Eliminar</th>
                    <th className="text-center">Historial</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleEntries.map(([name, m]: [string, any]) => (
                    <tr key={name}>
                      <td className="fw-semibold">{name}</td>
                      <td className="text-center">{permLabel(m.canView)}</td>
                      <td className="text-center">{permLabel(m.canCreate)}</td>
                      <td className="text-center">{permLabel(m.canEdit)}</td>
                      <td className="text-center">{permLabel(m.canDelete)}</td>
                      <td className="text-center">{permLabel(m.canHistory)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {isAdmin && (
        <Card className="shadow-sm mb-4">
          <CardBody className="d-flex align-items-center gap-3">
            <FontAwesomeIcon icon={faKey} size="2x" className="text-warning" />
            <div>
              <div className="fw-bold">Acceso total de administrador</div>
              <div className="text-muted small">Tienes acceso completo a todos los módulos del sistema.</div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── FORMULARIO ────────────────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardBody>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faUserCircle} className="text-primary" />
            Datos de la Cuenta
          </h5>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md="6" className="mb-3">
                <label className="form-label">{translate('settings.form.firstname')}</label>
                <input
                  className="form-control"
                  name="firstName"
                  value={fields.firstName}
                  onChange={handleChange}
                  placeholder={translate('settings.form.firstname.placeholder')}
                  required
                  minLength={4}
                  maxLength={50}
                />
              </Col>
              <Col md="6" className="mb-3">
                <label className="form-label">{translate('settings.form.lastname')}</label>
                <input
                  className="form-control"
                  name="lastName"
                  value={fields.lastName}
                  onChange={handleChange}
                  placeholder={translate('settings.form.lastname.placeholder')}
                  required
                  minLength={4}
                  maxLength={50}
                />
              </Col>
              <Col md="6" className="mb-3">
                <label className="form-label">{translate('global.form.email.label')}</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={254}
                />
              </Col>
              <Col md="6" className="mb-3">
                <label className="form-label">{translate('settings.form.language')}</label>
                <select className="form-select" name="langKey" value={fields.langKey} onChange={handleChange}>
                  {locales.map(locale => (
                    <option value={locale} key={locale}>
                      {languages[locale].name}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <div className="text-end">
              <Button color="primary" type="submit" className="px-4">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {translate('settings.form.button')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;

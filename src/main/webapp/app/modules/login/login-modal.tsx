import React, { useState } from 'react';
import { Translate, ValidatedField, translate } from 'react-jhipster';
import { Alert, Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { type FieldError, useForm } from 'react-hook-form';

import ReCAPTCHA from 'react-google-recaptcha';

const CAPTCHA_SITE_KEY = '6LfRMsssAAAAANV0YPG8Cbg8hRvimOcOZTMbTsqi';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const navigate = useNavigate();
  const [captchaValidated, setCaptchaValidated] = useState(false);

  const onCaptchaChange = (token: string | null) => {
    setCaptchaValidated(!!token);
  };

  const login = ({ username, password, rememberMe }) => {
    // LOGIN NORMAL (sin captcha)
    props.handleLogin(username, password, rememberMe);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const { loginError, handleClose } = props;

  const handleLoginSubmit = e => {
    handleSubmit(login)(e);
  };

  const goToRegister = () => {
    if (!captchaValidated) {
      alert('Completa el captcha para continuar al registro');
      return;
    }

    navigate('/account/register', {
      state: { captchaValidated: true },
    });
  };

  return (
    <Modal isOpen={props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false}>
      <Form onSubmit={handleLoginSubmit}>
        <ModalHeader id="login-title" data-cy="loginTitle" toggle={handleClose}>
          <Translate contentKey="login.title">Sign in</Translate>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="12">
              {loginError ? (
                <Alert color="danger" data-cy="loginError">
                  <Translate contentKey="login.messages.error.authentication">
                    <strong>Failed to sign in!</strong> Please check your credentials and try again.
                  </Translate>
                </Alert>
              ) : null}
            </Col>

            <Col md="12">
              <ValidatedField
                name="username"
                label={translate('global.form.username.label')}
                placeholder={translate('global.form.username.placeholder')}
                required
                autoFocus
                data-cy="username"
                validate={{ required: 'Username cannot be empty!' }}
                register={register}
                error={errors.username as FieldError}
                isTouched={touchedFields.username}
              />

              <ValidatedField
                name="password"
                type="password"
                label={translate('login.form.password')}
                placeholder={translate('login.form.password.placeholder')}
                required
                data-cy="password"
                validate={{ required: 'Password cannot be empty!' }}
                register={register}
                error={errors.password as FieldError}
                isTouched={touchedFields.password}
              />
            </Col>
          </Row>

          <div className="mt-3" />

          {/* CAPTCHA SOLO PARA REGISTRO */}
          <Alert color="light">
            <p className="text-center mb-3">
              <p>Completa el captcha para habilitar el registro</p>
            </p>

            <div style={{ minHeight: '80px', background: '#f9f9f9' }} className="d-flex justify-content-center">
              <ReCAPTCHA sitekey={CAPTCHA_SITE_KEY} onChange={onCaptchaChange} />
            </div>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={handleClose} tabIndex={1}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>

          {/* LOGIN NORMAL */}
          <Button color="success" type="submit" data-cy="submit" disabled={!captchaValidated}>
            <Translate contentKey="login.form.button">Sign in</Translate>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default LoginModal;

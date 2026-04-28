import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Carousel, CarouselItem, CarouselIndicators } from 'reactstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const PeopleManagementCenterCreate = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null); // Guardamos el login creado

  return (
    <div className="container mt-5">
      <Button tag={Link} to="/people-management-center" color="secondary" size="sm">
        <FontAwesomeIcon icon={faArrowLeft} /> Regresar
      </Button>
      <br />
      <h1 className="text-center mb-4">Hola, {registeredUser} esto es Recursos Humanos 1.1</h1>
    </div>
  );
};

export default PeopleManagementCenterCreate;

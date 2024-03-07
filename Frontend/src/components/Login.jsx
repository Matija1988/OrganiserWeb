import React, { useState } from 'react';
import { CardBody, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css'
import './LoginStyle.css';
import useForm from '../hooks/useForm';
import { ENDPOINTS, createAPIEndpoint } from '../api';

const getFreshModel = () => ({
    username: '',
    password: ''
});


export default function Login() {

    const { values,
        setValues,
        errors,
        setErrors,
        handleInputChange } = useForm(getFreshModel);


    const login = e => {
        e.preventDefault();
        if(validate())
        createAPIEndpoint(ENDPOINTS.member)
        .post(values)
        .then(res=>console.log(res))
        .catch(err=>console.log())
    }

    
const validate = () => {
    let temp = {}
    temp.username =values.username != "" ? "" : "Username is not valid"
    temp.password = values.password != "" ? "" : "Password is not valid"
    setErrors(temp)
    return Object.values(temp).every(x=> x == "")

}

    return (

        <Container fluid >
            <Form onSubmit={login}>
                <Row>
                    <Col className='LoginText'> C-project </Col>
                </Row>
                <Row>
                    <Col className='LoginText2'>Launch your projects into cyberspace</Col>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="username"
                        name="username"
                        placeholder="Username"
                        value={values.username}
                        onChange={handleInputChange}
                        {...(errors.username && {error:true, helperText:errors.username})}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleInputChange}
                        {...(errors.password && {error:true, helperText:errors.password})}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className='SignInButton'>
                    Sign in
                </Button>

            </Form>
        </Container>
    )

}
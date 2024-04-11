import { Container, Form, Row, Col, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
import './LoginStyle.css';

import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const {login} = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e) {

        e.preventDefault();

        const data = new FormData(e.target);
        login({
            email:data.get('email'),
            password: data.get('password'),
        });
    }


    return (

        <Container fluid className='loginContainer'>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className='LoginText'> C-project </Col>
                </Row>
                <Row>
                    <Col className='LoginText2'>Launch your projects into cyberspace</Col>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="username"
                        name="email"
                        placeholder="texasranger@gmail.com"
                        maxLength={255}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="chuckneedsnopassword"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className='SignInButton'>
                    Authorize                    
                </Button>

            </Form>
        </Container>
    )

}
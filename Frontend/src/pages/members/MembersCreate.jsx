import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import MembersService from '../../services/MembersService';
import { RoutesNames } from '../../constants';


export default function MembersCreate() {

    const navigate = useNavigate();

    async function addMember(Member) {

        const reply = await MembersService.createMember(Member);
        if (reply.ok) {
            navigate(RoutesNames.MEMBERS_READ);
        } else {
            alert(reply.message.error);
        }

    }

    function handleSubmit(e) {
        e.preventDefault();

        const information = new FormData(e.target);

        addMember({
            firstName: information.get('firstName'),
            lastName: information.get('lastName'),
            username: information.get('username'),
            password: information.get('password'),
            isTeamLeader: information.get('isTeamLeader')
        });

    }

    return (
        <Container className='mt-4'>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>

                <Form.Group className='mb-3' controlId='firstName'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='firstName'
                        placeholder='First Name'
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='lastName'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='lastName'
                        placeholder='Last Name'
                        maxLength={50}
                        required
                    />

                </Form.Group>

                <Form.Group className='mb-3' controlId='username'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='username'
                        placeholder='Username'
                        maxLength={50}
                        required
                    />

                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='password'
                        placeholder='Password'
                        maxLength={100}
                        required
                    />

                </Form.Group>

                <Form.Group className='mb-3' controlId="isTeamLeader">
                    <Form.Check
                        label="Status"
                        inline
                        name='isTeamLeader'
                    />

                </Form.Group>

                <Row>
                    <Col>
                        <Link className='btn btn-danger gumb' to={RoutesNames.MEMBERS_READ}>
                            CANCEL
                        </Link>
                    </Col>

                    <Col>
                        <Button variant='primary' className='gumb' type='submit'>
                            ADD MEMBER
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    );

}
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import MembersService from "../../services/MembersService";
import { RoutesNames } from "../../constants";

export default function MembersUpdate() {

    const [member, setMember] = useState({});

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchMember() {

        await MembersService.getById(routeParams.getById)
            .then((response) => {
                console.log(response);
                setMember(response.data);
            })
            .catch((err) => alert(err.message));
    }

    useEffect(() => {
        fetchMember();
    }, []);

    async function UpdateMember(member) {

        const reply = await MembersService.updateMember(routeParams.id, member);

        if (reply.ok) {
            navigate(RoutesNames.MEMBERS_READ);
        } else {
            alert(reply.message);
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        UpdateMember({
            firstName: information.get('firstName'),
            lastName: information.get('lastName'),
            username: information.get('username'),
            password: information.get('password'),
            isTeamLeader: information.get('isTeamLeader')
        });

    }

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='firstName'
                        defaultValue={member.firstName}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='lastName'
                        defaultValue={member.lastName}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        name='username'
                        defaultValue={member.username}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='text'
                        name='password'
                        defaultValue={member.password}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="isTeamLeader">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                        type='text'
                        name='isTeamLeader'
                        defaultValue={member.isTeamLeader}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Row>
                    <Col>
                    <Link className="btn btn-danger gumb" to={RoutesNames.MEMBERS_READ}>
                        CANCEL
                    </Link>
                    </Col>
                    <Col>
                    <Button varian='primary' className="gumb" type='submit'>
                            UPDATE MEMBER
                    </Button>
                    </Col>
                </Row>


            </Form>
        </Container>
    );

}

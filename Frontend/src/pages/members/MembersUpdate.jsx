import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import MembersService from "../../services/MembersService";
import { RoutesNames } from "../../constants";

import './membersStyle.css';
import { getAlertMessages } from "../../services/httpService";

export default function MembersUpdate() {

    const [member, setMember] = useState({});

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchMember() {

        const response = await MembersService.getById(routeParams.id);
            if(!response.ok) {
                alert(getAlertMessages(response.data));
                return;
            }
            setMember(response.data);
    }

    useEffect(() => {
        fetchMember();
    }, []);

    async function UpdateMember(member) {

        const response = await MembersService.updateMember(routeParams.id, member);
        if (response.ok) {
            navigate(RoutesNames.MEMBERS_READ);
            return;
        } 
        alert(getAlertMessages(response.data));
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        UpdateMember({
            firstName: information.get('firstName'),
            lastName: information.get('lastName'),
            username: information.get('username'),
            password: information.get('password'),
            email: information.get('email'),
            isTeamLeader: information.get('isTeamLeader') == 'on' ? true : false
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>

                <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='firstName'
                        defaultValue={member.firstName}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="lastName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='lastName'
                        defaultValue={member.lastName}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        name='username'
                        defaultValue={member.username}
                        maxLength={50}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='text'
                        name='password'
                        defaultValue={member.password}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="email">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='email'
                        name='email'
                        defaultValue={member.email}
                        maxLength={255}
                        required
                    />
                </Form.Group>


                <Form.Group  controlId="isTeamLeader">
                    <Form.Label>Position</Form.Label>
                    <Form.Check
                        label= 'isTeamLeder'
                        name='isTeamLeader'
                        
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

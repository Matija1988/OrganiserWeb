import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import ProofsService from "../../services/ProofsService";
import { RoutesNames } from "../../constants";

import './proofsStyle.css';

export default function ProofUpdate() {

    const [proof, setProof] = useState({});

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchProof() {
        const response = await ProofsService.getById(routeParams.id);
        if(!response.ok){
            alert(getAlertMessages(response.data));
            return;
        }
        setProof(response.data);
    }

    useEffect(() => {
        fetchProof();
    }, []);

    async function changeProof(proof) {
        const response = await ProofsService.updateProof(routeParams.id, proof);
        if (response.ok) {
            navigate(RoutesNames.PROOFS_READ);
            return;
        } 
        alert(getAlertMessages(response.data));
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        changeProof({
            documentName: information.get('documentName'),
            member: information.get('member'),
            location: information.get('Location'),
            datecreated: information.get('dateCreated'),
            activity: information.get('activity')
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>

                <Form.Group controlId="documentName">
                    <Form.Label>Document Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='documentName'
                        defaultValue={proof.documentName}
                        maxLength={100}
                        
                    />
                </Form.Group>

                <Form.Group  controlId="memberID">
                    <Form.Label>Member</Form.Label>
                    <Form.Control
                        type='text'
                        name='member'
                        defaultValue={proof.member}
                      
                    />
                </Form.Group>

                <Form.Group  controlId="Location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type='text'
                        name='Location'
                        defaultValue={proof.location}
                        maxLength={200}

                    />
                </Form.Group>

                <Form.Group  controlId="dateCreated">
                    <Form.Label>Date Created</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateCreated'
                        defaultValue={proof.datecreated}
                    />
                </Form.Group>

                <Form.Group  controlId="activityID">
                    <Form.Label>ActivityID</Form.Label>
                    <Form.Control
                        type='text'
                        name='activity'
                        defaultValue={proof.activity}
                    />
                </Form.Group>

                <Row>
                    <Col>
                    <Link className="btn btn-danger gumb" to={RoutesNames.PROOFS_READ}>
                        CANCEL
                    </Link>
                    </Col>
                    <Col>
                    <Button varian='primary' className="gumb" type='submit'>
                            UPDATE PROOF
                    </Button>
                    </Col>
                </Row>


            </Form>
        </Container>
    );

}

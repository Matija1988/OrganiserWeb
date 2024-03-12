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

        await ProofsService.getById(routeParams.id)
            .then((response) => {
                console.log(response);
                setProof(response.data);
            })
            .catch((err) => alert(err.message));
    }

    useEffect(() => {
        fetchProof();
    }, []);

    async function changeProof(proof) {

        const reply = await ProofsService.updateProof(routeParams.id, proof);

        if (reply.ok) {
            navigate(RoutesNames.PROOFS_READ);
        } else {
            alert(reply.message);
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        changeProof({
            documentName: information.get('documentName'),
            memberID: information.get('memberID'),
            Location: information.get('Location'),
            dateCreated: information.get('dateCreated'),
            activityID: information.get('activityID')
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>

                <Form.Group controlId="deocumentName">
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
                        name='memberID'
                        defaultValue={proof.memberID}
                      
                    />
                </Form.Group>

                <Form.Group  controlId="Location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type='text'
                        name='Location'
                        defaultValue={proof.Location}
                        maxLength={200}

                    />
                </Form.Group>

                <Form.Group  controlId="dateCreated">
                    <Form.Label>Date Created</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateCreated'
                        defaultValue={proof.dateCreated}
                    />
                </Form.Group>

                <Form.Group  controlId="activityID">
                    <Form.Label>ActivityID</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityID'
                        defaultValue={proof.activityID}
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

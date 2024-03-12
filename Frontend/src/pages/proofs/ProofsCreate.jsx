import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import ProofsService from '../../services/ProofsService';
import { RoutesNames } from '../../constants';


import './proofsStyle.css';


export default function ProofsCreate() {

    const navigate = useNavigate();

    async function addProof(Proof) {

        const reply = await ProofsService.createProof(Proof);
        if (reply.ok) {
            navigate(RoutesNames.PROOFS_READ);
        } else {
            alert(reply.message.errors);
        }

    }

    function handleSubmit(e) {
        e.preventDefault();

        const information = new FormData(e.target);

        const proof = {
            documentName: information.get('documentName'),
            memberID: information.get('memberID'),
            Location: information.get('Location'),
            dateCreated: information.get('dateCreated'),
            activityID: information.get('activityID')
        };

        addProof(proof);

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group  controlId='documentName'>
                    <Form.Label>Document Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='documentName'
                        placeholder='Document Name'
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId='memberID'>
                    <Form.Label>Member</Form.Label>
                    <Form.Control
                        type='text'
                        name='memberID'
                        placeholder='Member'
                        
                    />

                </Form.Group>

                <Form.Group  controlId='Location'>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type='text'
                        name='Location'
                        placeholder='Location'
                        maxLength={200}
                        
                    />

                </Form.Group>

                <Form.Group  controlId='dateCreated'>
                    <Form.Label>Date created</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateCreated'
                        placeholder='Date created'
                        
                    />

                </Form.Group>

                <Form.Group  controlId='activityID'>
                    <Form.Label>Activity</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityID'
                        placeholder='Associated activity'
                        
                    />

                </Form.Group>

                <Row>
                    <Col>
                        <Link className='btn btn-danger gumb' to={RoutesNames.PROOFS_READ}>
                            CANCEL
                        </Link>
                    </Col>

                    <Col>
                        <Button variant='primary' className='gumb' type='submit'>
                            ADD PROOF
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    );

}
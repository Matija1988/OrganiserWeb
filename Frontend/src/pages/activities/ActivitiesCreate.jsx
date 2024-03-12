import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import ActivitiesService from '../../services/ActivitiesService';
import { RoutesNames } from '../../constants';

import './activitiesStyle.css';


export default function ActivitiesCreate() {

    const navigate = useNavigate();

    async function addActivity(Activity) {

        const reply = await ActivitiesService.createActivity(Activity);
        if (reply.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
        } else {
            alert(reply.message.errors);
        }

    }

    function handleSubmit(e) {
        e.preventDefault();

        const information = new FormData(e.target);

        const activity = {
            activityName: information.get('activityName'),
            description: information.get('description'),
            dateStart: information.get('dateStart'),
            dateFinish: information.get('dateFinish'),
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateAccepted: information.get('dateAccepted'),
            projectID: information.get('projectID')
        };

        addActivity(activity);

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group  controlId='activityName'>
                    <Form.Label>Activity</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityName'
                        placeholder='Activity'
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type='text'
                        name='description'
                        placeholder='description'
                        maxLength={500}
                        
                    />

                </Form.Group>

                <Form.Group  controlId='dateStart'>
                    <Form.Label>Date start</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateStart'
                        placeholder='dateStart'
                        
                        required
                    />

                </Form.Group>

                <Form.Group  controlId='dateFinish'>
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateFinish'
                        placeholder='dateFinish'
                        required
                    />

                </Form.Group>

                <Form.Group  controlId="isFinished">
                    <Form.Check
                        label="Status"
                        inline
                        name='isFinished'
                    />

                </Form.Group>
                <Form.Group  controlId='dateAccepted'>
                    <Form.Label>Date Accepted</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateAccepted'
                        placeholder='dateAccepted'
                        required
                    />

                </Form.Group>

                <Form.Group  controlId='projectID'>
                    <Form.Label>Associeted project</Form.Label>
                    <Form.Control
                        type='text'
                        name='projectID'
                        placeholder='projectID'
                        required
                    />

                </Form.Group>

                <Row>
                    <Col>
                        <Link className='btn btn-danger gumb' to={RoutesNames.ACTIVITIES_READ}>
                            CANCEL
                        </Link>
                    </Col>

                    <Col>
                        <Button variant='primary' className='gumb' type='submit'>
                            ADD ACTIVITY
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    );

}
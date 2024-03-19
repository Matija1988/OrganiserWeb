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
            activityname: information.get('activityname'),
            description: information.get('description'),
            datestart: information.get('datestart'),
            datefinished: information.get('datefinished'),
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateaccepted: information.get('dateaccepted'),
            project: 1
       
        };

        addActivity(activity);

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group  controlId='activityname'>
                    <Form.Label>Activity</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityname'
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

                <Form.Group  controlId='datestart'>
                    <Form.Label>Date start</Form.Label>
                    <Form.Control
                        type='date'
                        name='datestart'
                        placeholder='dateStart'
                        
                        required
                    />

                </Form.Group>

                <Form.Group  controlId='datefinished'>
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='date'
                        name='datefinished'
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
                <Form.Group  controlId='dateaccepted'>
                    <Form.Label>Date Accepted</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateaccepted'
                        placeholder='dateAccepted'
                        required
                    />

                </Form.Group>

                <Form.Group  controlId='project'>
                    <Form.Label>Associated project</Form.Label>
                    <Form.Control
                        type='text'
                        name='project'
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
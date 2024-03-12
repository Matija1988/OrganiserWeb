import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { RoutesNames } from "../../constants";

import './activitiesStyle.css';


export default function ActivitiesUpdate() {

    const [activity, setActivity] = useState({});

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchActivities() {

        await ActivitiesService.getById(routeParams.id)
            .then((response) => {
                console.log(response);
                setActivity(response.data);
            })
            .catch((err) => alert(err.message));
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    async function UpdateActivity(activity) {

        const reply = await ActivitiesService.updateActivity(routeParams.id, activity);

        if (reply.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
        } else {
            alert(reply.message);
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        UpdateActivity({
            activityName: information.get('activityName'),
            description: information.get('description'),
            dateStart: information.get('dateStart'),
            dateFinish: information.get('dateFinish'),
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateAccepted: information.get('dateAccepted'),
            projectID: information.get('projectID')
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group controlId="activityName">
                    <Form.Label>Activity</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityName'
                        defaultValue={activity.activityName}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type='text'
                        name='description'
                        defaultValue={activity.description}
                        maxLength={500}
                        
                    />
                </Form.Group>

                <Form.Group  controlId="dateStart">
                    <Form.Label>Date start</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateStart'
                        defaultValue={activity.dateStart}
                        
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="dateFinish">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateFinish'
                        defaultValue={activity.dateFinish}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="isFinished">
                    <Form.Label>Status</Form.Label>
                    <Form.Check 
                      label = "Is finished?"
                      defaultValue =  {activity.isFinished}
                      name ="isFinished"                   
                    
                    />
                </Form.Group>

                <Form.Group  controlId="dateAccepted">
                    <Form.Label>Date accepted</Form.Label>
                    <Form.Control
                        type='text'
                        name='dateAccepted'
                        defaultValue={activity.dateAccepted}
                        required
                    />
                </Form.Group>

                
                <Form.Group  controlId="projectID">
                    <Form.Label>Associated project</Form.Label>
                    <Form.Control
                        type='text'
                        name='projectID'
                        defaultValue={activity.projectID}
                        required
                    />
                </Form.Group>

                <Row>
                    <Col>
                    <Link className="btn btn-danger gumb" to={RoutesNames.ACTIVITIES_READ}>
                        CANCEL
                    </Link>
                    </Col>
                    <Col>
                    <Button varian='primary' className="gumb" type='submit'>
                            UPDATE ACTIVITY
                    </Button>
                    </Col>
                </Row>


            </Form>
        </Container>
    );

}

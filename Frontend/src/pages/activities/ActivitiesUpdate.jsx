import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { RoutesNames } from "../../constants";

import moment from "moment";

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
            activityname: information.get('activityname'),
            description: information.get('description'),
            datestart: information.get('datestart'),
            datefinish: information.get('datefinish'),
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateaccepted: information.get('dateaccepted'),
            project: information.get('project')
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group controlId="activityname">
                    <Form.Label>Activity</Form.Label>
                    <Form.Control
                        type='text'
                        name='activityname'
                        defaultValue={activity.activityname}
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

                <Form.Group  controlId="datestart">
                    <Form.Label>Date start</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateStart'
                        defaultValue={activity.datestart}
                        
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="datefinished">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='date'
                        name='datefinished'
                        defaultValue={activity.datefinished}
                        required
                    />
                </Form.Group>

                <Form.Group  controlId="isFinished">
                    <Form.Label>Status</Form.Label>
                    <Form.Check 
                      label = "Is finished?"
                    //defaultValue =  {activity.isFinished}
                      name ="isFinished"                   
                    
                    />
                </Form.Group>

                <Form.Group  controlId="dateaccepted">
                    <Form.Label>Date accepted</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateaccepted'
                        defaultValue={activity.dateaccepted}
                        required
                    />
                </Form.Group>

                
                <Form.Group  controlId="project">
                    <Form.Label>Associated project</Form.Label>
                    <Form.Control
                        type='text'
                        name='project'
                        defaultValue={activity.project}
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

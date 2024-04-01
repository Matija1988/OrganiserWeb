import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import { RoutesNames } from "../../constants";

import ActivitiesService from "../../services/ActivitiesService";
import ProjectService from "../../services/ProjectService";
import { getAlertMessages } from "../../services/httpService";

import moment from "moment";

import './activitiesStyle.css';


export default function ActivitiesUpdate() {

    const [activity, setActivity] = useState({});

    const [project, setProject] = useState([]);
    const [projectID, setProjectID] = useState(0);

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchActivities() {
            const response = await ActivitiesService.getById(routeParams.id);
            if(!response.ok) {
                alert(getAlertMessages(response.data));
                return;
            }
            let activity = response.data;
            activity.startTime = moment.utc(activity.dateStart).format('HH:mm');
            activity.startingDate = moment.utc(activity.dateStart).format('yyyy-MM-DD');
            activity.deadlineTime = moment.utc(activity.dateFinished).format('HH:mm');
            activity.deadlineDate = moment.utc(activity.dateFinished).format('yyyy-MM-DD');
            activity.acceptanceTime = moment.utc(activity.dateAccepted).format('HH:mm');
            activity.acceptanceDate = moment.utc(activity.dateAccepted).format('yyyy-MM-DD');
            delete activity.dateStart;
            delete activity.dateFinished;
            delete activity.dateAccepted;
            setActivity(activity);
            setProjectID(activity.projectID);
            
    }

    async function fetchProject() {
        const response = await ProjectService.getProjects();
        if(!response.ok){
            alert(getAlertMessages(response.data));
            return;
        }
        setProject(response.data);
        setProjectID(response.data[0].id);
    }

    async function load() {
        await fetchActivities();
        await fetchProject();
    }

    useEffect(()=>{load();},[]);


    async function UpdateActivity(activity) {

        const reply = await ActivitiesService.updateActivity(routeParams.id, activity);

        if (reply.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
            return;
            
        } else {
            alert(reply.message);
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        const startingDate = moment.utc(information.get('dateStart') + ' ' + information.get('startTime'));
        const deadlineDate = moment.utc(information.get('datefinished') + ' ' + information.get('deadlineTime'));
        const acceptanceDate = moment.utc(information.get('dateaccepted') + ' ' + information.get('acceptanceTime'));

        UpdateActivity({
            activityName: information.get('activityName'),
            activityDescription: information.get('description'),
            dateStart: startingDate,
            dateFinish: deadlineDate,
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateAccepted: acceptanceDate,
            Project: parseInt(projectID)
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
                        defaultValue={activity.activityDescription}
                        maxLength={500}
                        
                    />
                </Form.Group>
                <Row>
                    <Col key='1'>
                    <Form.Group controlId="dateStart">
                        <Form.Label>Date start</Form.Label>
                        <Form.Control
                            type='date'
                            name='dateStart'
                            defaultValue={activity.startingDate}
                            required
                        />
                    </Form.Group>
                    </Col>
                    <Col key='2'>
                        <Form.Group>
                            <Form.Label>Start time</Form.Label>
                            <Form.Control
                            type="time"
                            name='startTime'
                            defaultValue={activity.startTime}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                    <Form.Group controlId="datefinished">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type='date'
                            name='datefinished'
                            defaultValue={activity.deadlineDate}
                            required
                        />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                            <Form.Label>Deadline time</Form.Label>
                            <Form.Control
                            type="time"
                            name='deadlineTime'
                            defaultValue={activity.deadlineTime}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group  controlId="isFinished">
                    <Form.Label>Status</Form.Label>
                    <Form.Check 
                      label = "Is finished?"
                    //defaultValue =  {activity.isFinished}
                      name ="isFinished"                   
                    
                    />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="dateaccepted">
                            <Form.Label>Date accepted</Form.Label>
                            <Form.Control
                                type='date'
                                name='dateaccepted'
                                defaultValue={activity.acceptanceDate}
                                
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                            <Form.Label>Acceptance time</Form.Label>
                            <Form.Control
                            type="time"
                            name='acceptanceTime'
                            defaultValue={activity.acceptanceTime}
                            />
                        </Form.Group>
                    </Col>
                </Row>           
                <Form.Group  controlId='project'>
                        <Form.Label>Associated project</Form.Label>
                        <Form.Select
                            onChange = {(e) => {setProjectID(e.target.value)}}
                        >
                        {project && project.map((e, index) =>(
                            <option key ={index} value={e.id}>{e.projectName}</option>
                        ))}
                        </Form.Select>
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

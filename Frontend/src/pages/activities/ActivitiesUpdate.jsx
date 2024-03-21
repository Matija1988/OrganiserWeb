import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { RoutesNames } from "../../constants";

import moment from "moment";

import './activitiesStyle.css';


export default function ActivitiesUpdate() {

    const [activity, setActivity] = useState({});

    const [project, setProject] = useState([]);
    const [projectID, setProjectID] = useState(0);

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

    async function fetchProject() {
        await ProjectService.getProjects().then
            ((response) => {
            setProject(response.data);
            setProjectID(response.data[0].projectID);
        });
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
        } else {
            alert(reply.message);
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        if(information.get('datestart') == '' && information.get('timestart')!='') {
            alert('User must set date AND time values for start date and start time');
            return;
        } 
        let datestarted = '';

        if(information.get('datestart') != '' && information.get('timestart') =='') {
            datestarted = information.get('datestart') + 'T00:00:00.000Z'; 
        } else {
            datestarted = information.get('datestart') + 'T' + information.get('timestart') + '00.000Z';
        }

        if(information.get('datefinished') == '' && information.get('deadlinetime')!='') {
            alert('User must set date AND time values for deadline and deadline time');
            return;
        } 
        let dateend = '';

        if(information.get('datefinished') != '' && information.get('deadlinetime') =='') {
            dateend = information.get('datefinished') + 'T00:00:00.000Z'; 
        } else {
            dateend = information.get('datefinished') + 'T' + information.get('deadlinetime') + '00.000Z';
        }
        
        let dateaccept = '';

        if(information.get('dateaccepted') == null || information.get('dateaccepted')=='') {
            
            dateaccept = null;
        } else {
            dateaccept = information.get('dateaccepted') + 'T00:00:00.000Z';
        }

        UpdateActivity({
            activityname: information.get('activityname'),
            description: information.get('description'),
            datestart: datestarted,
            datefinish: dateend,
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateaccepted: dateaccept,
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

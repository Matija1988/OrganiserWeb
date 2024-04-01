import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { RoutesNames } from '../../constants';
import { useEffect, useState } from 'react';
import moment from 'moment';

import ProjectService from '../../services/ProjectService';
import ActivitiesService from '../../services/ActivitiesService';
import { getAlertMessages } from '../../services/httpService';

import './activitiesStyle.css';

export default function ActivitiesCreate() {

    const navigate = useNavigate();

    const [project, setProject] = useState([]);
    const [projectID, setProjectID] = useState(0);

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
        await fetchProject();
    }

    useEffect(()=>{load();},[]);

    async function addActivity(e) {
        const response = await ActivitiesService.create(e);
        if(response.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
            return;
        }
        alert(getAlertMessages(response.data));
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

        addActivity({
            activityName: information.get('activityName'),
            activityDescription: information.get('description'),
            dateStart:  datestarted,   
            dateFinished: dateend,
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateAccepted: dateaccept,
            project: parseInt(projectID)
       
        });

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
                <Row>
                    <Col>
                        <Form.Group controlId='datestart'>
                            <Form.Label>Date start</Form.Label>
                            <Form.Control
                                type='date'
                                name='datestart'
                                placeholder='dateStart'
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='time'>
                            <Form.Label>Time</Form.Label>
                            <Form.Control type='time' name='timestart' />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group controlId='datefinished'>
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type='date'
                                name='datefinished'
                                placeholder='dateFinish'
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='time'>
                            <Form.Label>Deadline time</Form.Label>
                            <Form.Control type='time' name='deadlinetime' />
                        </Form.Group>
                    </Col>
                </Row>
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
                        
                    />

                </Form.Group>


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
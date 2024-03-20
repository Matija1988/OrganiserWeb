import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import ActivitiesService from '../../services/ActivitiesService';
import { RoutesNames } from '../../constants';

import './activitiesStyle.css';
import { useEffect, useState } from 'react';
import ProjectService from '../../services/ProjectService';
import momemnt from 'moment';

export default function ActivitiesCreate() {

    const navigate = useNavigate();

    const [project, setProject] = useState([]);
    const [projectID, setProjectID] = useState(0);

    async function fetchProject() {
        await ProjectService.getProjects().then
            ((response) => {
            setProject(response.data);
            setProjectID(response.data[0].projectID);
        });
    }

    async function load() {
        await fetchProject();
    }

    useEffect(()=>{load();},[]);

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

        if(information.get('datestart') == '' && information.get('timestart')!='') {
            alert('User must set date AND time values for start date and start time');
            return;
        } 
        let datestart = '';

        if(information.get('datestart') != '' && information.get('timestart') =='') {
            datestart = information.get('datestart') + 'T00:00:00.000Z'; 
        } else {
            datestart = information.get('datestart') + 'T' + information.get('timestart') + '00.000Z';
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

        if(information.get('dateaccepted').trim === '') {
            dateaccept = null;
        } else {
            dateaccept = information.get('datefinished') + 'T00:00:00.000Z';
        }

        const activity = {
            activityname: information.get('activityname'),
            description: information.get('description'),
            datestart:  datestart,   
            datefinished: dateend,
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateaccepted: dateaccept,
            project: parseInt(projectID)
       
        };

        console.log(activity);

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
                <Form.Group controlId='time'> 
                <Form.Label>Time</Form.Label>
                <Form.Control type='time' name='timestart'/>   
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

                <Form.Group controlId='time'> 
                <Form.Label>Deadline time</Form.Label>
                <Form.Control type='time' name='deadlinetime'/>   
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
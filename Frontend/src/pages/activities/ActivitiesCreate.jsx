import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { RoutesNames } from '../../constants';
import { useEffect, useState } from 'react';
import moment from 'moment';

import ProjectService from '../../services/ProjectService';
import ActivitiesService from '../../services/ActivitiesService';
import { getAlertMessages } from '../../services/httpService';

import './activitiesStyle.css';
import NavBar from '../../components/NavBar';
import useError from '../../hooks/useError';
import useLoading from '../../hooks/useLoading';
import InputText from '../../components/InputText';
import InputCheckbox from '../../components/InputCheckbox';
import Actions from '../../components/Actions';
import InputTextAsTextArea from '../../components/InputTextAsTextArea';

export default function ActivitiesCreate() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [projectIDinput, setProjectIDinput] = useState(0);

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    async function fetchProject() {
        const response = await ProjectService.read('Project');
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setProjects(response.data);
        setProjectIDinput(response.data[0].id);
    }

    
    async function load() {
        showLoading();
        await fetchProject();
        hideLoading();
    }

    useEffect(() => { load(); }, []);

    async function addActivity(e) {
        showLoading();
        const response = await ActivitiesService.create('Activity', e);
        if (response.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
            hideLoading();
            return;
        }
        hideLoading();
        showError(response.data);
        
    }

    function handleSubmit(e) {
        e.preventDefault();


        const information = new FormData(e.target);

        if (information.get('datestart') == '' && information.get('timestart') != '') {
            alert('User must set date AND time values for start date and start time');
            return;
        }
        let datestarted = '';

        if (information.get('datestart') != '' && information.get('timestart') == '') {
            datestarted = information.get('datestart') + 'T00:00:00.000Z';
        } else {
            datestarted = information.get('datestart') + 'T' + information.get('timestart') + ':00.000Z';
        }

        if (information.get('datefinish') == '' && information.get('deadlinetime') != '') {
            alert('User must set date AND time values for deadline and deadline time');
            return;
        }
        let dateend = '';

        if (information.get('datefinish') != '' && information.get('deadlinetime') == '') {
            dateend = information.get('datefinish') + 'T00:00:00.000Z';
        } else {
            dateend = information.get('datefinish') + 'T' + information.get('deadlinetime') + ':00.000Z';
        }

        let dateaccept = '';

        if (information.get('dateaccepted') == null || information.get('dateaccepted') == '') {

            dateaccept = null;
        } else {
            dateaccept = information.get('dateaccepted') + 'T00:00:00.000Z';
        }

        if(datestarted > dateend) {
            alert("Activity cannot start after it ends!!! Check your input!!!");
            return;
        }

        if(dateaccept < datestarted) {
            alert("Activity cannot be accepted before it starts!!! Check your input!!!");
            return;
        }

        var today = new Date();
 
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // var yyyy = today.getFullYear();

        // today = dd + '/' + mm + '/' + yyyy;
       

        let checkFinished = new Boolean(information.get('Is finished') =='on' ? true : false); 

        if((today < datestarted) && (checkFinished == true)) {
            alert("Activity cannot end before it begins!!! Check your input!!!");
            checkFinished = false;
            return;
        }

        if(today > dateend) {
            alert("Current date is past deadline. Is finished property has been set to TRUE (Finished) automatically!" + 
            "\n If activity is not finished update the deadline and reset the affected property!");
            checkFinished = true;
        }

        const name = information.get('Activity name');
        
        if(name == "") {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nActivity name" 
            + "\nDate start \nDeadline \nAssociated project \nare mandatory inputs!!!");
            return;
        }

        addActivity({
            activityName: name,
            description: information.get('Description'),
            dateStart: datestarted,
            dateFinish: dateend,
            isFinished: checkFinished,
            dateAccepted: dateaccept,
            projectID: parseInt(projectIDinput)

        });

    }

    return (
        <>
        <NavBar />
            <Container>
                <Form onSubmit={handleSubmit} className='FormActivity'>
                    <InputText atribute='Activity name' value=''/>
                    <InputTextAsTextArea atribute='Description' value=''/>
                    
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
                            <Form.Group controlId='datefinish'>
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='datefinish'
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

                    <InputCheckbox atribute='Is finished' value={false}/>

                    <Form.Group controlId='dateaccepted'>
                        <Form.Label>Date Accepted</Form.Label>
                        <Form.Control
                            type='date'
                            name='dateaccepted'
                            placeholder='dateAccepted'

                        />

                    </Form.Group>


                    <Form.Group controlId='project'>
                        <Form.Label>Associated project</Form.Label>
                        <Form.Select
                            value={projects.id}
                            onChange={(e) => { setProjectIDinput(e.target.value) }}
                        >
                            {projects && projects.map((e, index) => (
                                <option key={index} value={e.id}>{e.projectName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Actions cancel={RoutesNames.ACTIVITIES_READ} action="ADD ACTIVITY"/>            
                    
                </Form>
            </Container>
        </>
    );

}
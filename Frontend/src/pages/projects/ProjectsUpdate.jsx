import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, Route, useLocation } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import moment from 'moment';

import ProjectService from "../../services/ProjectService";
import './projectsStyle.css';
import { getAlertMessages } from "../../services/httpService";
import InputText from "../../components/InputText";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import DateAndTime from "../../components/DateAndTime";
import NavBar from "../../components/NavBar";
import InputCheckbox from "../../components/InputCheckbox";
import Actions from "../../components/Actions";
import { IoMdReturnLeft } from "react-icons/io";


export default function ProjectsUpdate() {

    const location = useLocation();
    const navigate = useNavigate();
    const routeParams = useParams();
    const [project, setProject] = useState({});
    const { showError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function fetchProject() {
        showLoading();
        const response = await ProjectService.getByID('Project', routeParams.id);
        if (!response.ok) {
            showError(response.data);
            navigate(RoutesNames.PROJECTS_READ);
            hideLoading();
            return;
        }
        let project = response.data;
        project.timeStart = moment.utc(project.dateStart).format('HH:mm');
        project.date = moment.utc(project.dateStart).format('yyyy-MM-DD');
        project.deadlineTime = moment.utc(project.dateEnd).format('HH:mm');
        project.deadlineDate = moment.utc(project.dateEnd).format('yyyy-MM-DD');
        delete project.dateStart;
        delete project.dateEnd;
        setProject(response.data);
        hideLoading();
    }

    useEffect(() => {
        fetchProject();
    }, []);

    async function updateProject(project) {
        showLoading();
        const response = await ProjectService.update('Project', routeParams.id, project);
        if (response.ok) {
            navigate(RoutesNames.PROJECTS_READ);
            hideLoading();
            return;
        }
        showError(response.data);
        hideLoading();
    }



    function handleSubmit(e) {
        e.preventDefault();
        const information = new FormData(e.target);

        const startingDate = moment.utc(information.get('date') + ' ' + information.get('timeStart'));
        const deadlineDate = moment.utc(information.get('dateEnd') + ' ' + information.get('deadlineTime'));
        var today = new Date();
        let checkFinished = new Boolean(information.get('isFinished') =='on' ? true : false); 

        if(startingDate > deadlineDate) {
            alert("Project cannot start after it ends!!! Check your input!!!");
            return;
        }

        if (today > deadlineDate) {
            alert("Current date is past deadline. Is finished property will be set to TRUE (Finished) automatically!" +
                "\nIf project is not finished update the deadline and reset the affected property!");
            checkFinished = true;
        }
        
        const name = information.get('Project name');
        const uID = information.get('UniqueID');

        if(name.length > 100) {
            alert("Maximum allowed characters for Project name is: 100");
            return;
        }

        if(uID.length > 50) {
            alert("Maximum allowed characters for Project name is: 50");
            return;
        }

        if(name == "" || uID == "") {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nProject name \nUnique ID \nare mandatory inputs!!!");  
        }

        updateProject({
            projectName: name,
            uniqueID: uID,
            dateStart: startingDate,
            dateEnd: deadlineDate,
            isFinished: checkFinished
        });
        hideLoading();

    }

    return (
        <>
        <NavBar />
            <Container>
                <Form onSubmit={handleSubmit} className="FormProjectCreate">
                    <InputText atribute='Project name' value={project.projectName} />
                    <InputText atribute="UniqueID" value={project.uniqueID} />
                    <Row>
                        <Col>
                            <Form.Group controlId="dateStart">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='date'
                                    defaultValue={project.date}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Start time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name='timeStart'
                                    defaultValue={project.timeStart}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="dateEnd">
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateEnd'
                                    defaultValue={project.deadlineDate}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Deadline time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name='deadlineTime'
                                    defaultValue={project.deadlineTime}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <InputCheckbox atribute="isFinished" value={project.isFinished}/>
                    <Actions cancel={RoutesNames.PROJECTS_READ} action="UPDATE PROJECT" />
                </Form>
            </Container>
        </>
    );

}
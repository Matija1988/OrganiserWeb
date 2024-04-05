import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, Route } from 'react-router-dom';
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


export default function ProjectsUpdate() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const [project, setProject] = useState({});
    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    async function fetchProject() {
        showLoading();
        const response = await ProjectService.getByID('Project',routeParams.id);
        if(!response.ok) {
            showError(response.data);
            navigate(RoutesNames.PROJECTS_READ);
            return;
        }
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

        const project = {
            projectName: information.get('projectName'),
            uniqueID: information.get('uniqueID'),
            dateStart: startingDate,
            dateEnd: deadlineDate,
            isFinished: information.get('isFinished')=='on' ? true : false
        };
        updateProject(project);

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className= "FormProjectCreate">
                <InputText atribute= 'projectName' value={project.projectName}/>
                <InputText atribute="uniqueID" value={project.uniqueID} />
                
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
                <Form.Group controlId="isFinished">
                    <Form.Check 
                      label = "Status"
                 
                      name ="isFinished"                   
                    
                    />
                </Form.Group>

                <Row className="actions">
                    <Col>
                        <Link className="btn btn-danger"
                            to={RoutesNames.PROJECTS_READ}> CANCEL</Link>
                    </Col>

                    <Col>
                        <Button
                        className="editBtn"
                            variant='primary'
                            type='submit'
                        > UPDATE PROJECT</Button>
                    </Col>

                </Row>
            </Form>
        </Container>
    );

}
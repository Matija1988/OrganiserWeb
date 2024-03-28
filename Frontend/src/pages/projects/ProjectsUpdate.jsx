import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ProjectService from "../../services/ProjectService";
import { RoutesNames } from "../../constants";
import { MdOutlineSettingsApplications } from "react-icons/md";
import moment from 'moment';


import './projectsStyle.css';
import { getAlertMessages } from "../../services/httpService";

export default function ProjectsUpdate() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const [project, setProject] = useState({});

    async function fetchProject() {

        const response = await ProjectService.getById(routeParams.id);
        if(!response.ok) {
            alert(getAlertMessages(response.data));
            return;
        }
        project.timeStart = moment.utc(project.dateStart).format('HH:mm');
        project.date = moment.utc(project.dateStart).format('yyyy-MM-DD');
        project.deadlineTime = moment.utc(project.dateEnd).format('HH:mm');
        project.deadlineDate = moment.utc(project.dateEnd).format('yyyy-MM-DD');
        delete project.dateStart;
        delete project.dateEnd;
        setProject(response.data);
    }

    useEffect(() => {
        fetchProject();
    }, []);

    async function updateProject(project) {

        const response = await ProjectService.changeProject(routeParams.id, project);
        if (response.ok) {
            navigate(RoutesNames.PROJECTS_READ);
            return;
        } 
        alert(getAlertMessages(response.data));
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

                <Form.Group controlId="projectName">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='projectName'
                        defaultValue={project.projectName}
                    />
                </Form.Group>


                <Form.Group controlId="uniqueID">
                    <Form.Label>Unique ID</Form.Label>
                    <Form.Control
                        type='text'
                        name='uniqueID'
                        defaultValue={project.uniqueID}
                    />
                </Form.Group>
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
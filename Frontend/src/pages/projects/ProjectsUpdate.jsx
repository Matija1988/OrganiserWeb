import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ProjectService from "../../services/ProjectService";
import { RoutesNames } from "../../constants";
import { MdOutlineSettingsApplications } from "react-icons/md";

import './projectsStyle.css';

export default function ProjectsUpdate() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const [project, setProject] = useState({});

    async function fetchProject() {

        await ProjectService.getById(routeParams.id)
            .then((res) => {
                setProject(res.data)
            }).catch((e) => {
                alert(e.message);
            });
    }

    useEffect(() => {
        fetchProject();
    }, []);

    async function updateProject(project) {

        const reply = await ProjectService.changeProject(routeParams.id, project);
        if (reply.ok) {
            navigate(RoutesNames.PROJECTS_READ);
        } else {
            console.log(reply);
            alert(reply.message);
        }

    }



    function handleSubmit(e) {
        e.preventDefault();
        const information = new FormData(e.target);

        const project = {
            projectName: information.get('projectName'),
            uniqueID: information.get('uniqueID'),
            dateStart: information.get('dateStart'),
            dateEnd: information.get('dateEnd'),
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

                <Form.Group controlId="dateStart">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateStart'
                        defaultValue={project.dateStart}
                    />
                </Form.Group>

                <Form.Group controlId="dateEnd">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateEnd'
                        defaultValue={project.dateEnd}
                    />
                </Form.Group>

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
                            variant='primary'
                            type='submit'
                        > UPDATE PROJECT</Button>
                    </Col>

                </Row>
            </Form>
        </Container>
    );

}
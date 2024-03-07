import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { Link, Route, useNavigate } from "react-router-dom";
import ProjectService from '../../services/ProjectService';
import "bootstrap/dist/css/bootstrap.min.css";
import './projectsStyle.css';


export default function projectCreate() {

    const navigate = useNavigate();

    async function createProject(project) {

        const reply = await ProjectService.createProject(project)
        if(reply.ok) {
            navigate(RoutesNames.PROJECTS_READ);
        } else {
            console.log(reply);
            alert(reply.message);
        }
    }

    function handleSubmit() {
        e.preventDefault();

        const information = new FormData(e.target);

        const project = {
            projectName: information.get('projectName'),
            uniqueID: information.get('uniqueID'),
            dateStart: information.get('dateStart'),
            dateEnd: information.get('dateEnd'),
            isFinished: information.get('isFinished') == 'on' ? true : false
        };

        projectCreate();           

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className="FormProjectCreate">
                <Form.Group controlId ='projectName'>
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control 
                    type = 'text'
                    name = 'projectName'
                    
                    />
                </Form.Group>
                <Form.Group controlId="uniqueID">
                    <Form.Label>Unique ID</Form.Label>
                    <Form.Control 
                    type = 'text'
                    name = 'uniqueID'
                    />
                </Form.Group>
                <Form.Group controlId="dateStart">
                <Form.Label>Starting date</Form.Label>
                <Form.Control 
                type = 'text'
                name = 'dateStart'
                />
                </Form.Group>
                <Form.Group controlId="dateEnd">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control 
                    type = 'text'
                    name = 'dateEnd'
                    />
                </Form.Group>
                <Form.Group controlId="isFinished">
                    <Form.Check 
                    label = "Status"
                    inline
                    name='isFinished'
                    />

                </Form.Group>
                <Row className="actions">
                    <Col>
                    <Link className='btn btn-danger'
                    to={RoutesNames.PROJECTS_READ}> CANCEL</Link>
                    </Col>
                    <Col>
                    <Button   variant='primary'
                    type="submit"
                    className="addBtn"
                    > ADD PROJECT</Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    );

}
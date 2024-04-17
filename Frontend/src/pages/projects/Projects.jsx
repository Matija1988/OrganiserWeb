import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Table, InputGroup, Row, Col } from "react-bootstrap";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaSkull, FaTrash, FaWrench } from 'react-icons/fa';
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from 'react-bootstrap/Form';
import moment from 'moment';

import ProjectService from "../../services/ProjectService";
import { RoutesNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import { getAlertMessages, httpService } from "../../services/httpService";

import "bootstrap/dist/css/bootstrap.min.css";

import './projectsStyle.css';
import NavBar from "../../components/NavBar";
import DeleteModal from "../../components/DeleteModal";


export default function Projects() {

    const [projects, setProjects] = useState();

    const [filter, setFilter] = useState();

    const [search, setSearch] = useState("");
    const { showError } = useError();
    const { showLoading, hideLoading } = useLoading();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entityID, setEntityID] = useState();

    const navigate = useNavigate();

    async function readProjects() {
        showLoading();
        const response = await ProjectService.read('Project');
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setProjects(response.data);
        hideLoading();
    }

    useEffect(() => {
        readProjects();
    }, []);



    function FormatDateStart(project) {
        return project.dateStart == null ? 'Not defined' :
            moment.utc(project.dateStart).format('DD.MM.YYYY.')
    }

    function FormatDateEnd(project) {
        return project.dateEnd == null ? 'Not defined' :
            moment.utc(project.dateEnd).format('DD.MM.YYYY.')

    }


    function progresLabel(project) {
        let date1 = new Date(project.dateStart);
        let date2 = new Date(project.dateEnd);
        let dateNow = Date.now();

        let differenceInTime = dateNow - date1.getTime();

        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

        if (date2 < dateNow) {
            differenceInDays = 100;
        }

        return differenceInDays;
    }



    function progresLabelMaxValue(project) {

        let date1 = new Date(project.dateStart);
        let date2 = new Date(project.dateEnd);
        let dateNow = Date.now();

        let differenceInTime = date2.getTime() - date1.getTime();

        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

        if (date2 < dateNow) {
            differenceInDays = 100;
        }

        return differenceInDays;

    }


    function IsFinishedDisplayColor(project) {
        if (project.isFinished == null) return 'gray';
        if (project.isFinished) return 'green';
        return 'yellow';
    }

    function IsFinishedDisplayText(project) {
        if (project.isFinished == null) return 'No input';
        if (project.isFinished) return 'Finished';
        return 'Ongoing';
    }

    async function projectDelete(id) {
        showLoading();
        const response = await ProjectService.remove('Project', id);
        
        if (response.ok) {
            readProjects();
        } else {
            showError(response.data);
        }
        hideLoading();
    }

    return (
        <>
            <NavBar />
            <Container className="mt-4">

                <Link to={RoutesNames.PROJECTS_CREATE} className="btn btn-success gumb">
                    <IoIosAdd
                        size={25}
                    />ADD
                </Link>

                <Form>
                    <Row>
                        <Col>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search project by name or unique id..."
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="searchLabel" />
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>

                <Table striped bordered hover responsive variant="dark" className="tableStyle" >
                    <thead>
                        <tr className="projectTableHead">
                            <th>Project Name</th>
                            <th>Unique ID</th>
                            <th>Start date / Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects && projects.filter((projects) => {
                            return search.toLowerCase() === '' ? projects : projects.projectName.toLowerCase().includes(search)
                                || search === '' ? projects : projects.uniqueID.includes(search);
                        }).map((project, index) => (
                            <tr key={index}>
                                <td>{project.projectName}</td>
                                <td className="alignRight">{project.uniqueID}</td>
                                <td >

                                    <p>
                                        {FormatDateStart(project)}
                                        /
                                        {FormatDateEnd(project)}

                                    </p>
                                    <ProgressBar
                                        //  label = {progresLabel(project)} 
                                        variant="danger"
                                        now={progresLabel(project)}
                                        max={progresLabelMaxValue(project)}
                                        title="Measures days from the start date"
                                    />

                                </td>
                                <td className="alignCenter"
                                    color={IsFinishedDisplayColor(project)}
                                >
                                    {IsFinishedDisplayText(project)}
                                </td>

                                <td className="alignCenter">
                                    <Row className="tableActionsRow1">
                                        <Col className="ml-0">
                                            <Button
                                                variant='outline-success'
                                                className="workBtn"
                                                title="Work on project"
                                                onClick={() => { navigate(`/listprojectactivities/${project.id}`) }}
                                            >
                                                <FaWrench
                                                    color="green"
                                                    size={15}
                                                >
                                                </FaWrench>
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button className="editBtn"
                                                variant="primary"
                                                label="Edit project"
                                                onClick={() => { navigate(`/projects/${project.id}`) }}>
                                                <FaEdit
                                                    size={15}
                                                />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button className="trashBtn"
                                                variant='danger'
                                                label="Delete project"
                                              //  onClick={() => projectDelete(project.id)}
                                            onClick={()=> (setEntityID(project.id), setShowDeleteModal(true))}
                                            >
                                                <FaTrash
                                                    size={15}
                                                />
                                            </Button>
                                       
                                        </Col>
                                        <Col>
                                            <Button className="killBtn"
                                                variant='danger'
                                                label="Delete project"
                                            onClick={() => navigate(`/killswitchproject/${project.id}`)}
                                            >
                                                <FaSkull
                                                    size={15}
                                                />
                                            </Button>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>

                        ))}
                    </tbody>

                </Table>
            </Container>
            <DeleteModal
            show={showDeleteModal}
            handleClose={()=>setShowDeleteModal(false)}
            handleDelete={()=> (projectDelete(entityID), setShowDeleteModal(false))}
            
            />

        </>
    );
x
}
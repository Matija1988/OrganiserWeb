import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectService from "../../services/ProjectService";
import { Container, Button, Table, Badge } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { GrValidate } from 'react-icons/gr';
import { FaEdit, FaTrash } from 'react-icons/fa';

import "bootstrap/dist/css/bootstrap.min.css";

 import './projectsStyle.css';



export default function Projects() {

    const [projects, setProjects] = useState();

    const navigate = useNavigate();

    async function readProjects() {

        await ProjectService.getProjects()
            .then((res) => {
                setProjects(res.data);
            })
            .catch((e) => {
                alert(e);
            });
    }

    useEffect(() => {
        readProjects();
    }, []);

    const formatDateStart = (project) => {
        const date = new Date(project.dateStart);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };

    function formatDateEnd (project) {
        const date = new Date(project.dateEnd);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };

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
        const reply = await ProjectService.deleteProject(id);
        if (reply.ok) {
            console.log(reply.message.data.response);
            readProjects();
        }
    }

    const rowEvent = {
     onClick: (row) => {
        console.log(e, row);
     }
    }

    return (

        <Container className="mt-4">
            <Link to={RoutesNames.PROJECTS_CREATE} className="btn btn-success gumb" hover>
                <IoIosAdd
                    size={25}
                />ADD
            </Link>
            
            <Table striped bordered hover responsive  variant="dark" className="tableStyle">
                <thead>
                    <tr className="projectTableHead">
                        <th>Project Name</th>
                        <th className="projectTableHeadAlignCenter">Unique ID</th>
                        <th>Date Start</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects && projects.map((project, index) => (
                        <tr key={index}>
                            <td>{project.projectName}</td>
                            <td className="alignRight">{project.uniqueID}</td>
                            <td >  {Text = formatDateStart(project.dateStart)}</td>
                            <td>   {Text = formatDateEnd(project.dateEnd)}</td>
                            <td className="alignCenter" color={IsFinishedDisplayColor(project)} >
                                {Text = IsFinishedDisplayText(project)}

                            </td>
                            
                            <td className="alignCenter">
                                <Button className="editBtn"
                                    variant="primary"
                                    onClick={() => { navigate(`/projects/${project.id}`) }}>
                                    <FaEdit
                                        size={20}
                                    />
                                </Button>

                                <Button className="trashBtn"
                                    variant='danger'
                                    onClick={()=> projectDelete(project.id)}
                                >
                                    <FaTrash
                                        size={20}
                                    />

                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>

            </Table>
        </Container>

    );

}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectService from "../../services/ProjectService";
import { Container, Button, Table, Badge } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { GrValidate } from 'react-icons/gr';
import { FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import ProgressBar from "react-bootstrap/ProgressBar";

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

   
   function FormatDateStart(project) {
    return  project.dateStart == null ? 'Not defined' :
    moment.utc(project.dateStart).format('DD.MM.YYYY.')
   }

   function FormatDateEnd(project){ 
    return  project.dateEnd == null ? 'Not defined' :
    moment.utc(project.dateEnd).format('DD.MM.YYYY.')

   }

   
   function progresLabel(project) {
    let date1 = new Date(project.dateStart);
    let date2 = new Date(project.dateEnd);
    let dateNow = Date.now();

    let differenceInTime =  dateNow - date1.getTime();

    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    if(date2 < dateNow) {
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

    if(date2 < dateNow) {
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

            <Table striped bordered hover responsive variant="dark" className="tableStyle">
                <thead>
                    <tr className="projectTableHead">
                        <th>Project Name</th>
                        <th className="projectTableHeadAlignCenter">Unique ID</th>
                        <th>Start date / Deadline</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects && projects.map((project, index) => (
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
                                max = {progresLabelMaxValue(project)}
                                title="Measures days from the start date"
                                />

                            </td>
                            <td className="alignCenter" color={IsFinishedDisplayColor(project)}>
                                {IsFinishedDisplayText(project)}

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
                                    onClick={() => projectDelete(project.id)}
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
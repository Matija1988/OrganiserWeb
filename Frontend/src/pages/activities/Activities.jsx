import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { Container, Button, Table } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';

import './activitiesStyle.css';
import { format } from "date-fns";


export default function Activities() {

    const [Activities, setActivities] = useState();
    let navigate = useNavigate();

    async function fetchActivities() {

        await ActivitiesService.getActivities()
            .then((res) => {
                setActivities(res.data)
            })
            .catch((e) => {
                alert(e);
            });
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    async function deleteActivities(id) {
        const reply = await ActivitiesService.deleteActivities(id)

        if (reply.ok) {
            fetchActivities();
        } else {
            alert(reply.message);
        }
    }

    
    function ActivityStatusDisplayText(activity) {
        if (activity.isFinished == null) return 'No input';
        if (activity.isFinished) return 'Finished';
        return 'Ongoing';
    }


    const formatDateStart = (activity) => {
        const date = new Date(activity.dateStart);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };

    const formatDateAccepted = (activity) => {
        const date = new Date(activity.dateAccepted);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };


    function formatDateEnd (activity) {
        const date = new Date(activity.dateFinish);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };


    return (

        <Container>
            <Link to={RoutesNames.ACTIVITIES_CREATE} className="btn btn-success gumb" >
                <IoIosAdd size={25} /> ADD
            </Link>
            <Table striped bordered hover responsive variant="dark" className="tableStyle"> 
            <thead>
                <tr>
                    <th>Activity</th>
                    <th>Description</th>
                    <th>Date Start</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Date Accepted</th>
                    <th>Project</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Activities && Activities.map((activity, index) =>(
                    <tr key={index}>
                        <td>{activity.activityName}</td>
                        <td>{activity.description}</td>
                        <td>{formatDateStart(activity)}</td>
                        <td>{formatDateEnd(activity)}</td>
                        <td>{ActivityStatusDisplayText(activity)}</td>
                        <td>{formatDateAccepted(activity)}</td>
                        <td>{activity.projectID}</td>
                        <td className="alignCenter">
                            <Button className="editBtn"
                            variant="primary"
                            onClick={() =>{navigate(`/activities/${activity.id}`)}}
                            >
                                <FaEdit 
                                size={25}
                                />
                            </Button>

                            <Button className="trashBtn"
                            variant="danger"
                            onClick={()=> deleteActivities(activity.id)}
                            >
                            <FaTrash  
                            size = {25}
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
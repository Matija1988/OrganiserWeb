import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { Container, Button, Table, InputGroup } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

import moment from 'moment';
import ProgressBar from "react-bootstrap/ProgressBar";


import './activitiesStyle.css';
import { getAlertMessages } from "../../services/httpService";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";



export default function Activities() {

    const [Activities, setActivities] = useState();
    const [search, setSearch] = useState("");

    let navigate = useNavigate();

    const {showError} = useError();

    const {showLoading, hideLoading} = useLoading();

    async function fetchActivities() {
        const response = await ActivitiesService.read('Activity');
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setActivities(response.data);
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    async function deleteActivities(id) {
        showLoading();
        const res = await ActivitiesService.remove('Activity', id);

        if (res.ok) {
            fetchActivities();
        } else {
          showError(res.data);
        }
        hideLoading();
    }


    function FormatDateStart(activity) {
        return activity.dateStart == null ? 'Not defined' :
            moment.utc(activity.dateStart).format('DD.MM.YYYY.')
    }

    function FormatDateEnd(activity) {
        return activity.dateFinish == null ? 'Not defined' :
            moment.utc(activity.dateFinish).format('DD.MM.YYYY.')
    }


    function FormatDateAccepted(activity) {
        return activity.dateAccepted == null ? 'Not defined' :
            moment.utc(activity.dateAccepted).format('DD.MM.YYYY.')
    }

    function progresLabel(activity) {
        let date1 = new Date(activity.dateStart);
        let date2 = new Date(activity.dateFinished);
        let dateNow = Date.now();

        let differenceInTime = dateNow - date1.getTime();

        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

        if (date2 < dateNow) {
            differenceInDays = 100;
        }

        return differenceInDays;
    }

    function progresLabelMaxValue(activity) {

        let date1 = new Date(activity.dateStart);
        let date2 = new Date(activity.dateFinish);
        let dateNow = Date.now();

        let differenceInTime = date2.getTime() - date1.getTime();

        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

        if (date2 < dateNow) {
            differenceInDays = 100;
        }

        return differenceInDays;

    }

    function ActivityStatusDisplayText(activity) {
        if (activity.isFinished == null) return 'No input';
        if (activity.isFinished) return 'Finished';
        return 'Ongoing';
    }





    return (
        <>
        <NavBar />
            <Container>
                <Link to={RoutesNames.ACTIVITIES_CREATE} className="btn btn-success gumb" >
                    <IoIosAdd size={25} /> ADD
                </Link>

                <Form>
                    <InputGroup>
                        <Form.Control
                            placeholder="Search activity by name..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="searchLabel" />
                    </InputGroup>
                </Form>


                <Table striped bordered hover responsive variant="dark" className="tableStyle">
                    <thead>
                        <tr className="projectTableHead">
                            <th>Activity</th>
                            <th>Description</th>
                            <th>Start date / Deadline</th>

                            <th>Status</th>
                            <th>Date Accepted</th>
                            <th>Project</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Activities && Activities.filter((activity) => {
                            return search.toLowerCase() === '' ? activity : activity.activityName.toLowerCase().includes(search);
                        }).map((activity, index) => (
                            <tr key={index}>
                                <td>{activity.activityName}</td>
                                <td>{activity.activityDescription}</td>
                                <td>
                                    <p>
                                        {FormatDateStart(activity)}
                                        /
                                        {FormatDateEnd(activity)}

                                    </p>
                                    <ProgressBar
                                        

                                        variant="danger"
                                        now={progresLabel(activity)}
                                        max={progresLabelMaxValue(activity)}
                                        title="Measures days from the start date"
                                    />
                                </td>
                            
                                <td>{ActivityStatusDisplayText(activity)}</td>
                                <td>{FormatDateAccepted(activity)}</td>
                                <td>{activity.projectName}</td>
                                <td className="alignCenter">
                                    <Button className="editBtnMember"
                                        variant="primary"
                                        onClick={() => { navigate(`/activities/${activity.id}`) }}
                                    >
                                        <FaEdit
                                            size={25}
                                        />
                                    </Button>

                                    <Button className="trashBtn"
                                        variant="danger"
                                        onClick={() => deleteActivities(activity.id)}
                                    >
                                        <FaTrash
                                            size={25}
                                        />
                                    </Button>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Container>
        </>
    );

}
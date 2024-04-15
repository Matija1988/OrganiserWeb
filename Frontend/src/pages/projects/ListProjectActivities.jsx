
import { Button, Container, ProgressBar, Table, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaAd, FaEdit, FaFemale, FaFile, FaMale, FaPersonBooth, FaTrash, FaUser, FaUserAlt, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import ProjectService from '../../services/ProjectService';
import ActivitiesService from "../../services/ActivitiesService";
import { RoutesNames } from "../../constants";


import "bootstrap/dist/css/bootstrap.min.css";
import './projectsStyle.css';
import NavBar from "../../components/NavBar";


export default function ListProjectActivities() {

    const navigate = useNavigate();

    const [Activities, setActivities] = useState();
    const [search, setSearch] = useState("");

    const routeParams = useParams();

    async function ListProjectActivities() {

        await ProjectService.listProjectActivities(routeParams.id)
            .then((res) => {
                setActivities(res.data)
            })
            .catch((e) => {
                alert(e);
            });
    }

    useEffect(() => {
        ListProjectActivities();
    }, []);

    async function deleteActivities(id) {
        const reply = await ActivitiesService.deleteActivities(id)

        if (reply.ok) {
            ListProjectActivities();
        } else {
            alert(reply.message);
        }
    }

    function FormatDateStart(activity) {
        return activity.dateStart == null ? 'Not defined' :
            moment.utc(activity.dateStart).format('DD.MM.YYYY.')
    }

    function FormatDateEnd(activity) {
        return activity.dateFinish == null ? 'Not defined' :
            moment.utc(activity.dateFinished).format('DD.MM.YYYY.')
    }


    function FormatDateAccepted(activity) {
        return activity.dateAccepted == null ? 'Not defined' :
            moment.utc(activity.dateAccepted).format('DD.MM.YYYY.')
    }

    function progresLabel(activity) {
        let date1 = new Date(activity.dateStart);
        let date2 = new Date(activity.dateFinish);
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
            <Form>
                <Row>
                    <Col>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search activity by name..."
                                onChange={(e) => setSearch(e.target.value)}
                                className="searchLabel" />
                        </InputGroup>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive variant="dark" className="tableStyle">
            
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Description</th>
                        <th>Start date / Deadline</th>
                        <th>Status</th>
                        <th>Date Accepted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Activities && Activities.filter((Activities) => {
                        return search.toLowerCase() === '' ?
                            Activities : Activities.activityName.toLowerCase().includes(search);
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
                                    // label = {progresLabel(activity)}

                                    variant="danger"
                                    now={progresLabel(activity)}
                                    max={progresLabelMaxValue(activity)}
                                    title="Measures days from the start date"
                                />
                            </td>

                            <td>{ActivityStatusDisplayText(activity)}</td>
                            <td>{FormatDateAccepted(activity)}</td>
                            <td className="alignCenter">
                                <Row className="tableActionsRow1">
                                    <Col>
                                    <Button
                                        className="memBtn"
                                        title="Assign member/s to activity"
                                        onClick={() => { navigate(`/activitiesmembersmenu/${activity.id}`) }}
                                    >
                                        <FaUsers
                                            size={20}
                                        ></FaUsers>
                                    </Button>
                                    </Col>
                                    <Col>
                                    <Button className="editBtn"
                                        variant="primary"
                                        onClick={() => { navigate(`/activities/${activity.id}`) }}
                                    >
                                        <FaEdit
                                            size={20}
                                        />
                                    </Button>
                                    </Col>
                                </Row>    
                                    <Button className="trashBtn"
                                        variant="danger"
                                        onClick={() => deleteActivities(activity.id)}
                                    >
                                        <FaTrash
                                            size={20}
                                        />
                                    </Button>
                                    
                            </td>
                        </tr>
                    )
                    )}

                </tbody>

            </Table>
        </Container>
        </>
    );
}
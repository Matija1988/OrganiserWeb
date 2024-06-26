import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";
import { Container, Button, Table, InputGroup, Row, Col, Pagination } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

import moment from 'moment';
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";



import './activitiesStyle.css';
import { getAlertMessages } from "../../services/httpService";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import DeleteModal from "../../components/DeleteModal";
import TablePagination from "../../components/TablePagination";



export default function Activities() {

    const [Activities, setActivities] = useState();
    const [page, setPage] = useState(1);
    const [condition, setCondtion] = useState('');
    const [search, setSearch] = useState("");

    let navigate = useNavigate();

    const {showError} = useError();

    const {showLoading, hideLoading} = useLoading();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entityID, setEntityID] = useState();

    const [totalActivities, setTotalActivities] = useState();


    async function fetchActivities() {
        showLoading();
        const response = await ActivitiesService.getPagination(page, condition);

        const activitiesResponse = await ActivitiesService.read('Activity');

        if(!response.ok) {
            showError(response.data);
            hideLoading();
            return;
        } 
        if(response.data.length==0) {
            setPage(page-1);
            hideLoading();
            return;
        }
        setActivities(response.data);
        setTotalActivities(activitiesResponse);
        hideLoading();
    }

    useEffect(() => {
        fetchActivities();
    }, [page, condition]);

    async function deleteActivities(id) {
        showLoading();
        const response = await ActivitiesService.remove('Activity', id);

        if (response.ok) {
            fetchActivities();
        } else {
          showError(response.data);
        }
        hideLoading();
    }

    function changeCondition(e) {
        if (e.nativeEvent.key == "Enter") {
            setPage(1);
            setCondtion(e.nativeEvent.srcElement.value);
            setActivities([]);
        }
    }

    const totalPages = Math.ceil(totalActivities / 8);

    const handlePageChange = (page) => {
        setPage(page);
    };



    function increasePage() {
        setPage(page + 1);
    }

    function decreasePage() {
        if(page<=1) {
            return;
        }
        setPage(page-1);
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

        let differenceInTime =  dateNow - date1.getTime();

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
                <Row>
                    <Col>                    
                    <Form>
                        <InputGroup>
                            <Form.Control
                                placeholder="Filter activity by name..."
                                onChange={(e) => setSearch(e.target.value)}
                                className="searchLabel" />
                        </InputGroup>
                    </Form>
                    </Col>
                    <Col>
                    <Form.Control 
                    className="searchLabel"
                    type = 'text'
                    name = 'search'
                    placeholder ='Part of activity or project name [Enter]'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={changeCondition}
                    />
                    </Col>
                    <Col>
                    {Activities && Activities.length > 0 && (
                        <div style={{display : "flex", justifyContent:"center"}}>
                            <Pagination size ="lg" className="pagination">
                            <Pagination.Prev onClick={decreasePage} />
                            <Pagination.Item >{page}</Pagination.Item>
                            <Pagination.Next onClick={increasePage} />
                            </Pagination>
                        </div>
                    )}
                    </Col>   
                </Row>
                <Table 
                striped 
                bordered 
                hover 
                responsive 
                
                variant="dark" 
                className="tableStyle"
                >
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
                                    <Row>
                                        <Col>
                                    <Button className="editBtn"
                                        variant="primary"
                                        onClick={() => { navigate(`/activities/${activity.id}`) }}
                                    >
                                        <FaEdit
                                            size={25}
                                        />
                                    </Button>
                                    </Col>
                                    <Col>
                                    <Button className="trashBtn"
                                        variant="danger"
                                        onClick={() => (setEntityID(activity.id), setShowDeleteModal(true))}
                                    >
                                        <FaTrash
                                            size={25}
                                        />
                                    </Button>
                                    </Col>
                                    </Row>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                <TablePagination 
                currentPage={page}
                totalPAges={totalPages}
                onPageChange={handlePageChange}
                
                />
            </Container>
            <DeleteModal
            show={showDeleteModal}
            handleClose={()=>setShowDeleteModal(false)}
            handleDelete={()=> (deleteActivities(entityID), setShowDeleteModal(false))}  
            />
            
        </>
    );

}
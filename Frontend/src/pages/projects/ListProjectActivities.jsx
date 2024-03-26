
import { Button, Container, ProgressBar, Table } from "react-bootstrap";
import { FaAd, FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';

import ProjectService from '../../services/ProjectService';
import ActivitiesService from "../../services/ActivitiesService";
import { RoutesNames } from "../../constants";


export default function ListProjectActivities() {

    const [Activities, setActivities] = useState();
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

    useEffect (() => {
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
        return  activity.datestart == null ? 'Not defined' :
        moment.utc(activity.datestart).format('DD.MM.YYYY.')
       }
    
       function FormatDateEnd(activity){ 
        return  activity.datefinished == null ? 'Not defined' :
        moment.utc(activity.datefinished).format('DD.MM.YYYY.')
       }
    
       
       function FormatDateAccepted(activity){ 
        return  activity.dateaccepted == null ? 'Not defined' :
        moment.utc(activity.dateaccepted).format('DD.MM.YYYY.')
       }
       
       function progresLabel(activity) {
        let date1 = new Date(activity.datestart);
        let date2 = new Date(activity.datefinished);
        let dateNow = Date.now();
    
        let differenceInTime =  dateNow - date1.getTime();
    
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    
        if(date2 < dateNow) {
            differenceInDays = 100; 
        } 
    
        return differenceInDays;
       }
    
       function progresLabelMaxValue(activity) {
    
        let date1 = new Date(activity.datestart);
        let date2 = new Date(activity.datefinished);
        let dateNow = Date.now();
    
        let differenceInTime = date2.getTime() - date1.getTime();
    
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    
        if(date2 < dateNow) {
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

        <Container>
           <Table striped bordered hover responsive variant="dark" className="tableStyle">
            <thead>
            <tr>
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
                    {Activities && Activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.activityname}</td>
                            <td>{activity.description}</td>
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
                            <td>{activity.project}</td>
                            <td className="alignCenter">
                                <Button className="editBtn"
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
                )
                )}

            </tbody>
         
           </Table>
        </Container>
    );
}
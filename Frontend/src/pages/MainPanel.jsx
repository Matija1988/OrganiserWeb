import { FormLabel, Container } from "react-bootstrap";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Calendar as BigCalendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import NavBar from "../components/NavBar";
import ActivitiesService from "../services/ActivitiesService";
import useError from "../hooks/useError";
import useLoading from "../hooks/useLoading";
import Footer2 from "../components/Footer2";
import MembersService from "../services/MembersService";
import CalendarDataModal from "../components/CalendarDataModal";


export default function MainPanel() {

    const [Activity, setActivity] = useState();
    const [Member, setMember] = useState();


    const [ActivityID, setActivityID] = useState(1);
    const [activityName, setActivityName] = useState('');
    const [activityDes, setActivityDes] = useState('');

    const [showInfoModal, setShowInfoModal] = useState(false);

    const [des, setDes] = useState(Activity, Member);

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    const localizer = momentLocalizer(moment);


    async function fetchActivities() {
        showLoading();
        const response = await ActivitiesService.read('Activity');
        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }
        setActivity(response.data);
        hideLoading();
    }

    async function fetchActivityMembers(){
        showLoading();
        const response = await ActivitiesService.getActivityMembers(ActivityID);
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setMember(response.data);
        hideLoading();
    }
 

    async function load() {
        showLoading();
        fetchActivities();
        fetchActivityMembers();
        hideLoading();
    }

    useEffect(() => {
       load();
    },[]);

    const components = useMemo(()=>({
        event: (Activity),
     
        week :{           
            event:(Activity)
        },
        
    }),[])

  

    const handleSelectedSlot = useCallback((start, end) => {
        const title = window.prompt('New Event name');
       
        if(title) {
            setDes((Activity, Member) => [...Activity,{ startDate, dateFinish, activityDescription, id},
            ...Member,{firstName, lastName}]);
         
        }
        [setDes]
    });

    const handleSelectEvent = useCallback((des) => {
            fetchActivityMembers(des.id),
            setActivityID(des.id),
            setActivityName(des.activityName),
            setActivityDes(des.activityDescription),

            setShowInfoModal(true), []
    });

    return(

        <>

            <NavBar />

            <Container className="mainPanelContainer" >
                <Fragment>
                    <BigCalendar
                        components={components}
                        style={{height : "650px"}}
                        events={Activity}
                        titleAccessor={(Activity) => {return new String(Activity.activityName)}}
                        startAccessor={(Activity) => {return new Date(Activity.dateStart)}}
                        endAccessor={(Activity) => {return new Date(Activity.dateFinish)}}
                        localizer={localizer}
                        onSelectEvent = {handleSelectEvent}
                        onSelectSlot = {handleSelectedSlot} 
                        showMultiDayTimes
                        popup
                        
                        
                    />
                </Fragment>
            </Container>
            <Container className="footerContainer">
                <Footer2 />
            </Container>
            <CalendarDataModal 
            show={showInfoModal} 
            handleClose={()=>setShowInfoModal(false)}
            name = {activityName}
            description = {activityDes}
            member={Member}
            />
            
        </>
        
    );
}
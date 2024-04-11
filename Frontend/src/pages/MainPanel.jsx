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


export default function MainPanel() {

    const [Activity, setActivity] = useState();
    const [Member, setMember] = useState();

    

    const [des, setDes] = useState(Activity, Member);

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    const localizer = momentLocalizer(moment);


    async function fetchActivities() {
        const response = await ActivitiesService.read('Activity');
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setActivity(response.data);
    }

    async function fetchMembers() {

        const response = await MembersService.read('Member');
        if(!response.ok) {
            showError(response.data);
            return;
        }
        setMember(response.data);
    }

    useEffect(() => {
        showLoading();
        fetchActivities();
        fetchMembers();
        hideLoading();
    },[]);


    const components = useMemo(()=>({
        event: (Activity, Member),
     
        week :{           
            event:(Activity, Member)
        },

    }),[])

    const handleSelectSlot = useCallback(({start, end}) => {
        const title = window.prompt('New Event name')
        if(title) {
            setDes((Activity, Member) => [...Activity,{ startDate, dateFinish, activityDescription}, ...Member,{firstName, lastName}])
        }
        [setDes]
    });

    const handleSelectEvent = useCallback((des) => 
    window.alert(des.activityDescription + "\n Assigned to: " + des.firstName + " " + des.lastName), [])
    


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
                        onSelectSlot = {handleSelectSlot}
                        showMultiDayTimes
                        popup
                        
                    />
                </Fragment>
            </Container>
            <Container className="footerContainer">
            <Footer2  />
            </Container>
        
        </>
    );
}
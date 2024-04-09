import { FormLabel, Container,  Stack } from "react-bootstrap";
import { useEffect, useState } from "react";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import ActivitiesService from "../services/ActivitiesService";
import useError from "../hooks/useError";
import useLoading from "../hooks/useLoading";

export default function MainPanel() {

    const [Activity, setActivity] = useState();

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();


    async function fetchActivities() {
        const response = await ActivitiesService.read('Activity');
        if (!response.ok) {
            showError(response.data);
            return;
        }
        setActivity(response.data);
    }

    useEffect(() => {
        fetchActivities();
    },[]);



    return(

        <>
        <NavBar />
            <Container >
                <FormLabel className="homeText">TTTTTTTTTTT</FormLabel>
             <Calendar
             
             >

             </Calendar>
        </Container>
        
     
        <Footer />
     
        </>
    );
}
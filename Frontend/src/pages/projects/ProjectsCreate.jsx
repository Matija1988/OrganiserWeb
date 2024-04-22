import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { RoutesNames } from "../../constants";
import ProjectService from '../../services/ProjectService';

import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

import InputText from "../../components/InputText";
import InputCheckbox from "../../components/InputCheckbox";
import Actions from "../../components/Actions";

import "bootstrap/dist/css/bootstrap.min.css";
import './projectsStyle.css';
import NavBar from "../../components/NavBar";



export default function ProjectsCreate() {

    const navigate = useNavigate();
    

    const { showError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function createProject(project) {
        showLoading();
        const response = await ProjectService.create('Project', project);
        if (response.ok) {
            navigate(RoutesNames.PROJECTS_READ);
            hideLoading();
            return;
        }
        showError(response.data);
        hideLoading();
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        let startingDate = new Date(information.get('dateStart'));
        let endingDate = new Date(information.get('dateEnd'));

        if(startingDate > endingDate) {
            alert("Projects cannot end before they start!!! Check your input!!!");
            return;
        }
        
        var today = new Date();

        let checkFinished = new Boolean(information.get('isFinished') =='on' ? true : false); 

        if((today < startingDate) && (checkFinished == true)) {
            alert("Project cannot end before it begins!!! Check your input!!!");
            checkFinished = false;
            return;
        }


        if (today > endingDate) {
            alert("Current date is past deadline. Is finished property has been set to TRUE (Finished) automatically!" +
                "\n If project is not finished update the deadline and reset the affected property!");
            checkFinished = true;
        }

        const name = information.get('Project name');
        const uID = information.get('Unique ID');

        if(name == "" || uID == "") {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nProject name \nUnique ID \nare mandatory inputs!!!");  
        }

        showLoading();
        
        createProject({
            projectName: name,
            uniqueID: uID,
            dateStart: startingDate,
            dateEnd: endingDate,
            isFinished: checkFinished
        });
        hideLoading();
    
    }

    return (
        <>
        <NavBar />
            <Container>
                <Form onSubmit={handleSubmit} className="FormProjectCreate">
                    <InputText atribute="Project name" value='' />
                    <InputText atribute="Unique ID" value='' />
                  
                    <Form.Group controlId="dateStart">
                        <Form.Label>Starting date</Form.Label>
                        <Form.Control
                            type='date'
                            name='dateStart'
                        />
                    </Form.Group>

                    <Form.Group controlId="dateEnd">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type='date'
                            name='dateEnd'
                        />
                    </Form.Group>

                    <InputCheckbox atribute="isFinished" value={false} />

                    <Actions cancel={RoutesNames.PROJECTS_READ} action="ADD PROJECT" />
                </Form>
            </Container>
        </>
    );

}
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
import DateAndTime from "../../components/DateAndTime";
import NavBar from "../../components/NavBar";
import DateOnly from "../../components/DateOnly";


export default function ProjectsCreate() {

    const navigate = useNavigate();

    const { showError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function createProject(project) {
        showLoading();
        const response = await ProjectService.create('Project', project);
        if (response.ok) {
            navigate(RoutesNames.PROJECTS_READ);
            return;
        }
        showError(response.data);
        hideLoading();
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        createProject({
            projectName: information.get('Project Name'),
            uniqueID: information.get('Unique ID'),
            dateStart: information.get('dateStart'),
            dateEnd: information.get('dateEnd'),
            isFinished: information.get('isFinished') == 'on' ? true : false
        });

    }

    return (
        <>
        <NavBar />
            <Container>
                <Form onSubmit={handleSubmit} className="FormProjectCreate">
                    <InputText atribute="Project Name" value='' />
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
                    <Actions cancel={RoutesNames.PROJECTS_READ} action="Add project" />
                </Form>
            </Container>
        </>
    );

}
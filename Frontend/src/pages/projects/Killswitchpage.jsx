import { Container, Form, Row, Button, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import ProjectService from "../../services/ProjectService";
import { useEffect, useState } from "react";
import { getByID } from "../../services/httpService";
import { RoutesNames } from "../../constants";

export default function Killswitchpage() {

    const routeParams = useParams();
    const [project, setProject] = useState({});
    const {showError } = useError();
    const {showLoading, hideLoading} = useLoading();


    async function getProject() {
        showLoading();
        const response = await ProjectService.getByID('Project',routeParams.id);
        if(!response.ok) {
            showError();
            navigate(RoutesNames.PROJECTS_READ);
            hideLoading();
            return;
        }
        setProject(response.data);
        hideLoading();
    }

    
    async function kill(input, id) {
        showLoading();
        const response = await ProjectService.killswitch('Project', routeParams.id);
        if(!response.ok){
            showError();
            hideLoading();
            navigate(RoutesNames.PROJECTS_READ);
            return;
        }    
        hideLoading();
    }

    useEffect(() => {
        getProject();
        kill();
    }, []);

    function handleSubmit(e) {

        e.preventDefault();

        const data = new FormData(e.target);
        kill({
            project: project.id,
            username:data.get('username'),
            password: data.get('password'),
        });
    }

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="killTextH1">WARNING!!!</h1>
                <h3 className="killText">This action will delete entries connected to the project and the project!!!</h3>
                <h4 className="killText">Project - Activities - Proofs of delivery </h4>
                <h4 className="killText">In order to perform this action user must validate username and password!</h4>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="username"
                            name="username"
                            placeholder="texasranger"
                            maxLength={255}

                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="chuckneedsnopassword"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className='SignInButton'>
                        VALIDATE ACTION
                    </Button>

                </Form>
            </Container>
        </>
    );
}
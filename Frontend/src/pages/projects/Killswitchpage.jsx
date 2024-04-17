import { Container, Form, Row, Button, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import ProjectService from "../../services/ProjectService";
import { useEffect, useState } from "react";
import { RoutesNames } from "../../constants";
import Actions from "../../components/Actions";

export default function Killswitchpage() {

    const routeParams = useParams();

    const [project, setProject] = useState({});
    const {showError } = useError();
    const {showLoading, hideLoading} = useLoading();
    const navigate = useNavigate();


    async function getProject() {
        showLoading();
        const response = await ProjectService.getByID('Project', routeParams.id);
        
        if(!response.ok) {
            showError(response.data);
            hideLoading();
            return;
        }
        setProject(response.data);
        
        hideLoading();
    }
    
    async function kill(input) {
        showLoading();
        const response = await ProjectService.killswitch(routeParams.id, input);
        if(!response.ok){
            showError(response.data);
            hideLoading();

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

        const input = new FormData(e.target);
        kill({
            
            projectName: input.get('projectName'),
            
        });
        
    }

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="killTextH1">WARNING!!!</h1>
                <h3 className="killText">This action will delete entries connected to the project and the project!!!</h3>
                <h4 className="killText">Project / {project.projectName} - Activities - Proofs of delivery </h4>
                <h4 className="killText">In order to perform this action user must validate username and password!</h4>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            name="projectName"
                            placeholder="texasranger"
                            maxLength={255}
                            required
                        />
                    </Form.Group>
                    <Actions cancel={RoutesNames.PROJECTS_READ} action="CONFIRM ACTION"></Actions>
                   

                </Form>
            </Container>
        </>
    );
}
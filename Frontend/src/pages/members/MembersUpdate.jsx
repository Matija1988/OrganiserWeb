import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import MembersService from "../../services/MembersService";
import { RoutesNames } from "../../constants";

import './membersStyle.css';
import { getAlertMessages } from "../../services/httpService";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import InputText from "../../components/InputText";
import InputCheckbox from "../../components/InputCheckbox";
import Actions from "../../components/Actions";

export default function MembersUpdate() {

    const [member, setMember] = useState({});

    const routeParams = useParams();
    const navigate = useNavigate();

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    async function fetchMember() {
        showLoading();
        const response = await MembersService.getByID('Member', routeParams.id);
        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }
        setMember(response.data);
        hideLoading();
    }   

    useEffect(() => {
        fetchMember();
    }, []);

    async function UpdateMember(member) {
        showLoading();    
        const response = await MembersService.update('Member', routeParams.id, member);
        if (response.ok) {
            hideLoading();
            navigate(RoutesNames.MEMBERS_READ);
            return;
        } 
        showError(response.data);
        hideLoading();
    }

    function role(e) {
        const information = new FormData(e.target);
        if(information.get('Is team leader')) {
            return "TeamLeader";
        } else {
            return "Member";
        }
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        
        const name = information.get('First name');
        const surname = information.get('Last name');
        const user = information.get('Username');
        const pass = information.get('Password');
        const mail = information.get('email');

        if(name.length > 50 || surname.length > 50) {
            alert("First name and last name fields must be from 1 to 50 characters long!!!");
        }

        if(name == "" || surname == "" || user =="" || pass == ""  || mail == ""  ) {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nFirst name \nLast name \nUsername \nPassword \nEmail \nare mandatory inputs!!!");
        }

        UpdateMember({
            firstName: name,
            lastName: surname,
            username: user,
            password: pass,
            email: mail,
            isTeamLeader: information.get('Is team leader') == 'on' ? true : false,
            roles: role(e)
        });
        hideLoading();
    }

    return (
        <>
        <NavBar />
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>
                    <Row>
                        <Col>
                            <InputText atribute="First name" value={member.firstName} />
                        </Col>
                        <Col>
                            <InputText atribute="Last name" value={member.lastName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputText atribute="Username" value={member.username} />
                        </Col>
                        <Col>
                            <InputText atribute="Password" value={member.password} />
                        </Col>
                    </Row>
                    
                <InputText atribute="email" value={member.email} />
                <InputCheckbox atribute="Is team leader" value={member.isTeamLeader} />
                <Actions cancel={RoutesNames.MEMBERS_READ} action="UPDATE MEMBER"/>                
                
            </Form>
        </Container>
        </>
    );

}

import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import MembersService from '../../services/MembersService';
import { RoutesNames } from '../../constants';

import './membersStyle.css';
import { getAlertMessages } from '../../services/httpService';
import NavBar from '../../components/NavBar';
import InputText from '../../components/InputText';
import InputCheckbox from '../../components/InputCheckbox';
import Actions from '../../components/Actions';
import useError from '../../hooks/useError';
import useLoading from '../../hooks/useLoading';


export default function MembersCreate() {

    const navigate = useNavigate();

    const {showError} = useError();

    const {showLoading, hideLoading} = useLoading();

    async function addMember(Member) {
        
        showLoading();
        const response = await MembersService.create('Member', Member);
        if (response.ok) {
            hideLoading();
            navigate(RoutesNames.MEMBERS_READ);
            return;
        }
        showError(response.data);
        hideLoading();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const information = new FormData(e.target);

        const member = {
            firstName: information.get('First name'),
            lastName: information.get('Last name'),
            userName: information.get('Username'),
            password: information.get('Password'),
            email: information.get('email'),
            isTeamLeader: information.get('Is team leader') == 'on' ? true : false
        };

        addMember(member);

    }

    return (
        <>
        <NavBar />
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>
                <InputText atribute='First name' value=''/>
                <InputText atribute='Last name' value=''/>
                <InputText atribute='Username' value=''/>
                <InputText atribute='Password' value=''/>
                <InputText atribute='email' value='' />
                <InputCheckbox atribute='Is team leader' value=''/>
                <Actions cancel={RoutesNames.MEMBERS_READ} action='Add member'/>
            </Form>
        </Container>
        </>
    );

}
import { Button, Col, Container, Form, FormLabel, FormSelect, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

import { RoutesNames } from '../../constants';

import ProofsService from '../../services/ProofsService';
import MembersService from '../../services/MembersService';
import ActivitesService from '../../services/ActivitiesService';
import { getAlertMessages } from '../../services/httpService';

import './proofsStyle.css';
import NavBar from '../../components/NavBar';
import useError from '../../hooks/useError';
import useLoading from '../../hooks/useLoading';
import InputText from '../../components/InputText';
import Actions from '../../components/Actions';
import { FaUpload } from 'react-icons/fa';


export default function ProofsCreate() {

    const navigate = useNavigate();

    const [member, setMember] = useState([]);
    const [memberIDa, setMemberID] = useState(0); 

    const [activity, setActivity] = useState([]);
    const [activityIDa, setActivityID] = useState(0);

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    async function fetchMembers() {
        showLoading();
        const res = await MembersService.read('Member');
        if(!res.ok) {
            hideLoading();
            showError(res.data);
            return;
        } 
        setMember(res.data);
        setMemberID(res.data[0].id);
        hideLoading();
    }

    async function fetchAcitivties() {
        showLoading();
        const response = await ActivitesService.read('Activity');
        if(!response.ok) {
            hideLoading();
            showError(response.data);
            return; 
        }
        setActivity(response.data);
        setActivityID(response.data[0].id);
        hideLoading();
    }

    async function load() {
        await fetchMembers();
        await fetchAcitivties();
    }

    useEffect(()=>{
        load();
    },[]);


    async function addProof(Proof) {
        showLoading();
        const response = await ProofsService.create('Proof', Proof);
        if (response.ok) {
            hideLoading();
            navigate(RoutesNames.PROOFS_READ);
            return;
        }
        showError(response.data);
        hideLoading();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const information = new FormData(e.target);

        if(information.get('dateCreated')=='' && information.get('timeCreated') != ''){
            alert('Must set date along with time!');
            return;
        }
        let dateOfCreation = null;
        if(information.get('dateCreated') != '' && information.get('timeCreated')=='') {
            dateOfCreation = information.get('dateCreated') + 'T00:00:00.000Z';
        } else {
            dateOfCreation = information.get('dateCreated') + 'T' + information.get('timeCreated') + ':00.000Z';
        }

        const name = information.get('Document name');

        if(name.length > 100) {
            alert("Maximum allowed characters for Document name is: 100");
            return;
        }

        if(name == "" || dateOfCreation == null) {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nDocument name \nActivity \nare mandatory inputs!!!"); 
            return;
        }

        addProof({
            documentName: name,
            datecreated: dateOfCreation,
            memberID: parseInt(memberIDa),          
            activityID: parseInt(activityIDa)
        });
        hideLoading();

    }

    return (
        <>
        <NavBar />
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>
            <InputText atribute='Document name' value=''/>
                
                <Row>
                    <Col>
                        <Form.Group controlId='memberID'>
                            <Form.Label>Member</Form.Label>
                            <Form.Select
                            onChange={(e) => {setMemberID(e.target.value)}}
                            >
                                {member && member.map((m, index)=>(
                                    <option key={index} value={m.id}>
                                            {m.firstName} {m.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group  controlId='dateCreated'>
                    <Form.Label>Date created</Form.Label>
                    <Form.Control
                        type='date'
                        name='dateCreated'
                        placeholder='Date created'         
                    />
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Label>Time of creation</Form.Label>
                    <Form.Control 
                    type = 'time'
                    name = 'timeCreated'
                    placeholder='Time created'
                    />
                    </Col>
                </Row>
                    <Form.Group controlId='activityID'>
                        <Form.Label>Activity</Form.Label>
                        <FormSelect required
                            onChange={(e) => { setActivityID(e.target.value) }}
                        >
                            {activity && activity.map((e, index) => (
                                <option key={index} value={e.id}>
                                    {e.activityName}
                                </option>
                            ))}

                        </FormSelect>
                    </Form.Group>
                    <Actions cancel={RoutesNames.PROOFS_READ} action='ADD PROOF' />

                </Form>
            </Container>
            
        </>
    );

}
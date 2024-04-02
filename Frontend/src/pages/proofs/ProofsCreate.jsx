import { Button, Col, Container, Form, FormLabel, FormSelect, Row } from 'react-bootstrap';
import { Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

import { RoutesNames } from '../../constants';

import ProofsService from '../../services/ProofsService';
import MembersService from '../../services/MembersService';
import ActivitesService from '../../services/ActivitiesService';
import { getAlertMessages } from '../../services/httpService';

import './proofsStyle.css';


export default function ProofsCreate() {

    const navigate = useNavigate();

    const [member, setMember] = useState([]);
    const [memberIDa, setMemberID] = useState(0); 

    const [activity, setActivity] = useState([]);
    const [activityIDa, setActivityID] = useState(0);

    async function fetchMembers() {
        const res = await MembersService.getMembers();
        if(!res.ok) {
            alert(getAlertMessages(res.data));
            return;
        } 
        setMember(res.data);
        setMemberID(res.data[0].id);
    }

    async function fetchAcitivties() {
        const response = await ActivitesService.get();
        if(!response.ok) {
            alert(getAlertMessages(response.data));
            return; 
        }
        setActivity(response.data);
        setActivityID(response.data[0].id);
    }

    async function load() {
        await fetchMembers();
        await fetchAcitivties();
    }

    useEffect(()=>{
        load();
    },[]);
    
    async function addProof(Proof) {

        const response = await ProofsService.createProof(Proof);
        if (response.ok) {
            navigate(RoutesNames.PROOFS_READ);
        } else {
            alert(getAlertMessages(response.data));
        }
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

        addProof({
            documentName: information.get('documentName'),
            datecreated: dateOfCreation,
            memberID: parseInt(memberIDa),
            location: information.get('Location'),
            activityID: parseInt(activityIDa)
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormActivity'>

                <Form.Group  controlId='documentName'>
                    <Form.Label>Document Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='documentName'
                        placeholder='Document Name'
                        maxLength={100}
                        required
                    />
                </Form.Group>

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
                <Form.Group  controlId='Location'>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type='text'
                        name='Location'
                        placeholder='Location'
                        maxLength={200}
                        
                    />

                </Form.Group>

                <Form.Group  controlId='activityID'>
                    <Form.Label>Activity</Form.Label>
                   <FormSelect 
                   onChange ={(e) => {setActivityID(e.target.value)}}
                   >
                    {activity && activity.map((e, index)=>(
                    <option key={index} value={e.id}>
                        {e.activityName}
                    </option>
                   ))}

                    </FormSelect>
                </Form.Group>

                <Row>
                    <Col>
                        <Link className='btn btn-danger gumb' to={RoutesNames.PROOFS_READ}>
                            CANCEL
                        </Link>
                    </Col>

                    <Col>
                        <Button variant='primary' className='gumb' type='submit'>
                            ADD PROOF
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    );

}
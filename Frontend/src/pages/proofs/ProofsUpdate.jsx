import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import { RoutesNames } from "../../constants";

import ProofsService from "../../services/ProofsService";
import MembersService from "../../services/MembersService";
import ActivitiesService from "../../services/ActivitiesService";
import { getAlertMessages } from "../../services/httpService";

import './proofsStyle.css';
import moment from "moment";

export default function ProofUpdate() {

    const [proof, setProof] = useState({});

    
    const [member, setMember] = useState([]);
    const [idMember, setMemberID] = useState(0); 

    const [activity, setActivity] = useState([]);
    const [idActivity, setActivityID] = useState(0);

    const routeParams = useParams();
    const navigate = useNavigate();

    async function fetchProof() {
        const response = await ProofsService.getById(routeParams.id);
        if(!response.ok){
            alert(getAlertMessages(response.data));
            return;
        }
        let proof = response.data;
        proof.time = moment.utc(proof.datecreated).format('HH:mm');
        proof.date = moment.utc(proof.datecreated).format('yyyy-MM-DD');
        delete proof.datecreated;
        setProof(proof);
        if(proof.member != null) {
            setMemberID(proof.member);
        } 
        setActivityID(proof.activity)
    }

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
        const response = await ActivitiesService.get();
        if(!response.ok) {
            alert(getAlertMessages(response.data));
            return; 
        }
        setActivity(response.data);
        setActivityID(response.data[0].id);
    }

    async function load() {
        await fetchProof();
        await fetchMembers();
        await fetchAcitivties();
    }


    useEffect(() => {
        load();
    }, []);

    async function changeProof(proof) {
        const response = await ProofsService.updateProof(routeParams.id, proof);
        if (response.ok) {
            navigate(RoutesNames.PROOFS_READ);
            return;
        } 
        alert(getAlertMessages(response.data));
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        const date = moment.utc(information.get('date') + ' ' + information.get('time'));

        changeProof({
            documentName: information.get('documentName'),
            memberID: parseInt(idMember),
            location: information.get('Location'),
            datecreated: date,
            activityID: parseInt(idActivity)
        });

    }

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>

                <Form.Group controlId="documentName">
                    <Form.Label>Document Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='documentName'
                        defaultValue={proof.documentName}
                        maxLength={100}
                        
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group controlId="memberID">
                            <Form.Label>Member</Form.Label>
                            <Form.Select
                            value={idMember}
                            onChange={(e) => {
                                setMemberID(e.target.value);
                            }}
                            > {member && member.map((member, index)=>(
                                <option key={index} value={member.id}>
                                     {member.firstName} {member.lastName}   
                                </option>
                            ))}

                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group  controlId="date">
                    <Form.Label>Date Created</Form.Label>
                    <Form.Control
                        type='date'
                        name='date'
                        defaultValue={proof.date}
                    />
                </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group  controlId="time">
                    <Form.Label>Time Created</Form.Label>
                    <Form.Control
                        type='time'
                        name='time'
                        defaultValue={proof.time}
                    />
                </Form.Group>
                    </Col>
                </Row>  
                <Form.Group  controlId="Location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type='text'
                        name='Location'
                        defaultValue={proof.location}
                        maxLength={200}

                    />
                </Form.Group>

                

                <Form.Group  controlId="activityID">
                    <Form.Label>ActivityID</Form.Label>
                    <Form.Select
                    value={idActivity}
                    onChange= {((e)=> {
                        setActivityID(e.target.value)
                    })}
                    >
                        {activity && activity.map((activity, index)=>(
                            <option key={index} value={activity.id}>
                                {activity.activityName}
                            </option>
                        ))}

                    </Form.Select>
                </Form.Group>

                <Row>
                    <Col>
                    <Link className="btn btn-danger gumb" to={RoutesNames.PROOFS_READ}>
                        CANCEL
                    </Link>
                    </Col>
                    <Col>
                    <Button varian='primary' className="gumb" type='submit'>
                            UPDATE PROOF
                    </Button>
                    </Col>
                </Row>


            </Form>
        </Container>
    );

}

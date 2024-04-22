import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Link,  useNavigate, useParams } from "react-router-dom";
import { RoutesNames } from "../../constants";

import ProofsService from "../../services/ProofsService";
import MembersService from "../../services/MembersService";
import ActivitiesService from "../../services/ActivitiesService";
import { getAlertMessages } from "../../services/httpService";

import './proofsStyle.css';
import moment from "moment";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import NavBar from "../../components/NavBar";
import InputText from "../../components/InputText";
import { FaUpload } from "react-icons/fa";

export default function ProofUpdate() {

    const [proof, setProof] = useState({});

    
    const [member, setMember] = useState([]);
    const [idMember, setMemberID] = useState(0); 

    const [activity, setActivity] = useState([]);
    const [idActivity, setActivityID] = useState(0);

    const routeParams = useParams();
    const navigate = useNavigate();

    const {showError} = useError();

    const {showLoading, hideLoading} = useLoading();

    const [showModal, setShowModal] = useState(false);

    async function fetchProof() {
        showLoading();
        const response = await ProofsService.getByID('Proof',routeParams.id);

        if(!response.ok){
            hideLoading();
            showError(response.data);
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
        setActivityID(proof.activity);
        hideLoading();
    }

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
        const response = await ActivitiesService.read('Activity');
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
        showLoading();
        await fetchProof();
        await fetchMembers();
        await fetchAcitivties();
        hideLoading();
    }


    useEffect(() => {
        load();
    }, []);

    async function changeProof(proof) {
        const response = await ProofsService.update('Proof',routeParams.id, proof);
        if (response.ok) {
            navigate(RoutesNames.PROOFS_READ);
            return;
        } 
        alert(getAlertMessages(response.data));
    }

    function setFileModal() {
        
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    async function setFile(e) {
        if (e.currentTarget.files) {
            const formData = new FormData();
            formData.append('file', e.currentTarget.files[0]);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            const response = await ProofsService.uploadFile(routeParams.id, formData, config);
            
            if (!response.ok) {
                showError(response.data);
                setShowModal(false);
            }
            setShowModal(false);

        }
    }


    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        const date = moment.utc(information.get('date') + ' ' + information.get('time'));

        const name = information.get('Document name');

        if(name == "") {
            alert("ALERT!!! \nFOLLOWING FIELDS: \nDocument name \nActivity \nare mandatory inputs!!!");
            return; 
        }

        changeProof({
            documentName: name,
            memberID: parseInt(idMember),
            location: information.get('Location'),
            datecreated: date,
            activityID: parseInt(idActivity)
        });

    }

    return (
        <>
        <NavBar />

        <Container>
            <Form onSubmit={handleSubmit} className='FormMemberCreate'>
            <InputText atribute="Document name" value={proof.documentName}/>
                
                <Row>
                    <Col>
                        <Form.Group controlId="memberID">
                            <Form.Label>Member</Form.Label>
                            <Form.Select
                            value={proof.memberID}
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
                        readOnly

                    />
                </Form.Group>

                    <Button onClick={() => setFileModal(proof)}>
                        <FaUpload />
                    </Button>

                <Form.Group  controlId="activityID">
                    <Form.Label>ActivityID</Form.Label>
                    <Form.Select
                    value={proof.activityID}
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

        <Modal show={showModal} onHide={closeModal} className="dataModal">
                <Modal.Header closeButton>
                    <Modal.Title>Set datafile on <br /> {proof.documentName}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type="file" size="lg"
                                name="file"
                                id="file"
                                onChange={setFile}
                            />
                        </Form.Group>
                        <hr />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );

}

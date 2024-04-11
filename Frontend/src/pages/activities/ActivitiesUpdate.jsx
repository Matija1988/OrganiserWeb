import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RoutesNames } from "../../constants";

import ActivitiesService from "../../services/ActivitiesService";
import ProjectService from "../../services/ProjectService";
import { getAlertMessages } from "../../services/httpService";

import moment from "moment";

import './activitiesStyle.css';
import NavBar from "../../components/NavBar";
import InputText from "../../components/InputText";
import DateAndTime from "../../components/DateAndTime";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import InputCheckbox from "../../components/InputCheckbox";
import InputTextAsTextArea from "../../components/InputTextAsTextArea";
import { AsyncTypeahead, TypeaheadRef } from "react-bootstrap-typeahead";
import MembersService from "../../services/MembersService";
import Actions from "../../components/Actions";
import { FaTrash } from "react-icons/fa";


export default function ActivitiesUpdate() {

    const [activity, setActivity] = useState({});

    const [project, setProject] = useState([]);
    const [projectID, setProjectID] = useState(0);

    const [Members, setMember] = useState();
    const [foundMember, setFoundMember] = useState([]);

    const [SearchName, setSearchedName] = useState('');

    const typeaheadRef = useRef(null);

    const routeParams = useParams();
    const navigate = useNavigate();

    const { showError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function fetchActivities() {
        showLoading();
        const response = await ActivitiesService.getByID('Activity', routeParams.id);
        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }
        let activity = response.data;
        activity.startTime = moment.utc(activity.dateStart).format('HH:mm');
        activity.startingDate = moment.utc(activity.dateStart).format('yyyy-MM-DD');
        activity.deadlineTime = moment.utc(activity.dateFinished).format('HH:mm');
        activity.deadlineDate = moment.utc(activity.dateFinished).format('yyyy-MM-DD');
        activity.acceptanceTime = moment.utc(activity.dateAccepted).format('HH:mm');
        activity.acceptanceDate = moment.utc(activity.dateAccepted).format('yyyy-MM-DD');
        delete activity.dateStart;
        delete activity.dateFinished;
        delete activity.dateAccepted;
        setActivity(activity);
        setProjectID(activity.ProjectID);
        hideLoading();

    }

    async function fetchProject() {
        showLoading();
        const response = await ProjectService.read('Project');
        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }
        setProject(response.data);
        setProjectID(response.data[0].id);
        hideLoading();
    }

    async function fetchActivityMember() {
        showLoading();
        const response = await ActivitiesService.getActivityMembers(routeParams.id);
        if(!response.ok){
            showError(response.data);
            hideLoading();
            return;
        }
        setMember(response.data);
        hideLoading();
            
    }

    async function SearchMemberByName(input) {
        showLoading();
        const response = await MembersService.searchMemberByName(input);
        if(!response.ok){
           hideLoading();
           showError(response.data);
           return;
        } 
        setFoundMember(response.data);
        setSearchedName(input);
        hideLoading();
    }

    async function load() {
        showLoading();
        await fetchActivityMember();
        await fetchActivities();
        await fetchProject();
        hideLoading();
    }

    useEffect(() => { load(); }, []);

    async function AssignMemberToActivity(e) {
        showLoading();
        const response = await ActivitiesService.assignMemberToActivity(routeParams.id, e[0].id);
        if(response.ok) {
            fetchActivityMember();
            hideLoading();
            return;
        }
        showError(response.data);
        hideLoading();
    }

    async function RemoveMemberFromActivity(e, member) {
        const response = await ActivitiesService.removeMemberFromActivity(e, member);
        if(response.ok) {
            await fetchActivityMember();
            return;
        }
        showError(response.data);
        
    }

    function MemberStatusDisplayText(member) {
        if (member.isTeamLeader == null) return 'No input';
        if (member.isTeamLeader) return 'Team leader';
        return 'Member';
    }


    async function UpdateActivity(activity) {
        showLoading();
        const reply = await ActivitiesService.update('Activity', routeParams.id, activity);
        if (reply.ok) {
            navigate(RoutesNames.ACTIVITIES_READ);
            hideLoading();
            return;
        }
        showError(reply.data);
        hideLoading();
        
    }

    function handleSubmit(e) {

        e.preventDefault();

        const information = new FormData(e.target);

        const startingDate = moment.utc(information.get('dateStart') + ' ' + information.get('startTime'));
        const deadlineDate = moment.utc(information.get('datefinish') + ' ' + information.get('deadlineTime'));
        const acceptanceDate = moment.utc(information.get('dateaccepted') + ' ' + information.get('acceptanceTime'));

        if(startingDate > deadlineDate) {
            alert("Activity cannot start after it ends!!! Check your input!!!");
            return;
        }

        if(startingDate > acceptanceDate) {
            alert("Activity cannot be accepted before it starts!!! Check your input!!!");
            return;
        }

        var today = new Date();

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
       
        console.log("Date now " + today);

        let checkFinished = new Boolean(information.get('isFinished') =='on' ? true : false); 

        if((today < startingDate) && (checkFinished == true)) {
            alert("Activity cannot end before it begins!!! Check your input!!!");
            checkFinished = false;
            return;
        }

        UpdateActivity({
            activityName: information.get('Activity'),
            description: information.get('Description'),
            dateStart: startingDate,
            dateFinish: deadlineDate,
            isFinished: information.get('isFinished') == 'on' ? true : false,
            dateAccepted: acceptanceDate,
            ProjectID: parseInt(projectID)
        });

    }

    return (
        <>
            <NavBar />
            <Container>
                <Form onSubmit={handleSubmit} className='FormActivity'>

                    <Row>
                        <Col key='1'>

                            <InputText atribute="Activity" value={activity.activityName} />
                            <InputTextAsTextArea atribute="Description" value={activity.description} />

                            <Row>
                                <Col>
                                    <Form.Group controlId="dateStart">
                                        <Form.Label>Date start</Form.Label>
                                        <Form.Control
                                            type='date'
                                            name='dateStart'
                                            defaultValue={activity.startingDate}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Start time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name='startTime'
                                            defaultValue={activity.startTime}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="datefinish">
                                        <Form.Label>Deadline</Form.Label>
                                        <Form.Control
                                            type='date'
                                            name='datefinish'
                                            defaultValue={activity.deadlineDate}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Deadline time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name='deadlineTime'
                                            defaultValue={activity.deadlineTime}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <InputCheckbox atribute="isFinished" value={activity.isFinished} />
                            <Row>
                        <Col>
                            <Form.Group controlId="dateaccepted">
                                <Form.Label>Date accepted</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateaccepted'
                                    defaultValue={activity.acceptanceDate}

                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Acceptance time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name='acceptanceTime'
                                    defaultValue={activity.acceptanceTime}
                                />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col key='2'>
                            <Row>
                            <Form.Label>Members</Form.Label>
                            </Row>
                            <AsyncTypeahead
                            className="autocomplete"
                            id='condition'
                            emptyLabel='No result'
                            searchText='Searching'
                            labelKey={(member) => `${member.firstName} ${member.lastName}`}  
                            minLength={3}
                            options={foundMember}
                            onSearch={SearchMemberByName}
                            placeholder="Part of first or last name"
                            renderMenuItemChildren={(member) =>(
                                <>
                                <span>
                                    {member.firstName} {member.lastName}
                                </span>
                                </>
                            )}  
                            onChange={AssignMemberToActivity}
                            ref={typeaheadRef}
                            />
                            <Table striped bordered hover responsive variant="dark" className="tableStyle">

                                <thead>

                                    <tr>
                                        <th>Member</th>
                                        <th>Position</th>
                                        <th>Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {Members && Members.map((member, index) => (
                                        <tr key={index}>
                                            <td>{member.firstName + " " + member.lastName}</td>
                                            <td>{MemberStatusDisplayText(member)}</td>
                                            <td>
                                                <Button
                                                    onClick={() => RemoveMemberFromActivity(routeParams.id, member.id)}>
                                                    <FaTrash />
                                                </Button>

                                            </td>

                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    
                    <Form.Group controlId='project'>
                        <Form.Label>Associated project</Form.Label>
                        <Form.Select
                            value={projectID}
                            onChange={(e) => { setProjectID(e.target.value) }}
                        >
                            {project && project.map((e, index) => (
                                <option key={index} value={e.id}>{e.projectName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Actions cancel={RoutesNames.ACTIVITIES_READ} action="UPDATE ACTIVITY"/>

                </Form>
            </Container>
        </>
    );

}

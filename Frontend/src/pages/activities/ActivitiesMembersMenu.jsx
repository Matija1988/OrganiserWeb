import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, FormLabel, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";

import './activitiesStyle.css';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import MembersService from "../../services/MembersService";

import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import { FaTrash } from "react-icons/fa";
import Actions from "../../components/Actions";
import { RoutesNames } from "../../constants";



export default function ActivitiesMembersMenu() {

    const navigate = useNavigate();

    const [Members, setMember] = useState();
    const [foundMember, setFoundMember] = useState([]);

    const [SearchName, setSearchedName] = useState('');

    const routeParams = useParams();

    const typeaheadRef = useRef(null);

    const {showError} = useError();

    const {showLoading, hideLoading} = useLoading();

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
    
    

    async function AssignMemberToActivity(e) {
        showLoading();
        const response = await ActivitiesService.assignMemberToActivity(routeParams.id, e[0].id);
        if(response.ok) {
            await fetchActivityMember();
            hideLoading();
            return;
        }
        showError(response.data);
        hideLoading();
    }

    async function load() {
        showLoading();
        await fetchActivityMember();
        hideLoading();
    }

    useEffect(() => {
        load();
    }, []);

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

    async function update(e) {
        showLoading();
        const response = await ActivitiesService.update('Activity', routeParams.id, e);
        if(response.ok) {
            navigate(RoutesNames.PROJECTS_READ);
            hideLoading();
            return;
        }
        hideLoading();
        showError(response.data);
        
    }



    return (
        <>
        <NavBar />
        <Container>
            <Row>
                <Col>
                <label className="searchLabel">Members assigned to an activity</label>
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
                                    onClick={()=> RemoveMemberFromActivity(routeParams.id, member.id)}>
                                        <FaTrash />
                                    </Button>

                                    </td>

                                </tr>
                            )
                            )} 
                        </tbody>
                    </Table>
                </Col>
                <Col>
                <Form.Group controlId="condition">
                    
                    <AsyncTypeahead
                    className="autocomplete"
                    id="condition"
                    emptyLabel = "No result"
                    searchText = "Searching ..."
                    labelKey={(member) => `${member.firstName} ${member.lastName}`}
                    minLength={3}
                    options={foundMember}
                    onSearch={SearchMemberByName}
                    placeholder="Search member"
                    renderMenuItemChildren={(member)=>(
                        <>
                        <span>
                            {member.firstName} {member.lastName}
                        </span>
                        </>
                    )}
                    onChange={AssignMemberToActivity}
                    ref={typeaheadRef}
                    > 
                        
                    </AsyncTypeahead>
                </Form.Group>

                </Col>    
            </Row>
        <Actions cancel={RoutesNames.PROJECTS_READ} action="TEMP"/>
        </Container>
        </>
    );

}
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";

import './activitiesStyle.css';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import MembersService from "../../services/MembersService";
import { ALIGN_VALUES } from "react-bootstrap-typeahead/types/constants";
import { getAlertMessages } from "../../services/httpService";



export default function ActivitiesMembersMenu() {

    const navigate = useNavigate();

    const [Members, setMember] = useState();
    const [SearchedMember, setSearchedMember] = useState([]);

    const [SearchName, setSearchedName] = useState('');

    const routeParams = useParams();

    const typeaheadRef = useRef(null);

    async function fetchActivityMember() {

        await ActivitiesService.getActivityMembers(routeParams.id)
            .then((res) => {
                setMember(res.data)
            }).catch((e) => {
                alert.e
            });
    }

    async function SearchMemberByName(input) {
        const response = MembersService.searchMemberByName(input);
        if(!response.ok){
           alert(getAlertMessages(response.data));
           return;
        } 
        setSearchedMember(response.data);
        setSearchedName(input);
    }

    async function AssignMemberToActivity(e) {
        const response = await ActivitiesService.AssignMemberToActivity(routeParams.id, e[0].id);
        if(response.ok) {
            await fetchActivityMember();
            return;
        }
        alert(getAlertMessages(response.data));
    }

    async function addMemberManually(member) {
        const response = await MembersService.createMember(member);
        if(response.ok) {
            const response2 = await ActivitiesService.AssignMemberToActivity(routeParams.id, response.data.id);
            if(response2?.ok) {
                typeaheadRef.current.clear();
                await fetchActivityMember();
                return;
            } alert(getAlertMessages(response2.data));
            return;
        } alert(getAlertMessages(response.data));
    }

    useEffect(() => {
        fetchActivityMember();
    }, []);

    function MemberStatusDisplayText(member) {
        if (member.isTeamLeader == null) return 'No input';
        if (member.isTeamLeader) return 'Team leader';
        return 'Member';
    }

    // async function SearchMember (condition) {
    //     const response = await MembersService.SearchMember
    // }



    return (
        <Container>
            <Row>
                <Col>
                    <Table striped bordered hover responsive variant="dark" className="tableStyle">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Email</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                         <tbody>
        
                            {Members && Members.map((member, index) => (
                                <tr key={index}>
                                    <td>{member.firstName + " " + member.lastName}</td>
                                    <td>{member.email}</td>
                                    <td>{MemberStatusDisplayText(member)}</td>

                                </tr>

                            )
                            )} 


                        </tbody>
                    </Table>
                </Col>
                <Col>
                <FormGroup controlId="condition">
                    <FormLabel>Search member</FormLabel>
                    <AsyncTypeahead
                    className="autocomplete"
                    id="condition"
                    emptyLabel = "No result"
                    searchText = "Searching ..."
                    labelKey={(member) => `${member.firstName} ${member.lastName}`}
                    minLength={3}
                    options={SearchedMember}
                    onSearch={SearchMemberByName}
                    placeholder="Part of the member first or last name"
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
                </FormGroup>
                </Col>
                <Col>
                <Button onClick={addMemberManually}>
                    ADD
                </Button>
                </Col>
            </Row>
           
        </Container>
    );

}
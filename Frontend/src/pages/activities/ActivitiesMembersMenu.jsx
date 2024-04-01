import { useEffect, useState } from "react";
import { Col, Container, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";

import './activitiesStyle.css';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import MembersService from "../../services/MembersService";



export default function ActivitiesMembersMenu() {

    const navigate = useNavigate();

    const [Members, setMember] = useState();
    const [SearchedMember, setSearchedMember] = useState([]);

    const [SearchName, setSearchedName] = useState('');

    const routeParams = useParams();

    async function fetchActivityMember() {

        await ActivitiesService.getActivityMembers(routeParams.id)
            .then((res) => {
                setMember(res.data)
            }).catch((e) => {
                alert.e
            });
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
                     
                    
                    > 
                        
                    </AsyncTypeahead>
                </FormGroup>
                </Col>
            </Row>
        </Container>
    );

}
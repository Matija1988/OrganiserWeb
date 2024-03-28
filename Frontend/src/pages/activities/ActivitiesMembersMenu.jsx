import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ActivitiesService from "../../services/ActivitiesService";

import './activitiesStyle.css';



export default function ActivitiesMembersMenu() {

    const navigate = useNavigate();

    const [Members, setMember] = useState();

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
                                    <td>{member.firstName}</td>
                                    <td>{member.email}</td>
                                    <td>{member.isTeamLeader}</td>

                                </tr>

                            )
                            )}


                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );

}
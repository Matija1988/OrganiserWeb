import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MembersService from "../../services/MembersService";
import { Container, Button, Table, InputGroup } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

import './membersStyle.css';


export default function Members() {

    const [Members, setMembers] = useState();
    const [search, setSearch] = useState("");

    let navigate = useNavigate();

    async function fetchMembers() {
        const response = await MembersService.getMembers();
        if(!response.ok){
            alert(getAlertMessages(response.data));
            return;
        }
        setMembers(response.data);
     }

    useEffect(() => {
        fetchMembers();
    }, []);

    async function deleteMember(id) {
        const reply = await MembersService.deleteMember(id)

        if (reply.ok) {
            fetchMembers();
        } else {
            alert(reply.message);
        }
    }

    
    function MemberStatusDisplayText(member) {
        if (member.isTeamLeader == null) return 'No input';
        if (member.isTeamLeader) return 'Team leader';
        return 'Member';
    }

    return (

        <Container>
            <Link to={RoutesNames.MEMBERS_CREATE} className="btn btn-success gumb" >
                <IoIosAdd size={25} /> ADD
            </Link>
            
            <Form>
                    <InputGroup>
                    <Form.Control 
                    placeholder="Search member by name or email..."
                    onChange ={(e) => setSearch(e.target.value)}
                    className="searchLabel" />
                    </InputGroup>
            </Form>
            <Table striped bordered hover responsive variant="dark" className="tableStyle"> 
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Members && Members.filter((Members)=>{
                        return search === '' ? Members : Members.firstName.includes(search)
                        || search === '' ? Members : Members.lastName.includes(search)
                        || search === '' ? Members : Members.email.includes(search);
                    }).map((member, index) =>(
                    <tr key={index}>
                        <td>{member.firstName}</td>
                        <td>{member.lastName}</td>
                        <td>{member.username}</td>
                        <td>{member.password}</td>
                        <td>{Text = MemberStatusDisplayText(member)}</td>
                        <td>{member.email}</td>
                        <td className="alignCenter">
                            <Button className="editBtn"
                            variant="primary"
                            onClick={() =>{navigate(`/members/${member.id}`)}}
                            >
                                <FaEdit 
                                size={25}
                                />
                            </Button>

                            <Button className="trashBtn"
                            variant="danger"
                            onClick={()=> deleteMember(member.id)}
                            >
                            <FaTrash  
                            size = {25}
                            />
                            </Button>

                        </td>

                    </tr>
                ))}
            </tbody>
            </Table>

        </Container>

    );

}
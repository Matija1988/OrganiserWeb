import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MembersService from "../../services/MembersService";
import { Container, Button, Table, InputGroup, Row, Col } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';

import './membersStyle.css';
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import DeleteModal from "../../components/DeleteModal";


export default function Members() {

    const [Members, setMembers] = useState();
    const [search, setSearch] = useState("");

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entityID, setEntityID] = useState();

    let navigate = useNavigate();

    async function fetchMembers() {
        showLoading();
        const response = await MembersService.read('Member');
        if(!response.ok){
            hideLoading();
            showError(response.data);
            return;
        }
        setMembers(response.data);
        hideLoading();
     }

    useEffect(() => {
        fetchMembers();
    }, []);

    async function deleteMember(id) {
        showLoading();
        const response = await MembersService.remove('Member', id)
        if (response.ok) {
            fetchMembers();
            hideLoading();
        } else {     
            showError(response.data);
        }
        hideLoading();
    }

    
    function MemberStatusDisplayText(member) {
        if (member.isTeamLeader == null) return 'No input';
        if (member.isTeamLeader) return 'Team leader';
        return 'Member';
    }

    return (
        <>
        <NavBar />
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
                <tr className="projectTableHead">
                    <th>Member</th>
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
                        <td>{member.firstName + " " + member.lastName}</td>
                      
                        <td>{Text = MemberStatusDisplayText(member)}</td>
                        <td>{member.email}</td>
                        <td className="alignCenter">
                            <Row>
                                <Col>
                            <Button className="editBtn"
                            variant="primary"
                            onClick={() =>{navigate(`/members/${member.id}`)}}
                            >
                                <FaEdit 
                                size={25}
                                />
                            </Button>
                            </Col>
                            <Col>
                            <Button className="trashBtn"
                            variant="danger"
                            onClick={()=> (setEntityID(member.id), setShowDeleteModal(true))}
                            >
                            <FaTrash  
                            size = {25}
                            />
                            </Button>
                            </Col>
                            </Row>
                        </td>

                    </tr>
                ))}
            </tbody>
            </Table>

        </Container>
        <DeleteModal 
            show={showDeleteModal}
            handleClose={()=>setShowDeleteModal(false)}
            handleDelete={()=> (deleteMember(entityID), setShowDeleteModal(false))}
            
            />
        </>
    );

}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProofsService from "../../services/ProofsService";
import { Container, Button, Table, InputGroup } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import moment from "moment";
import Form from 'react-bootstrap/Form';



import './proofsStyle.css';


export default function Proofs() {

    const [Proofs, setProofs] = useState();
    
    const [search, setSearch] = useState("");
    
    let navigate = useNavigate();

    async function fetchProofs() {

        await ProofsService.getProofs()
            .then((res) => {
                setProofs(res.data)
            })
            .catch((e) => {
                alert(e);
            });
    }

    function FormatDateCreated(proof) {
        return  proof.datecreated == null ? 'Not defined' :
        moment.utc(proof.datecreated).format('DD.MM.YYYY.')
       }

    useEffect(() => {
        fetchProofs();
    }, []);

    async function deleteProofs(id) {
        const reply = await ProofsService.deleteProof(id)

        if (reply.ok) {
            fetchProofs();
        } else {
            alert(reply.message);
        }
    }

    return (

        <Container>
            <Link to={RoutesNames.PROOFS_CREATE} className="btn btn-success gumb" >
                <IoIosAdd size={25} /> ADD
            </Link>
            <Form>
                    <InputGroup>
                    <Form.Control 
                    placeholder="Search proofs by document name or member..."
                    onChange ={(e) => setSearch(e.target.value)}
                    className="searchLabel" />
                    </InputGroup>
            </Form>
            <Table striped bordered hover responsive variant="dark" className="tableStyle"> 
            <thead>
                <tr>
                    <th>Document</th>
                    <th>Member</th>
                    <th>Location</th>
                    <th>Date created</th>
                    <th>For activity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {Proofs && Proofs.filter((Proofs)=>{
                        return search.toLowerCase() === '' ? Proofs : Proofs.documentName.toLowerCase().includes(search)
                        || search.toLowerCase() === '' ? Proofs : Proofs.member.toLowerCase().includes(search);
                    }).map((proof, index) =>(
                    <tr key={index}>
                        <td>{proof.documentName}</td>
                        <td>{proof.member}</td>
                        <td>{proof.location}</td>
                        <td>
                            {FormatDateCreated(proof)}
                        </td>
                        <td>{proof.activity}</td>
                        <td className="alignCenter">
                            <Button className="editBtn"
                            variant="primary"
                            onClick={() =>{navigate(`/proofs/${proof.id}`)}}
                            >
                                <FaEdit 
                                size={25}
                                />
                            </Button>

                            <Button className="trashBtn"
                            variant="danger"
                            onClick={()=> deleteProofs(proof.id)}
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
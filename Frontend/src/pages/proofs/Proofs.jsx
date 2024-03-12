import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProofsService from "../../services/ProofsService";
import { Container, Button, Table } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';

import './proofsStyle.css';


export default function Proofs() {

    const [Proofs, setProofs] = useState();
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

    const formatDateCreated = (proof) => {
        const date = new Date(proof.dateCreated);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    };


    return (

        <Container>
            <Link to={RoutesNames.PROOFS_CREATE} className="btn btn-success gumb" >
                <IoIosAdd size={25} /> ADD
            </Link>
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
                {Proofs && Proofs.map((proof, index) =>(
                    <tr key={index}>
                        <td>{proof.documentName}</td>
                        <td>{proof.memberID}</td>
                        <td>{proof.location}</td>
                        <td>{formatDateCreated(proof)}</td>
                        <td>{proof.activityID}</td>
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
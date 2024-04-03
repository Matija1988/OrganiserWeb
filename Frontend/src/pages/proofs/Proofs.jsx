import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProofsService from "../../services/ProofsService";
import { Container, Button, Table, InputGroup, Modal } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import moment from "moment";
import Form from 'react-bootstrap/Form';



import './proofsStyle.css';
import { getAlertMessages } from "../../services/httpService";


export default function Proofs() {

    const [Proofs, setProofs] = useState();

    const [search, setSearch] = useState("");

    const [pickedEntity, setPickedEntity] = useState({});
    const [showModal, setShowModal] = useState(false);

    let navigate = useNavigate();

    async function fetchProofs() {
        const response = await ProofsService.getProofs();
        if (!response.ok) {
            alert(getAlertMessages(response.data));
            return;
        }
        setProofs(response.data);
    }

    function FormatDateCreated(proof) {
        return proof.datecreated == null ? 'Not defined' :
            moment.utc(proof.datecreated).format('DD.MM.YYYY.')
    }


    async function deleteProofs(id) {
        const response = await ProofsService.deleteProof(id);

        if (response.ok) {
            fetchProofs();
        } else {
            alert(getAlertMessages(response.data));
        }

    }

    useEffect(() => {
        fetchProofs();
    }, []);

    function setFileModal(proof) {
        setPickedEntity(proof);
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
            const response = await ProofsService.uploadFile(pickedEntity.id, formData, config);
            alert(getAlertMessages(response.data));
            if (response.ok) {
                fetchProofs();
                setShowModal(false);
            }

        }
    }

    return (
        <>
            <Container>
                <Link to={RoutesNames.PROOFS_CREATE} className="btn btn-success gumb" >
                    <IoIosAdd size={25} /> ADD
                </Link>
                <Form>
                    <InputGroup>
                        <Form.Control
                            placeholder="Search proofs by document name or member..."
                            onChange={(e) => setSearch(e.target.value)}
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
                        {Proofs && Proofs.filter((Proofs) => {
                            return search.toLowerCase() === '' ? Proofs : Proofs.documentName.toLowerCase().includes(search)
                                || search.toLowerCase() === '' ? Proofs : Proofs.memberName.toLowerCase().includes(search);
                        }).map((proof, index) => (
                            <tr key={index}>
                                <td>{proof.documentName}</td>
                                <td>{proof.memberName}</td>
                                <td>{proof.location}</td>
                                <td>
                                    {FormatDateCreated(proof)}
                                </td>
                                <td>{proof.activityName}</td>
                                <td className="alignCenter">
                                    <Button className="editBtn"
                                        variant="primary"
                                        onClick={() => { navigate(`/proofs/${proof.id}`) }}
                                    >
                                        <FaEdit
                                            size={25}
                                        />
                                    </Button>

                                    <Button className="trashBtn"
                                        variant="danger"
                                        onClick={() => deleteProofs(proof.id)}
                                    >
                                        <FaTrash
                                            size={25}
                                        />
                                    </Button>

                                    <Button onClick={() => setFileModal(proof)}>
                                        <FaUpload />
                                    </Button>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={closeModal} className="dataModal">
                <Modal.Header closeButton>
                    <Modal.Title>Set datafile on <br /> {pickedEntity.documentName}</Modal.Title>
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
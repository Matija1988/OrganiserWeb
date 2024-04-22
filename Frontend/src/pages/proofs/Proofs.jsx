import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProofsService from "../../services/ProofsService";
import { Container, Button, Table, InputGroup, Modal, Row, Col, Pagination } from "react-bootstrap";
import { RoutesNames } from "../../constants";
import { IoIosAdd } from 'react-icons/io';
import { FaDownload, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import moment from "moment";
import Form from 'react-bootstrap/Form';



import './proofsStyle.css';
import { getAlertMessages } from "../../services/httpService";
import NavBar from "../../components/NavBar";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";
import DeleteModal from "../../components/DeleteModal";
import TablePagination from "../../components/TablePagination";


export default function Proofs() {

    const [Proofs, setProofs] = useState();
    const [ProofName, setProofName] = useState('');
    const [ProofID, setProofID] = useState();

    const [search, setSearch] = useState("");

    const [pickedEntity, setPickedEntity] = useState({});
    const [showModal, setShowModal] = useState(false);

    const {showError} = useError();
    const {showLoading, hideLoading} = useLoading();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entityID, setEntityID] = useState();

    const [page, setPage] = useState(1);

    const [condition, setCondtion] = useState('');
    const [totalEntities, setTotalEntities] = useState();
    
    let navigate = useNavigate();

    async function fetchProofs() {
        showLoading();

        const response = await ProofsService.getPagination(page, condition);
        const proofsResponse = await ProofsService.read('Proof');

        if(!response.ok) 
        {
            showError(response.data);
            hideLoading();
            return;
        }
        if(response.data.length==0) {
            setPage(1);
            hideLoading();
            return;
        }
        setProofs(response.data);
        setTotalEntities(proofsResponse);
        hideLoading();
    }

    function FormatDateCreated(proof) {
        return proof.datecreated == null ? 'Not defined' :
            moment.utc(proof.datecreated).format('DD.MM.YYYY.')
    }


    async function deleteProofs(id) {
        showLoading();
        const response = await ProofsService.remove('Proof', id);

        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }
        fetchProofs();
        hideLoading();

    }


    useEffect(() => {
        fetchProofs();

    }, [page, condition]);

    function setFileModal(proof) {
        setPickedEntity(proof);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    async function setFile(e) {
        showLoading();
        if (e.currentTarget.files) 
        {
            const formData = new FormData();
            formData.append('file', e.currentTarget.files[0]);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            const response = await ProofsService.uploadFile(pickedEntity.id, formData, config);
            hideLoading();
            alert(getAlertMessages(response.data));
            if (response.ok) {
                fetchProofs();
                setShowModal(false);
            }
        }
    }

    
    function onDownloadClick(id, name) {
        showLoading();
          setProofID(id);
          setProofName(name);
         download(id, name);
         hideLoading();
      
      }

    
    async function download(id, name) {
        showLoading();

        console.log("ID ID ID:" + id);

        const response = await ProofsService.downloadFile(id);
        if (!response.ok) {
            hideLoading();
            showError(response.data);
            return;
        }

        console.log("Response is " + response.data);

        try {
            showLoading();
            const url = window.URL.createObjectURL(new Blob([response.data]));
   
            const fileName = name;

            const link = document.createElement('a');

            link.href = url;

            link.setAttribute('download', fileName + '.pdf');
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            setProofName('');
            fetchProofs();
            hideLoading();
        }
        catch (error) {
            console.error('Error downloading file:', error);
        }
    }




    const totalPages = Math.ceil(totalEntities / 8);

    const handlePageChange = (page) => {
        
        if(page == 0) {
            setPage(1);
        }
        setPage(page);

    }

    function increasePage() {
        if(page > totalPages) {
            
            return;
        };
        if(page <=0) {
            setPage(1);
        }
        setPage(page + 1);
    }

    function decreasePage(){
        if(page<=1) {
            return;
        }
        setPage(page-1);
    }
    
    function changeCondition(e) {
        if(e.nativeEvent.key == "Enter") {
            setPage(1);
            setCondtion(e.nativeEvent.srcElement.value);
            setProofs([]);
        }
    }

    return (
        <>
        <NavBar />
            <Container className="mt-4">
                <Link to={RoutesNames.PROOFS_CREATE} className="btn btn-success gumb" >
                    <IoIosAdd size={25} /> ADD
                </Link>
                <Row>
                    <Col>
                        <Form>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search proofs by document name or member..."
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="searchLabel" />
                            </InputGroup>
                        </Form>
                    </Col>  
                    <Col>
                    <Form.Control className="searchLabel"
                    type = 'text'
                    name = 'search'
                    placeholder = 'Part of document name'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={changeCondition}
                    />
                    </Col>
                    <Col>
                    {Proofs && Proofs.length > 0 && (

                        <div style={{display: "flex", justifyContent:"center"}}>
                            <Pagination size="lg" className="pagination">
                            <Pagination.Prev onClick={decreasePage}/>
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={increasePage}/>
                            </Pagination>
                        </div>

                    )}
                    </Col>
                </Row>
                <Table striped bordered hover responsive variant="dark" className="tableStyle">
                    <thead className="projectTableHead">
                        <tr>
                            <th>Document</th>
                            <th>Member</th>
                            <th>Location</th>
                            <th>Date created</th>
                            <th>For activity</th>
                            <th className="tableProofAction">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Proofs && Proofs.filter((entity) => {
                            return search.toLowerCase() === '' ? entity : entity.documentName.toLowerCase().includes(search)
                                || search.toLowerCase() === '' ? entity : entity.memberName.toLowerCase().includes(search);
                        }).map((entity, index) => (

                            <tr key={index}>
                                <td>{entity.documentName}</td>
                                <td>{entity.memberName}</td>
                                <td>{entity.location}</td>
                                <td>
                                    {FormatDateCreated(entity)}
                                </td>
                                <td>{entity.activityName}</td>
                                <td className="alignCenter">
                                   
                                    <Row>
                                        <Col>
                                            <Button className="editBtn"
                                                variant="primary"
                                                onClick={() => { navigate(`/proofs/${entity.id}`) }}
                                            >
                                                <FaEdit
                                                    size={15}
                                                />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button className="uploadFileBtn" onClick={() => setFileModal(entity)}>
                                                <FaUpload size={15} />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        <Button className="downloadBtn"
                                        onClick={()=> onDownloadClick(entity.id, entity.documentName)}
                                        >
                                            <FaDownload
                                                size={15}                
                                                />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button className="trashBtn"
                                                variant="danger"
                                                onClick={() => (setEntityID(entity.id), setShowDeleteModal(true))}
                                            >
                                                <FaTrash
                                                    size={15}
                                                />
                                            </Button>
                                        </Col>
                                    </Row>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                <TablePagination 
                currentPage={page}
                totalPAges={totalPages}
                onPageChange={handlePageChange}
                />
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

            <DeleteModal 
            show={showDeleteModal}
            handleClose={()=>setShowDeleteModal(false)}
            handleDelete={()=> (deleteProofs(entityID), setShowDeleteModal(false))}
            
            />
        </>
    );

}
import { Button, Col, Modal, Row } from "react-bootstrap";


export default function DeleteModal({show, handleClose,  handleDelete}) {

    return (

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                CONFIRM ACTION
            </Modal.Header>
            <Modal.Body>
                This action will delete this entry! 
                If the entry cannot be deleted it is connected to other entities in the database!
                
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={handleClose}>CLOSE</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={handleDelete}>CONFIRM</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>

    );

}
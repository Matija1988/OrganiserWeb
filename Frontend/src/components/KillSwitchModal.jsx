import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Modal.css";

export default function KillSwitchModal({show, handleClose,  handleKill}) {
        const [entityName, setEntityName] = useState("");

        const handleInput = (event) => {
            setEntityName(event.target.value);
        };

        const handleConfirm = () => {
            if(entityName.trim() !=="") {
                handleKill(entityName);
                setEntityName("");
                handleClose();
            }
        }


    return (

        <Modal show={show} onHide={handleClose} centered closeButton>
            <Modal.Header closeButton className="modalHeader">
                DANGER!!!!
            </Modal.Header>
            <Modal.Body className="modalBody">
                This action will delete this entry and all other entries connected to it! 
                Enter the name of the project you wish to delete along with its connected entities!
                <Form.Group controlID="entityName">
                    <Form.Label className='labelAtribute'>Project name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter project name" 
                    value={entityName} onChange ={handleInput}
                    />
                </Form.Group>
                
            </Modal.Body>
            <Modal.Footer className="modalFooter">
                <Row>
                    <Col>
                        <Button variant="primary" onClick={handleClose}>CLOSE</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={handleConfirm}>CONFIRM</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>

    );

}
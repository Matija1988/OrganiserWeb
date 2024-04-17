import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";


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

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                DANGER!!!!
            </Modal.Header>
            <Modal.Body>
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
            <Modal.Footer>
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
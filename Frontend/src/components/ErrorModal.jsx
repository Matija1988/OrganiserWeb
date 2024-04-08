import { Modal, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import { useState } from "react";


export default function ErrorModal({show, onHide, errors}) {


    
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Whatever you did ... do it again!!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {errors && console.map((e, i) =>(
                        <li key={i}>{e.message}</li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick ={onHide}>
                    CLOSE
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ErrorModal.propTypes ={
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    error: PropTypes.array,
}
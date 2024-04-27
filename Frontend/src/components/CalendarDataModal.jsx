import { Button, Col, Container, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { RoutesNames } from "../constants";
import { useEffect, useState } from "react";
import useLoading from "../hooks/useLoading";
import useError from "../hooks/useError";
import ActivitiesService from "../services/ActivitiesService";
import { IoCodeSlashOutline } from "react-icons/io5";

export default function CalendarDataModal({ show, handleClose, name, description, id, member }) {

    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    
    return (
        <Modal show={show} onHide={handleClose} centered backdrop>
            <Modal.Header closeButton className="modalHeaderCalendar">
                {name}
            </Modal.Header>
            <Modal.Body className="modalBody">
                <ul>
                    {description}
                </ul>
                <ul>
                    {member && member.map((mem, index) =>
                        <li key={index}>{mem.firstName} {mem.lastName}</li>)}
                </ul>
            </Modal.Body>
            <Modal.Footer className="modalFooter">
                <Col>
                    <Button variant="primary" onClick={handleClose}>CLOSE</Button>
                </Col>
            </Modal.Footer>
        </Modal>

    );
}

CalendarDataModal.propTypes = {
    show: PropTypes.bool.isRequired,


}
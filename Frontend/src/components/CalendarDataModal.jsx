import { Button, Col, Container, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { RoutesNames } from "../constants";
import { useEffect, useState } from "react";
import useLoading from "../hooks/useLoading";
import useError from "../hooks/useError";
import ActivitiesService from "../services/ActivitiesService";

export default function CalendarDataModal({show, handleClose, name, description, id}) {
    
    const [member, setMember] = useState();

    const {showLoading, hideLoading} = useLoading();
    const {showError} = useError();

    async function fetchMembers() {
        showLoading();
        const response = await ActivitiesService.getActivityMembers(id);
        if(!response.ok) {
            showError(response.data);
            return;
        }
        setMember(response.data);
        hideLoading();
    }

    useEffect(() => {
        fetchMembers();
     },[]);

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
                        {member && member.map((member, index)=>
                    <li key={index}>{member.firstName} {member.lastName}</li>)}
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
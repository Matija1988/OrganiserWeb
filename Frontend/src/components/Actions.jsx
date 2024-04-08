import {Row, Col, Button } from "react-bootstrap";
import  PropTypes  from "prop-types";
import {Link} from 'react-router-dom';

export default function Actions({ cancel, action }) {
    return (
        <Row className="actions">
            <Col>
                <Link className="btn btn-danger"
                    to={cancel}>CANCEL</Link>
            </Col>
            <Col>
                <Button
                    variant="primary"
                    type="submit"
                >{action}</Button>
            </Col>
        </Row>
    );
}

Actions.propTypes = {
    cancel: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
}
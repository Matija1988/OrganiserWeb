import { Col, Row, Form } from "react-bootstrap";
import PropTypes from 'prop-types';


export default function DateAndTime({atributeDate, valueDate, atributeTime, valueTime}) {
    return (
        <Row>
            <Col>
                <Form.Group>
                    <Form.Label className="labelDate">{atributeDate}</Form.Label>
                    <Form.Control 
                    type = 'date'
                    name ={atributeDate}
                    defaultValue ={valueDate}
                    />
                </Form.Group>
            </Col>
            <Col>
            <Form.Group>
                    <Form.Label className="labelTime">{atributeTime}</Form.Label>
                    <Form.Control 
                    type = 'time'
                    name ={atributeTime}
                    defaultValue ={valueTime}
                    />
                </Form.Group>
            </Col>
        </Row>
    );

}

DateAndTime.propTypes={
    atributeDate: PropTypes.DateTime,
    valueTime: PropTypes.DateTime,
    atributeTime: PropTypes.DateTime,
    valueTime: PropTypes.DateTime
}
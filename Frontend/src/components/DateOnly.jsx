import {  Form } from "react-bootstrap";
import PropTypes from 'prop-types';


export default function DateOnly({atributeDate, valueDate}) {
    return (
        
                <Form.Group>
                    <Form.Label className="labelDate">{atributeDate}</Form.Label>
                    <Form.Control 
                    type = 'date'
                    name ={atributeDate}
                    defaultValue ={valueDate}
                    />
                </Form.Group>
            
    );

}

DateOnly.propTypes={
    atributeDate: PropTypes.DateTime,
    valueDate: PropTypes.instanceOf(),
}
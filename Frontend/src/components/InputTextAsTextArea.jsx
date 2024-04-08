import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function InputTextAsTextArea({atribute, value}) {
    return(
        <Form.Group>
            <Form.Label className='labelAtribute'>{atribute}</Form.Label>
            <Form.Control 
            as ="textarea"
            rows= {5}
            name ={atribute}
            defaultValue ={value}
            /> 
        </Form.Group>
    );
}

InputTextAsTextArea.propTypes ={
    atribute: PropTypes.string.isRequired,
    value: PropTypes.any,
}
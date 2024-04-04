import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function InputCheckbox({atribute, value}) {
    return (
        <Form.Group controlId={atribute}>
            <Form.Check
            className='labelAtribute'
            label={atribute}
            name={atribute}
            defaultChecked={value}
            />
        </Form.Group>
    );
}

InputCheckbox.propTypes = {
    atribute: PropTypes.string.isRequired,
    value: PropTypes.bool,
}
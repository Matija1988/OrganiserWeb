import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { RoutesNames } from '../constants';

import Projects from '../pages/projects/Projects';

function BlockExample() {

    const navigate = useNavigate();

    return (
        <div className="d-grid gap-2">
            <Button variant="primary" size="lg">
                
                SIGN IN
            </Button>

        </div>
    );
}

export default BlockExample;
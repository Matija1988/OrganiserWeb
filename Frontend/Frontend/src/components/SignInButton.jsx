import Button from 'react-bootstrap/Button';
import { RoutesNames } from '../constants';
import { useNavigate } from 'react-router-dom';

import './SignInButton.css';

function BlockExample() {

const navigate = useNavigate();


  return (
    <div className="d-grid gap-2">
      <Button variant="primary" size="lg" className='SignInButton' onClick={()=>navigate(RoutesNames.PROJECTS_READ)}>
        SIGN IN
      </Button>
     
    </div>
  );
}

export default BlockExample;
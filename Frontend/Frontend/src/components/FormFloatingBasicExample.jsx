import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import 'bootstrap/dist/css/bootstrap.min.css'




function FormFloatingBasicExample() {


  return (
    
   <Container fluid> 
      <FloatingLabel
        controlId="floatingUsername"
        label = "username"
        className="mb-3"
      >
        <Form.Control type="username" placeholder="username" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label = "password" >
        <Form.Control type="password"  placeholder="password" />
      </FloatingLabel>
              
      </Container>
    
  );
}

export default FormFloatingBasicExample;
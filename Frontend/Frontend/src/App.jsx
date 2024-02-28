import { useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import FormFloatingBasicExample from './components/FormFloatingBasicExample';
import '/style.css';

function App() {
  return (
    <>

      <Container>
        <div>

          <h1>C-project</h1>
          <h3>Launch your projects into cyberspace</h3>
        </div>
        <FormFloatingBasicExample id="FloatLogIn"/>
      </Container>
    </>
  );
}

export default App

import { useState } from 'react'
import Container from 'react-bootstrap/esm/Container';



import FormFloatingBasicExample from './components/FormFloatingBasicExample';
import SignInButton from './components/SignInButton';
import FrontPageText from './components/FrontPageText';

import "@fontsource/tomorrow";
import "@fontsource/rubik-doodle-shadow";

import '/style.css';



function App() {
  return (
    <>

      <Container>
        <div>

<FrontPageText></FrontPageText>
          {/* <h1>C-project</h1> */}
          {/* <h3>Launch your projects into cyberspace</h3> */}
        </div>
        <FormFloatingBasicExample id="FloatLogIn"/>
        <SignInButton></SignInButton>
      </Container>
      
    </>
  );
}

export default App
import { useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import BlockButton from './components/BlockButton'
import FormFloatingBasicExample from './components/FormFloatingBasicExample';
import '/style.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { RoutesNames } from './constants';

import Projects from './pages/projects/Projects';
import ProjectsAdd from './pages/projects/ProjectsAdd';

function App() {


  const navigate = useNavigate();

  return (
    <>
     
      <Container>
        <div>

          <h1>C-project</h1>
          <h3>Launch your projects into cyberspace</h3>
        </div>
        <FormFloatingBasicExample id="FloatLogIn" />
      
        
      </Container>
      
    
    </>
  );
}

export default App

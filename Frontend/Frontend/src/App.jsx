import { useState } from 'react'
import Container from 'react-bootstrap/esm/Container';

import Home from "./pages/Home";
import Projects from "./pages/projects/Projects";


import FormFloatingBasicExample from './components/FormFloatingBasicExample';
import SignInButton from './components/SignInButton';
import FrontPageText from './components/FrontPageText';

import "@fontsource/tomorrow";
import "@fontsource/rubik-doodle-shadow";

import '/style.css';
import { Route, Routes } from 'react-router-dom';
import { RoutesNames } from './constants';



function App() {
  return (
    <>

      <Container>
        <FrontPageText></FrontPageText>
        <FormFloatingBasicExample id="FloatLogIn" />
        <SignInButton />
      </Container>
      <Routes>
        <>
          <Route>
            <Route path={RoutesNames.HOME} element={<Home />} />
            <Route path={RoutesNames.PROJECTS_READ} element={<Projects />} /> 
          </Route>
        </>
      </Routes>

    </>

  )
}

export default App
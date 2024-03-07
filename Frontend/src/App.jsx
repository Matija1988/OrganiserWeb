import { Route, Routes } from 'react-router-dom';
import './App.css'

import { RoutesNames } from './constants';
import NavBar from './components/NavBar';
import Login from './components/Login';

import Home from './pages/home';
import Projects from './pages/projects/Projects';
import ProjectsCreate from './pages/projects/ProjectsCreate';
import ProjectsUpdate from './pages/projects/ProjectsUpdate';

import Members from './pages/members/Members';
import MembersCreate from './pages/members/MembersCreate';
import MembersUpdate from './pages/members/MembersUpdate';


import './style.css';


function App() {


  return (
    <>
      <NavBar />
      <Routes>
        <>

          <Route path={RoutesNames.HOME} element={<Home />} />
          <Route path={RoutesNames.PROJECTS_READ} element={<Projects />} />
          <Route path={RoutesNames.PROJECTS_CREATE} element={<ProjectsCreate />} />
          <Route path={RoutesNames.PROJECTS_UPDATE} element={<ProjectsUpdate />} />

          <Route path={RoutesNames.MEMBERS_READ} element={<Members />} />
          <Route path={RoutesNames.MEMBERS_CREATE} element={<MembersCreate />} />
          <Route path={RoutesNames.MEMBERS_UPDATE} element={<MembersUpdate />} />

        </>
      </Routes>
    </>
  );
}

export default App

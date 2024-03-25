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

import Activities from './pages/activities/Activities';
import ActivitiesCreate from './pages/activities/ActivitiesCreate';
import ActivitiesUpdate from './pages/activities/ActivitiesUpdate';

import Proofs from './pages/proofs/Proofs';
import ProofsCreate from './pages/proofs/ProofsCreate';
import ProofsUpdate from './pages/proofs/ProofsUpdate';

import ListProjectActivities from './pages/sorts/ListProjectActivities';


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

          <Route path={RoutesNames.ACTIVITIES_READ} element={<Activities />} />
           <Route path={RoutesNames.ACTIVITIES_CREATE} element={<ActivitiesCreate />} />
          <Route path={RoutesNames.ACTIVITIES_UPDATE} element={<ActivitiesUpdate />} /> 

          <Route path ={RoutesNames.PROOFS_READ} element={<Proofs />} />
          <Route path ={RoutesNames.PROOFS_CREATE} element={<ProofsCreate />} />
          <Route path={RoutesNames.PROOFS_UPDATE} element={<ProofsUpdate />} />

           <Route path ={RoutesNames.LIST_PROJECT_ACTIVITIES} element = {<ListProjectActivities />} />
   
        </>
      </Routes>
    </>
  );
}

export default App

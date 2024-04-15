import { Route, Routes } from 'react-router-dom';

import { RoutesNames } from './constants';
import NavBar from './components/NavBar';
import Login from './pages/Login';

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

import ListProjectActivities from './pages/projects/ListProjectActivities';
import ActivitiesMembersMenu from './pages/activities/ActivitiesMembersMenu';

import MainPanel from './pages/MainPanel';

import ErrorModal  from './components/ErrorModal';
import useError from './hooks/useError';
import LoadingSpinner from './components/LoadingSpinner';

import './style.css';
import useAuth from './hooks/useAuth';
import Killswitchpage from './pages/projects/Killswitchpage';




function App() {
  const { error, showErrorModal, hideError} = useError();
  const { isLoggedIn} = useAuth();

  return (
    <>
    <LoadingSpinner />
    <ErrorModal show={showErrorModal} errors={error} onHide={hideError}/>
      
      <Routes>
      <Route path={RoutesNames.HOME} element={<Home />} />       
        {isLoggedIn ? (
          <>
            <Route path={RoutesNames.MAIN_PANEL} element ={<MainPanel />} />
            <Route path={RoutesNames.PROJECTS_READ} element={<Projects />} />
            <Route path={RoutesNames.PROJECTS_CREATE} element={<ProjectsCreate />} />
            <Route path={RoutesNames.PROJECTS_UPDATE} element={<ProjectsUpdate />} />
            <Route path={RoutesNames.KILL_SWITCH_PAGE} element={<Killswitchpage />} />

            <Route path={RoutesNames.MEMBERS_READ} element={<Members />} />
            <Route path={RoutesNames.MEMBERS_CREATE} element={<MembersCreate />} />
            <Route path={RoutesNames.MEMBERS_UPDATE} element={<MembersUpdate />} />

            <Route path={RoutesNames.ACTIVITIES_READ} element={<Activities />} />
            <Route path={RoutesNames.ACTIVITIES_CREATE} element={<ActivitiesCreate />} />
            <Route path={RoutesNames.ACTIVITIES_UPDATE} element={<ActivitiesUpdate />} />

            <Route path={RoutesNames.PROOFS_READ} element={<Proofs />} />
            <Route path={RoutesNames.PROOFS_CREATE} element={<ProofsCreate />} />
            <Route path={RoutesNames.PROOFS_UPDATE} element={<ProofsUpdate />} />

            <Route path={RoutesNames.LIST_PROJECT_ACTIVITIES} element={<ListProjectActivities />} />
            <Route path={RoutesNames.ACTIVITIES_MEMBERS_MENU} element={<ActivitiesMembersMenu />} />

          </>
        ) : (
          <>
            <Route path={RoutesNames.LOGIN} element={<Login />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App

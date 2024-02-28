import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RoutesNames } from "../../constants";
import {ProjectService} from '../../services/ProjectService';



export default function Projects() {
    const [projects, setProjects] = useState();

    async function fetchProjects() {
        await ProjectService.getProjects()
            .then((res) => {
                setProjects(res.data);
            }).catch((e) => { alert(e); });
    }

    useEffect(()=>{
        fetchProjects();
    },[]);

    return (

        <Container>
            <Link to={RoutesNames.PROJECTS_NEW} className="btn btn-succes gumb">
                <IoIosAdd 
                size = {25}
                /> ADD
           </Link>
           <Table striped bordered hover responsive>
            <Thead>
                <tr>
                <th> Name </th>
                <th> Unique ID</th>
                <th> Date start</th>
                <th> Date end </th>
                <th> Status </th>
                </tr>


            </Thead>
            <tbody>
                {projects && projects.map((project, index)=>
                <tr key={index}>
                
                </tr>
                )}                

            </tbody>


           </Table>


        </Container>


    );

}

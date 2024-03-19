import { Container } from "react-bootstrap";


import "./home.css";
import Login from "../components/Login";

export default function Home() {

    return(

        <>
        <Container className="homeText">
            Welcome to C-project. 
            <Login />
           
        </Container>

        </>
    );
}
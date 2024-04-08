import { Container } from "react-bootstrap";

import "./home.css";
import Login from "./Login";
import NavBar from "../components/NavBar";


export default function Home() {

    return(

        <>
        <Container className="homeText"> 
         <Login />
        </Container>

        </>
    );
}
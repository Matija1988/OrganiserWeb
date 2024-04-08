import { FormLabel, Container, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";

import "./home.css";




export default function MainPanel() {

    return(
        <>
        <NavBar />
        <Container > 
         <Form.Label className="homeText">U IZRADI / KORISTITI NAVBAR ZA NAVIGACIJU</Form.Label>

        </Container>

        </>
    );
}
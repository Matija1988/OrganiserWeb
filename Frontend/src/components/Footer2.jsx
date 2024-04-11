import React from "react"
import "../components/FooterStyle.css"
import { Container, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer2() {
    return (
        <div className="footerMain">
        <Container className="footerMainText">
            <Row>
                <Col key ="1">
                <Form.Label className="footerLinkText">Made by</Form.Label>
                </Col>
                <Col key="2">
                <Form.Label className="footerLinkText">Natječaji</Form.Label>
                
                </Col>                
                <Col>
                <Form.Label className="footerLinkText">Korisno</Form.Label>
                </Col>
            </Row>
            <Row className="links">
                <Col key="1">
                <Form.Label>Matija Pavković</Form.Label>
                </Col>
                <Col>
                <a href="https://strukturnifondovi.hr/">STRUKTURNI FONDOVI</a>
                
                </Col>
                <Col>
                <a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2016_12_120_2607.html">ZAKON O JAVNOJ NABAVI</a>
                </Col>
            </Row>
            <Row className="links">
                <Col>
                <Form.Label>Made in WEB DEVELOPMENT class EDUNOVA, Osijek</Form.Label>
                </Col>
                <Col>
                <a href="https://strukturnifondovi.hr/dokumenti/">STRUKTURNI FONDOVI DOKUMENTI</a>
                </Col>
                <Col>
                <a href="https://www.zakon.hr/z/114/Zakon-o-za%C5%A1titi-tr%C5%BEi%C5%A1nog-natjecanja">ZAKON O ZAŠTITI TRŽIŠNOG</a>
            
                </Col>
            </Row>
            <Row className="links">
                <Col>
                <a href="https://www.edunova.hr/">EDUNOVA</a>
                </Col>
                <Col>
                <a href="https://hamagbicro.hr/otvoreni-natjecaji/">HAMAGBICRO NATJEČAJI</a>
                </Col>
                <Col>
                <a href="https://dkom.hr/">DKOM</a>
                </Col>
            </Row>
            <Row className="links">
                <Col>
                </Col>
                <Col>
                        <a href="https://mingor.gov.hr/javni-pozivi-i-natjecaji-7371/javni-pozivi-i-natjecaji-ministarstva/otvoreni-javni-pozivi-i-natjecaji/7390">
                            MINGO NATJEČAJI
                        </a>
                </Col>
                <Col>
                <a href="https://www.zakon.hr/z/307/Zakon-o-radu">ZAKON O RADU</a>
               
                </Col>
            </Row>
        </Container>
        </div>
    );
}

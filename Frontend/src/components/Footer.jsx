import React from "react"
import "../components/FooterStyle.css"

const Footer = () => <footer className="footerMain">
    <div className="footerMainDiv1">
        <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
                <h5 className="footerMainText">USEFULL LINKS</h5>
                <p className="footerMainText">---------------------</p>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0"/>

            <div className="col-md-3 mb-md-0 mb-3">
                <h5 className="footerLinkText">Links</h5>
                <ul className="list-unstyled">
                    <li><a href="https://strukturnifondovi.hr/">STRUKTURNI FONDOVI</a></li>
                    <li><a href="https://strukturnifondovi.hr/dokumenti/">STRUKTURNI FONDOVI DOKUMENTI</a></li>
                    <li><a href="https://hamagbicro.hr/otvoreni-natjecaji/">HAMAGBICRO OTVORENI NATJEČAJI</a></li>
                    <li><a href="https://mingor.gov.hr/javni-pozivi-i-natjecaji-7371/javni-pozivi-i-natjecaji-ministarstva/otvoreni-javni-pozivi-i-natjecaji/7390">
                        MINGO NATJEČAJI</a></li>
                </ul>
            </div>

            <div className="col-md-3 mb-md-0 mb-3">
                <h5 className="footerLinkText">Links</h5>
                <ul className="list-unstyled">
                    <li><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2016_12_120_2607.html">ZAKON O JAVNOJ NABAVI</a></li>
                    <li><a href="https://www.zakon.hr/z/114/Zakon-o-za%C5%A1titi-tr%C5%BEi%C5%A1nog-natjecanja">ZAKON O ZAŠTITI TRŽIŠNOG NATJECANJA</a></li>
                    <li><a href="https://dkom.hr/">DKOM</a></li>
                    <li><a href="https://www.zakon.hr/z/307/Zakon-o-radu">ZAKON O RADU</a></li>
                </ul>
            </div>
        </div>
    </div>


</footer>

export default Footer
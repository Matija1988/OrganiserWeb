import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Route, useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { RoutesNames } from "../constants";

const ProtectedRouteTeamLeader = (props) => {

    const token = localStorage.getItem("Bearer");
    
    const navigate = useNavigate();
    
    function presentPage() {
        navigate(-1);
    }

    useEffect(()=>{
        if(token && jwtDecode(token).role !=="TeamLeader") {
            presentPage();
        }
    }, [token && jwtDecode(token).role !=="TeamLeader"]);
    
    var decodeData = jwtDecode(token);
    
    
   

    if(decodeData.role === "TeamLeader") {
        return <Outlet {...props} />
    }
     if(decodeData.role !== "TeamLeader") {
        <Navigate to ={RoutesNames.MAIN_PANEL} />
        alert("Members are not allowed into the members page!");
    }
    
};

export default ProtectedRouteTeamLeader;
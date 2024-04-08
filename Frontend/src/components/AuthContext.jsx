import { createContext, useEffect, useState } from "react";
import { logInService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { RoutesNames } from "../constants";
import useError from "../hooks/useError";
import useLoading from "../hooks/useLoading";

export const AuthContext = createContext();

export function AuthProvider({children}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const {showLoading,hideLoading} = useLoading();

    const {showError} = useError;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Bearer');

        if(token) {
            setAuthToken(token);
            setIsLoggedIn(true);
        } else {
            navigate(RoutesNames.HOME);
        }
    }, []);

    async function login(userData) {
        showLoading();
        const response = await logInService(userData);
        hideLoading();

        if(response.ok) {
            localStorage.setItem('Bearer', response.data);
            setAuthToken(response.data);
            setIsLoggedIn(true);
            navigate(RoutesNames.MAIN_PANEL);
        } else {
            console.log();
            showError(response.data);
            localStorage.setItem('Bearer', '');
            setAuthToken('');
            setIsLoggedIn(false);
        }
    }

    function logout() {
        localStorage.setItem('Bearer', '');
        setAuthToken('');
        setIsLoggedIn(false);
        navigate(RoutesNames.HOME);
    }

    const value = {
        isLoggedIn,
        authToken,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
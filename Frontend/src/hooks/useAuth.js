import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export default function useAuth() {
 
    const contex = useContext(AuthContext);
  
  if(!contex) {
    throw new Error('useAuth must be used within the AuthProvider');
  }
  return contex;
}
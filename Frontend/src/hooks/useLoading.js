import { useContext } from "react";
import { LoadingContext } from "../components/LoadingContext";

export default function useLoading() {
    const contex = useContext(LoadingContext);

    if(!contex) {
        throw new Error('useLoading must be used withing LoadingProvider!!!');
    }
    return contex;
}
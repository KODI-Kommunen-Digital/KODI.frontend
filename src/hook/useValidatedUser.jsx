import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useValidatedUser() {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken =
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken");
        const refreshToken =
            window.localStorage.getItem("refreshToken") ||
            window.sessionStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
            navigate("/login");
        }
    }, [navigate]);

    return null;
}

export default useValidatedUser;

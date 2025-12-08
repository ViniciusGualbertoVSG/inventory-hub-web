import Cookies from "js-cookie";
import { useAuthStore, useCompanyState } from "@/store/auth-store";

export const logout = () =>{
    Cookies.remove("auth_token");
    Cookies.remove("selected_company");

    useAuthStore.getState().setCompanies(null)
    useAuthStore.getState().setUser(null)
    useCompanyState.getState().setSelectedCompany(null)

    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}

export const switchCompany = () =>{
    Cookies.remove("selected_company");
    useCompanyState.getState().setSelectedCompany(null)

    if (typeof window !== "undefined") {
        window.location.href = "/select-company";
    }
}
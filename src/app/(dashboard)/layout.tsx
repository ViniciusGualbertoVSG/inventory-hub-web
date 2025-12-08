'use client';

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useEffect, useState } from "react";
import { useAuthStore, useCompanyState } from "@/store/auth-store";
import { getCompanies, getMe, setAuthToken } from "@/lib/api";
import Cookies from "js-cookie";

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode
}){
    const { user, companies, setUser, setCompanies } = useAuthStore()
    const { selectedCompany, setSelectedCompany } = useCompanyState()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function hydrateStore(){
            if(user && selectedCompany){
                setLoading(false);
                return;
            }

            const token = Cookies.get('auth_token');
            const selectedCompanyId = Cookies.get('selected_company');
            
            if(!token){
                setLoading(false);
                return;
            }

            setAuthToken(token);

            try{
                const userData =  user || await getMe();
                const companiesData = companies || await getCompanies();

                if(!user) setUser(userData);
                if(!companies) setCompanies(companiesData);

                if(!selectedCompany && selectedCompanyId && companiesData){
                        const companyToSelect = companiesData.find((c) => c.id === selectedCompanyId);
                    
                    if(companyToSelect){
                        setSelectedCompany(companyToSelect);
                    }else{
                        Cookies.remove('selected_company');
                        console.warn('Cookie de empresa selecionada inválida. Por favor, selecione uma empresa novamente.');
                    }
                }

            }catch(error){
                console.error("Falha ao hidratar o store:", error);
            }finally{
                setLoading(false);
            }
        }
        hydrateStore();
    }, [user, companies, setUser, setCompanies, selectedCompany, setSelectedCompany]);

    if(loading){
        return(
            <div className="flex h-screen items-center justify-center">
                <p>Carregando sua sessão...</p>
            </div>
        )
    }

    return(
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header />
                
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
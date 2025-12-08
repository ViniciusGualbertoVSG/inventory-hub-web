'use client';

import { useAuthStore ,useCompanyState } from "@/store/auth-store";
import type { Company } from "@/types/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { useState, useCallback, useEffect } from "react";
import { JoinCompanyForm } from "@/components/forms/JoinCompanyForm/JoinCompanyForm";
import { getCompanies, setAuthToken } from "@/lib/api";
import { CreateCompanyForm } from "@/components/forms/CreateCompanyForm/CreateCompanyForm";

export default function SelectCompanyPage() {
    const router = useRouter();
    const saveCompanies = useAuthStore.getState().setCompanies
    const setSelectedCompany = useCompanyState((state) => state.setSelectedCompany);
    const [isJoinModalOpen, setIsJoinModalOpen] =  useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] =  useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);

    const fetchCompanies = useCallback(async () =>{
        try{
            const companiesList = await getCompanies();
            setCompanies(companiesList);

            saveCompanies(companiesList);
        }catch(error){
            console.error('Erro ao buscar empresas:', error);
        }
    }, [ setCompanies, saveCompanies]);

    useEffect(() =>{
        const token = Cookies.get('auth_token');
        if(token){
            setAuthToken(token);
        }

        fetchCompanies();
    }, [fetchCompanies]);

    const handleSelectCompany = (company: Company) => {
        setSelectedCompany(company);
        Cookies.set('selected_company', company.id, { expires: 1 });
        router.push('/dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4 rounded-md border border-white/10 bg-muted p-6">
                <h1 className="text-center text-2xl font-bold">Selecione uma empresa</h1>
                <p className="text-center text-muted-foreground">Você precisa selecionar uma empresa para continuar.</p>
                <div className="flex gap-4 justify-end">
                    <Button onClick={() => setIsJoinModalOpen(true)} variant="outline">Entrar em uma Empresa</Button>
                </div>
                <div className="space-y-2">
                    {companies.length === 0 ? (
                        <p>Nenhuma empresa disponível.</p>
                    ): companies.map((company) => (
                        <button key={company.id}
                            onClick={() => handleSelectCompany(company)}
                            className="w-full rounded-md border border-white/10 p-3 text-left hover:bg-white/5"    
                        >
                            {company.name}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4 justify-end">
                    <Button onClick={()=> setIsCreateModalOpen(true)} variant="outline">Criar uma Empresa</Button>
                </div>
            </div>
            <Modal isOpen={isJoinModalOpen} onClose={()=> setIsJoinModalOpen(false)}>
                <JoinCompanyForm onSuccess={() => {setIsJoinModalOpen(false); fetchCompanies();}} />
            </Modal>
            <Modal isOpen={isCreateModalOpen} onClose={()=> setIsCreateModalOpen(false)}>
                <CreateCompanyForm onSuccess={() => {setIsCreateModalOpen(false); fetchCompanies();}} />
            </Modal>
        </div>
    );
};
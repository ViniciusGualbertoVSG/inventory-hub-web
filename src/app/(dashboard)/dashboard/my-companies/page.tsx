'use client';

import { deleteCompany, getCompanies } from "@/lib/api";
import { Company } from "@/types/auth";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

export default function MyCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [companyDelete, setCompanyDelete] = useState<Company | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState('');

    const fetchCompanies = useCallback(async () =>{
        try{
            const companies = await getCompanies();
            setCompanies(companies);
        }catch(error){
            console.error('Erro ao buscar empresas:', error);
        }finally{
            setLoading(false);
        }
    }, [ setCompanies]);

    useEffect(() =>{
        fetchCompanies();
    }, [fetchCompanies]);

    const handleConfirmDelete = async ()=>{
        if(!companyDelete) return;

        try{
            await deleteCompany(companyDelete.id)
            console.log("Empresa Deletado:", companyDelete.name)
        }catch(error){
            console.error("Erro ao deletar Empresa:", error)
        }finally{
            setCompanyDelete(null)
            setConfirmDelete('')
            fetchCompanies()
        }
    }

    if (loading){
        return (
            <div className="flex h-full items-center justify-center">
                <p>Carregando empresas...</p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Minhas Empresas</h1>
            </div>
            <table className="w-full border-collapse table-auto border border-white/10 rounded-md p-4">
                <thead>
                    <tr>
                        <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Nome</th>
                        <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Cargo</th>
                        <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground"></th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company.id}>
                            <td className="p-2 border-b text-sm text-muted-foreground">{company.name}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{company.role=='OWNER' ? "Administrador" : 
                                    (company.role=='EMPLOYEE' ? "Colaborador" : "Cargo Indefinido")}
                                </td>
                                {company.role=='OWNER'  ? (
                                <td className="p-2 border-b text-sm text-muted-foreground text-right">
                                    <Button onClick={()=> {setCompanyDelete(company);}} variant="danger">X</Button>
                                </td>
                                ):(
                                <td className="p-2 border-b text-sm text-muted-foreground text-right">-</td>
                                )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={!!companyDelete} onClose={()=> setCompanyDelete(null)} title="Confirmar Exclusão">
                <div className="space-y-4">
                    <p>
                        Tem certeza que deseja excluir a empresa 
                        <span className="font-bold"> {companyDelete?.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Para confirmar, digite <span className="text-lg font-bold">{companyDelete?.name}</span> abaixo:
                    </p>
                    <input
                        className="flex rounded-md w-full border border-white/10 bg-muted p-3 text-center font-mono text-lg font-bold tracking-widest"
                        type="text" 
                        value={confirmDelete} 
                        onChange={(e) => setConfirmDelete(e.target.value)} 
                        placeholder="Nome da Empresa"
                    />
                    <p className="text-sm text-muted-foreground">
                        Essa ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => setCompanyDelete(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={confirmDelete !== companyDelete?.name}
                            variant="danger" 
                            onClick={handleConfirmDelete}
                        >
                            Sim, Excluir
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
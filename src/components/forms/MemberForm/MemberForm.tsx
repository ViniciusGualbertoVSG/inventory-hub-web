import React, {FormEvent, useState} from "react";
import { updateMember } from "@/lib/api";
import { useCompanyState } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";

interface MemberFormProps{
    onSuccess: () => void,
    memberId?: string,
    initialRole?: string
}

export function MemberForm({onSuccess, memberId, initialRole}:MemberFormProps) {
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const [error, setError] = useState<string | null>(null);
    const [member, setMember] = useState(initialRole || 'EMPLOYEE');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        setError('')

        try{
            const memberdata = await updateMember(selectedCompany?.id || '', memberId || '', member);
            console.log("Membro atualizado com sucesso:", memberdata);
        }catch(error){
            setError("Falha ao atualizar membro. Tente novamente.");
            console.error("Falha ao atualizar membro:", error);
        }finally{
            onSuccess()
        }
    }

    return(
        <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
                <p className="text-muted-foreground">Escolha o novo cargo do membro.</p>
            </div>
            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
                
                <div className="flex flex-col space-y-2">
                    <label htmlFor="MemberRole" className="text-sm font-medium">Cargo</label>
                    <div className="flex gap-2">
                        <select 
                            name="MemberRole" 
                            id="MemberRole"
                            required 
                            className="flex-1 rounded-md border border-white/10 bg-muted p-2"
                            value={member}
                            onChange={(e) => setMember(e.target.value)}
                        >
                            <option value="OWNER">Administrador</option>
                            <option value="EMPLOYEE">Colaborador</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Button type="submit">Salvar Alteração</Button>
                    </div>
                </div>
            </form>
            {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
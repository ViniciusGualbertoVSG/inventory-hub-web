import React, {FormEvent, useState} from "react";
import { Button } from "@/components/ui/Button";
import { joinCompany } from "@/lib/api";

interface JoinCompanyFormProps{
    onSuccess: () => void,
}

export function JoinCompanyForm({onSuccess}:JoinCompanyFormProps){
    const [error, setError] = useState<string | null>(null);
    const [inviteCode , setInviteCode] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
            event.preventDefault()
            setError('')

            try{
                const response = await joinCompany(inviteCode);
                console.log("Entrou na empresa com sucesso:", response);
            }catch(error){
                setError("Falha ao entrar na empresa. Tente novamente.");
                console.error("Falha ao entrar na empresa:", error);
            }finally{
                onSuccess()
            }
    }

    return(
        <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Entrar em uma Empresa</h1>
                <p className="text-muted-foreground">Informe o código de convite abaixo.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="inviteCode" className="text-sm font-medium">Código de Convite</label>
                    <input
                        type="text"
                        id="inviteCode"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="rounded-md border border-gray-300 p-2"
                    />
                </div>
                <Button type="submit">Entrar na Empresa</Button>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </form>
        </div>
    )
}
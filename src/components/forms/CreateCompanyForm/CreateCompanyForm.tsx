import React, {FormEvent, useState} from "react";
import { Button } from "@/components/ui/Button";
import { createCompany } from "@/lib/api";

interface CreateCompanyFormProps{
    onSuccess: () => void,
}

export function CreateCompanyForm({onSuccess}:CreateCompanyFormProps){
    const [error, setError] = useState<string | null>(null);
    const [companyName , setCompanyName] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
            event.preventDefault()
            setError('')

            try{
                const response = await createCompany(companyName);
                console.log("Empresa criada com sucesso:", response);
                onSuccess();
            }catch(error){
                setError("Falha ao criar empresa. Tente novamente.");
                console.error("Falha ao criar empresa:", error);
            }
    }

    return(
        <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Crie sua Empresa</h1>
                <p className="text-muted-foreground">Crie uma nova empresa abaixo.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">Nome da Empresa</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="rounded-md border border-gray-300 p-2"
                    />
                </div>
                <Button type="submit">Criar Empresa</Button>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </form>
        </div>
    )
}
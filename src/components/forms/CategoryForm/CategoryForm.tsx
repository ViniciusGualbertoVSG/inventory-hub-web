import React, {FormEvent, useState} from "react";
import { createCategory, updateCategory } from "@/lib/api";
import { useCompanyState } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";

interface CategoryFormProps{
    onSuccess: () => void,
    initialData?: string,
    categoryId?: string,
}

export function CategoryForm({onSuccess, initialData, categoryId}:CategoryFormProps){
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState(initialData ?? '')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        setError('')

        try{
            if (!!categoryId) {
                const categoryData = await updateCategory(selectedCompany?.id || '', categoryId, category);
                console.log("Categoria atualizada com sucesso:", categoryData);
            } else {
                const categoryData = await createCategory(selectedCompany?.id || '', category);
                console.log("Categoria criada com sucesso:", categoryData);
            }
        }catch(error){
            setError("Falha ao criar produto. Tente novamente.");
            console.error("Falha ao criar produto:", error);
        }
        finally{
            onSuccess()
        }
    }

    return(
        <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">{!!categoryId ? "Editar Categoria" : "Adicionar Nova Categoria"}</h1>
                <p className="text-muted-foreground">Informe o nome da nova categoria abaixo.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Nome da Categoria</label>
                    <input 
                    id="category" 
                    name="category" 
                    type="text" 
                    required  
                    className="rounded-md border border-white/10 bg-muted p-2"
                    placeholder="Categoria"
                    value={category}
                    onChange={(e)=> setCategory(e.target.value)}
                    />
                </div>
                {!!categoryId ? <Button type="submit">Salvar alterações</Button> : <Button type="submit">Adicionar categoria</Button>}
            </form>
            {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
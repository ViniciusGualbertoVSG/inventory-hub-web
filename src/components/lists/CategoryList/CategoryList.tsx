import { Button } from "@/components/ui/Button/Button";
import { CategoryForm } from "@/components/forms/CategoryForm/CategoryForm";
import { useState, useCallback,useEffect } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { Category } from "@/types/inventory";
import { getCategories, deleteCategory } from "@/lib/api";
import  { useCompanyState } from "@/store/auth-store";

export function CategoryList(){
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const isOwner = useCompanyState((state) => state.isOwner)
    const [category, setCategory] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categoryUpdate, setCategoryUpdate] = useState<Category | null>(null);
    const [categoryDelete, setCategoryDelete] = useState<Category | null>(null);

    
        const fetchCategory = useCallback(async ()=>{
            try{
                const category = await getCategories(selectedCompany?.id || '')
                console.log("Categorias obtidas: ", category)
                setCategory(category)
            }catch(error){
                console.error("Erro ao buscar categorias:", error);
            }finally{
                setLoading(false)
            }
        },[selectedCompany])
    
        useEffect(()=>{
            fetchCategory();
        },[fetchCategory])

        const handleConfirmDelete = async ()=>{
                if(!categoryDelete) return;
        
                try{
                    await deleteCategory(selectedCompany?.id || '', categoryDelete.id)
                    console.log("Categoria Deletada:", categoryDelete.name)
                }catch(error){
                    console.error("Erro ao deletar produto:", error)
                }finally{
                    setCategoryDelete(null)
                    fetchCategory()
                }
            }


    if (loading){
        return (
            <div className="flex h-full items-center justify-center">
                <p>Carregando categorias...</p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="flex items-center justify-end mb-6">
                {isOwner && <Button onClick={() => setIsModalOpen(true)}>Nova Categoria</Button>}
            </div>
            {category.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p>Você não possui categorias cadastradas.</p>
                </div>
            ):(
                <table className="w-full border-collapse table-auto border border-white/10 rounded-md p-4">
                <thead>
                    <tr>
                        <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Categorias</th>
                        {isOwner && <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground"></th>}
                    </tr>
                </thead>
                <tbody>
                    {category.map((cat) => (
                        <tr key={cat.id}>
                            <td className="p-2 border-b">{cat.name}</td>
                        {isOwner && <td className="p-2 border-b text-sm text-right">
                            <Button className="mr-3" onClick={()=> setCategoryUpdate(cat)}>O</Button>
                            <Button variant="danger" onClick={()=> setCategoryDelete(cat)}>X</Button>
                        </td>}
                        </tr>
                    ))}
                </tbody>
                </table>
            )}
            <Modal isOpen={isModalOpen} onClose={()=> {setIsModalOpen(false)}}>
                <CategoryForm onSuccess={()=> {setIsModalOpen(false); fetchCategory()}}/>
            </Modal>
            <Modal isOpen={!!categoryUpdate} onClose={()=> setCategoryUpdate(null)}>
                <CategoryForm 
                    onSuccess={()=> {setCategoryUpdate(null); fetchCategory()}} 
                    categoryId={categoryUpdate?.id} 
                    initialData={categoryUpdate?.name}
                />
            </Modal>
            <Modal isOpen={!!categoryDelete} onClose={()=> setCategoryDelete(null)} title="Confirmar Exclusão">
                <div className="space-y-4">
                    <p>
                        Tem certeza que deseja excluir a categoria 
                        <span className="font-bold"> {categoryDelete?.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Essa ação não pode ser desfeita.
                    </p>
                    
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => setCategoryDelete(null)}
                        >
                            Cancelar
                        </Button>
                        <Button 
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
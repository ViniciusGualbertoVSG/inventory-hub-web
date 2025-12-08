'use client'

import { getInventory, deleteProduct } from "@/lib/api"
import { useCompanyState } from "@/store/auth-store"
import { useEffect, useState, useCallback } from "react"
import type { Product } from "@/types/inventory"
import { priceFormatter } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Modal } from "@/components/ui/Modal"
import { ProductForm } from "@/components/forms/ProductForm"
import { CategoryList } from "@/components/lists/CategoryList/CategoryList"

export default function InventoryPage() {
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const isOwner = useCompanyState((state) => state.isOwner)
    const [inventory, setInventory] =  useState<Product[]>([])
    const [ loading, setLoading ] = useState(true)
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [productDelete, setProductDelete] = useState<Product | null>(null)
    const [productUpdate, setProductUpdate] = useState<Product | null>(null)

    const fetchInventory = useCallback(async () =>{
        try{
            if(!selectedCompany){
                console.warn("Nenhuma empresa selecionada.");
                return;
            }

            const inventory = await getInventory(selectedCompany?.id || '');
            console.log("Inventário obtido:", inventory);
            setInventory(inventory);

        }catch(error){
            console.error("Erro ao buscar inventário:", error);
        }
        finally{
            setLoading(false);
        }
    },[selectedCompany])

    useEffect(() =>{
        fetchInventory();
    }, [fetchInventory])


    if(loading){
            return(
                <div className="flex h-full items-center justify-center">
                    <p>Carregando Inventário..</p>
                </div>
            )
    }

    const handleNewProduct = () => {
        console.log("Adicionar novo produto");
        setIsCreateProductOpen(true);
    }

    const handleConfirmDelete = async ()=>{
        if(!productDelete) return;

        try{
            await deleteProduct(selectedCompany?.id || '', productDelete.id)
            console.log("Produto Deletado:", productDelete.name)
        }catch(error){
            console.error("Erro ao deletar produto:", error)
        }finally{
            setProductDelete(null)
            fetchInventory()
        }
    }

    return(
        <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Inventário</h1>
                <div className="flex gap-4">
                    {isOwner && <Button onClick={handleNewProduct}>Novo Produto</Button>}
                    <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>Categorias</Button>
                </div>
            </div>
            {inventory.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p>Você não possui produtos no inventário.</p>
                </div>
            ) : (
                <table className="w-full border-collapse table-auto border border-white/10 rounded-md p-4">
                    <thead>
                        <tr>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">ID</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Nome</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Preço</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Quantidade</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((product) =>(
                            <tr key={product.id}>
                                <td className="p-2 border-b text-sm text-muted-foreground">{product.productId}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{product.name}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{priceFormatter.format(product.price)}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{product.quantity}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground text-right">
                                    <Button className="mr-3" onClick={()=> setProductUpdate(product)}>O</Button>
                                    {isOwner && <Button variant="danger" onClick={()=> setProductDelete(product)}>X</Button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Modal isOpen={isCreateProductOpen} onClose={() => setIsCreateProductOpen(false)} 
                title="Adicionar Novo Produto" 
                description="Informe dos dados do novo produto abaixo.">
                <ProductForm onSuccess={() => {setIsCreateProductOpen(false); fetchInventory();}}/>
            </Modal>
            <Modal isOpen={!!productDelete} onClose={()=> setProductDelete(null)} title="Confirmar Exclusão">
                <div className="space-y-4">
                    <p>
                        Tem certeza que deseja excluir o produto 
                        <span className="font-bold"> {productDelete?.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Essa ação não pode ser desfeita.
                    </p>
                    
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => setProductDelete(null)}
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
            <Modal isOpen={!!productUpdate} onClose={()=> {setProductUpdate(null)}} title="Editar Produto">
                <ProductForm 
                    onSuccess={() => {setProductUpdate(null); fetchInventory()}}
                    productId={productUpdate?.id}
                    initialData={{
                        name: productUpdate?.name,
                        description: productUpdate?.description,
                        productId: productUpdate?.productId,
                        quantity: productUpdate?.quantity,
                        price: productUpdate?.price,
                        categoryId: productUpdate?.categoryId,
                    }}
                />
            </Modal>
            <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Categorias">
                <CategoryList />
            </Modal>
        </div>
    )
}
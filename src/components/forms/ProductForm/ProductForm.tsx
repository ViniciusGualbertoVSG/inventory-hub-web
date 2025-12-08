import React, { FormEvent, useEffect, useState, useCallback } from "react";
import { getCategories, createProduct, updateProduct } from "@/lib/api";
import { useCompanyState } from "@/store/auth-store";
import type { Category, UpdateProductDTO } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "../CategoryForm";

interface ProductFormProps{
    onSuccess: () => void,
    initialData?: UpdateProductDTO,
    productId?: string,
}

export function ProductForm({onSuccess, initialData, productId}:ProductFormProps) {
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const [category, setCategory] =  useState<Category[]>([])
    const [error, setError]         = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        productId: initialData?.productId ?? '',
        quantity: initialData?.quantity?.toString() ?? '',
        price: initialData?.price?.toString() ?? '',
        categoryId: initialData?.categoryId ?? '',
    });

    const fetchCategory = useCallback(async ()=>{
        try{
            const category = await getCategories(selectedCompany?.id || '')
            console.log("Categorias obtidas: ", category)
            setCategory(category)
        }catch(error){
            console.error("Erro ao buscar categorias:", error);
        }finally{
            setLoadingCategories(false)
        }
    },[selectedCompany])

    useEffect(()=>{
        fetchCategory();
    },[fetchCategory])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        if (name === 'price') {
            const regex = /^\d*\.?\d{0,2}$/;

            if (value !== '' && !regex.test(value)) {
                return; 
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleCleaning =()=>{
        setFormData({
            name: '',
            description: '',
            productId: '',
            quantity: '',
            price: '',
            categoryId: ''
        })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('');

        const commitProduct = {
            name: formData.name,
            description: formData.description,
            productId: formData.productId,
            quantity: parseFloat(formData.quantity),
            price: parseFloat(formData.price),
            categoryId: formData.categoryId
        }

        try{
            if(!!productId){
                const productData = await updateProduct(selectedCompany?.id || '', productId ?? '', commitProduct)
                console.log("Produto editado com sucesso:", productData)
                console.log("dados enviados na edição", commitProduct)
            }else{
                const productData = await createProduct(selectedCompany?.id || '', commitProduct)
                console.log("Produto criado com sucesso:", productData)
            }
            onSuccess()
        }catch(error){
            setError("Falha ao criar produto. Tente novamente.");
            console.error("Falha ao criar produto:", error);
        }
    }

    return (
        <div className="w-full max-w-sm space-y-4">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="productId" className="text-sm font-medium">ID do produto</label>
                    <input disabled={!!productId}
                    id="productId" 
                    name="productId" 
                    type="text" 
                    required  
                    className="rounded-md border border-white/10 bg-muted p-2"
                    placeholder="ID-000"
                    value={formData.productId}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nome</label>
                    <input disabled={!!productId}
                    id="name" 
                    name="name" 
                    type="text" 
                    required  
                    className="rounded-md border border-white/10 bg-muted p-2"
                    placeholder="Produto"
                    value={formData.name}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                    <textarea disabled={!!productId}
                    id="description" 
                    name="description"
                    required  
                    className="resize-none rounded-md border border-white/10 bg-muted p-2"
                    placeholder="Informação do produto"
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    ></textarea>
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium">Categoria</label>
                    <div className="flex gap-2">
                        <select 
                        id="categoryId" 
                        name="categoryId"
                        required
                        className="flex-1 rounded-md border border-white/10 bg-muted p-2"
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={loadingCategories || !!productId}
                        >
                            <option value="">Selecione uma Categoria...</option>
                            {category.map((cat)=>(
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <Button disabled={!!productId} type="button" variant="outline" onClick={() => {setIsModalOpen(true)}} className="px-3">+</Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium">Quantidade</label>
                    <input 
                    id="quantity" 
                    name="quantity" 
                    type="number"
                    step="0.01"
                    min="0"
                    required  
                    className="rounded-md border border-white/10 bg-muted p-2"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Preço</label>
                    <input 
                    id="price" 
                    name="price" 
                    type="number"
                    step="0.01"
                    min="0"
                    required  
                    className="rounded-md border border-white/10 bg-muted p-2"
                    placeholder="0,00"
                    value={formData.price}
                    onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    {!!productId ? (<Button type="submit">Confirmar Edição</Button>) : (
                        <>
                            <Button type="submit">Adicionar Produto</Button>
                            <Button type="button" variant="danger" onClick={handleCleaning}>
                                Limpar
                            </Button>
                        </>
                    )}
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={()=> {setIsModalOpen(false)}}>
                <CategoryForm onSuccess={()=> {setIsModalOpen(false); fetchCategory()}}/>
            </Modal>
            {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
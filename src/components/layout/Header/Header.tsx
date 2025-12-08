'use client'

import { useAuthStore, useCompanyState } from "@/store/auth-store"
import { useState } from "react"
import { logout, switchCompany } from "@/lib/actions"
import { Button } from "@/components/ui/Button"

export function Header(){
    const user = useAuthStore((state) => state.user)
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="flex h-16 items-center border-b border-muted-foreground/40 bg-muted/60 px-6">
            <div className="flex-1">
                { /* titulo da pagina e contudo geral vem aqui */}
                <p className="text-lg font-bold text-muted-foreground">{selectedCompany ? `${selectedCompany.name}`: "Carregando..."}</p>
            </div>
            <div className="flex relative flex-col items-end gap-1">
                <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-sm text-muted-foreground">{user ? `Olá, ${user.firstName}`: "Carregando..."}</Button>
                {isMenuOpen && (
                    <div className="flex flex-col absolute bg-muted border border-muted-foreground p-3 rounded-md gap-2 top-full right-0 z-50">
                        <hr />
                        <Button
                            variant="ghost"
                            onClick={() => {switchCompany(); setIsMenuOpen(false)}}>
                            Trocar Empresa
                        </Button>
                        <Button 
                            variant="ghost"
                            onClick={() => {logout(); setIsMenuOpen(false)}}>
                            Sair
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
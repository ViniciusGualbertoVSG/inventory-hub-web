'use client'

import { deleteMember, getMembers, inviteMember } from "@/lib/api"
import { useCompanyState } from "@/store/auth-store"
import { useEffect, useState, useCallback } from "react"
import type { InviteMemberDTO, Member } from "@/types/member"
import { Button } from "@/components/ui/Button/Button"
import { Modal } from "@/components/ui/Modal/Modal"
import { MemberForm } from "@/components/forms/MemberForm/MemberForm"
import { dateFormatter } from "@/lib/utils"

export default function MembersPage() {
    const selectedCompany = useCompanyState((state) => state.selectedCompany)
    const isOwner = useCompanyState((state) => state.isOwner)
    const [members, setMembers] =  useState<Member[]>([])
    const [ loading, setLoading ] = useState(true)
    const [memberDelete, setMemberDelete] = useState<Member | null>(null)
    const [memberUpdate, setMemberUpdate] = useState<Member | null>(null)
    const [inviteCreated, setInviteCreated] = useState<InviteMemberDTO | null>(null)
    const [isCopied, setIsCopied] = useState(false);

    const fetchMembers = useCallback(async () =>{
            try{
                if(!selectedCompany){
                    console.warn("Nenhuma empresa selecionada.");
                    return;
                }
    
                const members = await getMembers(selectedCompany?.id || '');
                console.log("Membros obtidos:", members);

                setMembers(members);
    
            }catch(error){
                console.error("Erro ao buscar membros:", error);
            }
            finally{
                setLoading(false);
            }
        },[selectedCompany])
    
        useEffect(() =>{
            fetchMembers();
        }, [fetchMembers])

    const handleConfirmDelete = async ()=>{
        if(!memberDelete) return;

        try{
            await deleteMember(selectedCompany?.id || '', memberDelete.id)
            console.log("Membro Deletado:", memberDelete.user.profile.firstName, memberDelete.user.profile.lastName)
        }catch(error){
            console.error("Erro ao deletar membro:", error)
        }finally{
            setMemberDelete(null)
            fetchMembers()
        }
    }

    const handleCreateInvite = async () => {
        try{
            const invite = await inviteMember(selectedCompany?.id || '')
            console.log("Convite criado com sucesso: ", invite)
            setInviteCreated(invite)
        }catch(error){
            console.error("Erro ao criar convite:", error)
        }
    }

    const handleCopyCode = () => {
        if(!inviteCreated?.code) return;
        
        navigator.clipboard.writeText(inviteCreated.code);
        setIsCopied(true);
        
        setTimeout(() => setIsCopied(false), 2000);
    }

    if (loading){
        return (
            <div className="flex h-full items-center justify-center">
                <p>Carregando membros...</p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Membros</h1>
                {isOwner && <Button onClick={handleCreateInvite}>Convidar</Button>}
            </div>
            {members.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p>Você não possui membros cadastrados.</p>
                </div>
            ):(
                <table className="w-full border-collapse table-auto border border-white/10 rounded-md p-4">
                    <thead>
                        <tr>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Nome Completo</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Email</th>
                            <th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground">Cargo</th>
                            {isOwner && (<th className="p-2 text-left bg-muted/50 border-b text-sm text-muted-foreground"></th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="p-2 border-b text-sm text-muted-foreground">{member.user.profile.firstName} {member.user.profile.lastName}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{member.user.email}</td>
                                <td className="p-2 border-b text-sm text-muted-foreground">{member.role=='OWNER' ? "Administrador" : 
                                    (member.role=='EMPLOYEE' ? "Colaborador" : "Cargo Indefinido")}
                                </td>
                                {isOwner  && (
                                <td className="p-2 border-b text-sm text-muted-foreground text-right">
                                    <Button className="mr-3" onClick={()=> setMemberUpdate(member)}>O</Button>
                                    <Button variant="danger" onClick={()=> setMemberDelete(member)}>X</Button>
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Modal isOpen={!!memberDelete} onClose={()=> setMemberDelete(null)} title="Confirmar Exclusão">
                            <div className="space-y-4">
                                <p>
                                    Tem certeza que deseja excluir o membro 
                                    <span className="font-bold"> {memberDelete?.user.profile.firstName} {memberDelete?.user.profile.lastName}</span>?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Essa ação não pode ser desfeita.
                                </p>
                                
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setMemberDelete(null)}
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
            <Modal isOpen={!!memberUpdate} onClose={()=> {setMemberUpdate(null)}} title="Alterar Cargo">
                <MemberForm 
                    onSuccess={()=> {setMemberUpdate(null); fetchMembers()}}
                    memberId={memberUpdate?.id}
                    initialRole={memberUpdate?.role}
                />
            </Modal>
            <Modal 
                isOpen={!!inviteCreated} 
                onClose={()=> {setInviteCreated(null)}} 
                title="Convite Criado"
            >
                <div className="space-y-4">
                    <p className="text-muted-foreground">Envie o código abaixo para o convidado.</p>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md border border-white/10 bg-muted p-3 text-center font-mono text-lg font-bold tracking-widest">
                            {inviteCreated?.code}
                        </div>
                        <Button 
                            variant="outline" 
                            className={isCopied ? "border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-600" : ""}
                            onClick={handleCopyCode}
                        >
                            {isCopied ? "Copiado!" : "Copiar"}
                        </Button>
                    </div>

                    {/* Datas Formatadas */}
                    <div className="text-xs text-muted-foreground text-center space-y-1">
                        <p>Criado em: {inviteCreated && dateFormatter.format(new Date(inviteCreated.createdAt))}</p>
                        <p className="text-red-400">Expira em: {inviteCreated && dateFormatter.format(new Date(inviteCreated.expiresAt))}</p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
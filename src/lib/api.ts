import axios from 'axios';
import type { LoginResponse, User, Company, GetMeResponse, GetCompaniesApiResponse, BaseUser } from '../types/auth';
import type { Product, Category, CreateProductDTO, UpdateProductDTO } from '../types/inventory';
import { GetMembersApiResponse, InviteMemberDTO, JoinInviteDTO, Member } from '@/types/member';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) =>{
        if (error.response && error.response.status === 401) {
            console.warn("Sessão inválida ou expirada (401). Redirecionando para login...");
            
            Cookies.remove('auth_token')
            Cookies.remove('selected_company')

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export const register = async (data: BaseUser & { password: string }): Promise<void> => {
    try{
        await api.post('/auth/register', data);
    }catch (error) {
        console.error('Erro no Registro:', error);
        throw error;
    }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try{
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    }catch (error) {
        console.error('Erro no Login:', error);
        throw error;
    }
}

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const getMe = async (): Promise<User> => {
    try{
        const response = await api.get<GetMeResponse>('/users/me');
        const apiData = response.data;

        const formattedUser: User = {
            id: apiData.id,
            email: apiData.email,
            firstName: apiData.profile.firstName,
            lastName: apiData.profile.lastName,
        }
        console.log("Dados do usuário obtidos:", formattedUser);
        return formattedUser;

    }catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        throw error;
    }
}

/////////////////////////////////////////////////////////////////////////////

export const getCompanies = async (): Promise<Company[]> => {
    try {
        const response = await api.get<GetCompaniesApiResponse>('/companies');
        const apiData = response.data;

        if(!apiData || !Array.isArray(apiData.company)){
            console.error('Resposta inesperada da API ao buscar empresas:', apiData);
            return [];
        }

        const formattedCompanies: Company[] = apiData.company.map(item => ({...item.company, role: item.role}));
        console.log("Empresas obtidas:", formattedCompanies);
        return formattedCompanies;

    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
    }
}

/////////////////////////////////////////////////////////////////////////////

export const getCategories = async (companyId: string): Promise<Category[]> => {
    try{
        const response = await api.get<Category[]>(`/companies/${companyId}/categories`);
        return response.data;
    }catch (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
    }
}

export const createCategory = async (companyId: string, name: string): Promise<Category> => {
    try{
        const response = await api.post<Category>(`/companies/${companyId}/categories`, { name });
        return response.data;
    }catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
    }
}

export const deleteCategory = async (companyId: string, categoryId: string): Promise<Category> => {
    try{
        const response = await api.delete<Category>(`/companies/${companyId}/categories/${categoryId}`);
        return response.data;
    }catch(error){
        console.error('Erro ao deletar categoria:', error);
        throw error;
    }
}

export const updateCategory = async (companyId: string, categoryId: string, name: string): Promise<Category> => {
    try{
        const response = await api.patch<Category>(`/companies/${companyId}/categories/${categoryId}`, { name });       
        return response.data;
    }catch(error){
        console.error('Erro ao atualizar categoria:', error);
        throw error;
    }
}

/////////////////////////////////////////////////////////////////////////////

export const createProduct = async (companyId: string, data: CreateProductDTO): Promise<Product> =>{
    try{
        const response = await api.post<Product>(`/companies/${companyId}/inventory`, data);
        return response.data;
    }catch(error){
        console.error('Erro ao criar produto:', error);
        throw error;
    }
}

export const getInventory = async (companyId: string): Promise<Product[]> => {
    try{
        const response = await api.get<Product[]>(`/companies/${companyId}/inventory`);
        return response.data;
    }catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

export const deleteProduct = async ( companyId: string, productId: string): Promise<Product> =>{
    try{
        const response = await api.delete<Product>(`/companies/${companyId}/inventory/${productId}`);
        return response.data
    }catch(error){
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
}

export const updateProduct = async ( companyId: string, productId: string, data: UpdateProductDTO): Promise<Product> =>{
    try{
        const response = await api.patch<Product>(`/companies/${companyId}/inventory/${productId}`, data);
        return response.data
    }catch(error){
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
}

/////////////////////////////////////////////////////////////////////////////

export const getMembers = async (companyId: string): Promise<Member[]> => {
    try{
        const response = await api.get<GetMembersApiResponse>(`/companies/${companyId}/members`);
        return response.data.companyMembers[0]?.members || [];
    }catch (error) {
        console.error('Erro ao buscar membros:', error);
        throw error;
    }
}

export const deleteMember = async (companyId: string, memberId: string): Promise<void> => {
    try{
        await api.delete<void>(`/companies/${companyId}/members/${memberId}`);
    }catch(error){
        console.error('Erro ao deletar membro:', error);
        throw error;
    }
}

export const updateMember = async (companyId: string, memberId: string, role: string): Promise<Member> => {
    try{
        const response = await api.patch<Member>(`/companies/${companyId}/members/${memberId}`, { role });       
        return response.data;
    }catch(error){
        console.error('Erro ao atualizar membro:', error);
        throw error;
    }
}

/////////////////////////////////////////////////////////////////////////////

export const inviteMember = async (companyId: string): Promise<InviteMemberDTO> => {
    try{
        const response = await api.post<InviteMemberDTO>(`/companies/${companyId}/invites`);
        return response.data;
    }catch(error){
        console.error('Erro ao convidar membro:', error);
        throw error;
    }
}

export const joinCompany = async (inviteCode: string): Promise<Company> => {
    try{
        const post = await api.post<JoinInviteDTO>(`/invites/join`, { inviteCode });
        const response: Company = {
            id: post.data.companyId,
            name: post.data.companyName,
            role: "EMPLOYEE",
        };
        return response;
    }catch(error){
        console.error('Erro ao entrar na empresa: ', error);
        throw error;
    }
}

export const createCompany = async (name: string): Promise<Company> => {
    try{
        const post = await api.post<Company>(`/companies`, { name });
        const response: Company = { ...post.data, role: 'OWNER' };
        return response;
    }catch(error){
        console.error('Erro ao criar empresa:', error);
        throw error;
    }
}

export const deleteCompany = async (companyId: string): Promise<void> => {
    try{
        await api.delete(`/companies/${companyId}`);
    }catch(error){
        console.error('Erro ao deletar empresa:', error);
        throw error;
    }
}
import { create } from 'zustand';
import { User, Company } from '@/types/auth';

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    companies: Company[] | null;
    setCompanies: (companies: Company[] | null) => void;
};

export const  useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
    companies: null,
    setCompanies: (companies: Company[] | null) => set({ companies }),
}));

interface CompanyState {
    selectedCompany: Company | null;
    setSelectedCompany: (company: Company | null) => void;
    currentUserRole: 'OWNER' | 'EMPLOYEE' | null;
    setCurrentUserRole: (role: 'OWNER' | 'EMPLOYEE' | null) => void;
    isOwner: boolean;
};

export const useCompanyState = create<CompanyState>((set) => ({
    selectedCompany: null,
    currentUserRole: null,
    isOwner: false,
    setCurrentUserRole: (role) => set({ currentUserRole: role }),
    setSelectedCompany: (company: Company | null) => set({ selectedCompany: company,
        currentUserRole: company?.role || null,
        isOwner: company?.role === 'OWNER' ? true : false,
     }),
}));
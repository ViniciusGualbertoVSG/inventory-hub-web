export type BaseUser = {
    firstName: string;
    lastName: string;
    email: string;
}

export type User = BaseUser & {
    id: string;
}

export type LoginResponse = {
    accessToken: string;
    user: User;
};

export type getUserResponse = {
    id: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
    };
}

// export type GetMeResponse = {
//     id: string;
//     email: string;
//     createdAt: string;
//     profile: {
//         firstName: string;
//         lastName: string;
//     };
// };

export type GetMeResponse = getUserResponse & {
    createdAt: string;
};

export type Company ={
    id: string;
    name: string;
    role?: 'OWNER' | 'EMPLOYEE';
    
};

export type GetCompaniesApiResponse = {
    company: {
        company: Company;
        role: 'OWNER' | 'EMPLOYEE';
    }[];
};
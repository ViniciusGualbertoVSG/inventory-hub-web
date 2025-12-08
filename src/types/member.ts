import type { getUserResponse } from "./auth";

// export type GetMembersApiResponse = {
//     CompanyMembers: [
//         {
//             members: [
//                 {
//                     id: string;
//                     role: 'OWNER' | 'EMPLOYEE';
//                     user: {
//                         id: string;
//                         email: string;
//                         profile: {
//                             firstName: string;
//                             lastName: string;
//                         }
//                     }
//                 }
//             ]
//         }
//     ]
// };

// export type Member = {
//     id: string;
//     role: 'OWNER' | 'EMPLOYEE';
//     user: {
//         id: string;
//         email: string;
//         profile: {
//             firstName: string;
//             lastName: string;
//         }
//     }
// }

export type Member = {
    id: string;
    role: 'OWNER' | 'EMPLOYEE';
    user: getUserResponse;
}

export type GetMembersApiResponse = {
    companyMembers: [
        {
            members: Member[]
        }
    ]
}

export type InviteMemberDTO = {
    id: string;
    code: string;
    expiresAt: string;
    createdAt: string;
    companyId: string;
}

export type JoinInviteDTO = {
    message: string;
    companyId: string;
    companyName: string;
}
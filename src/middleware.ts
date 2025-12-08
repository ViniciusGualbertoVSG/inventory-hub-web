import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token: string): Promise<boolean> {
    try{
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        console.error('Falha na verificação JWT:', error);
        return false;
    }
}

export async function middleware(request: NextRequest){
    const token = request.cookies.get('auth_token')?.value;
    const selectedCompanyId = request.cookies.get('selected_company')?.value;
    const { pathname } = request.nextUrl;

    const isAuthenticated = token ? await verifyToken(token) : false;

    if(!isAuthenticated && (pathname.startsWith('/dashboard') || pathname === '/select-company')) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('selected_company');
        return response;
    }

    if(isAuthenticated){
        if(pathname === '/login' || pathname === '/register'){
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if(pathname.startsWith('/dashboard') && !selectedCompanyId){
            return NextResponse.redirect(new URL('/select-company', request.url));
        }

        if(pathname === '/select-company' && selectedCompanyId){
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/login',
        '/register',
        '/dashboard/:path*',
        '/select-company',
    ],
};
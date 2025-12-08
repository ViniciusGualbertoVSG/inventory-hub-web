import React from "react";

export default function AuthLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return(
        <main className="flex min-h-screnn items-center justify-center">
            {children}
        </main>
    )
}
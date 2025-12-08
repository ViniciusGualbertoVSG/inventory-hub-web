'use client';

import { FormEvent, useState } from "react";
import { useRouter }           from "next/navigation";
import { register, login, setAuthToken } from "@/lib/api";
import Cookies                 from "js-cookie";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export function RegisterForm() {
    const router                    = useRouter();
    const { setUser} = useAuthStore.getState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [error, setError]         = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('');

        try{
            if(password !== confirmPassword){
                setError("As senhas não coincidem.");
                setTimeout(() => setError(null), 3000);
                return;
            }

            const registerData = await register({firstName, lastName, email, password});
            console.log("Registro bem-sucedido:", registerData);

            try{
                const loginData = await login(email, password);
                console.log("Login bem-sucedido:", loginData);

                setAuthToken(loginData.accessToken);
                Cookies.set('auth_token', loginData.accessToken, {expires: 2});

                setUser(loginData.user);

                router.push('/select-company');

            }catch(error){
                setError("Falha no Login. Verifique suas credenciais.");
                console.error("Falha no Login:", error);
            }

        }catch(error){
            setError("Falha no Registro. Verifique suas credenciais.");
            console.error("Falha no Registro:", error);
        }
    }

    return (
    <div className="w-full h-screen max-w-sm space-y-4 flex flex-col justify-center mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Criar Conta</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para criar uma nova conta.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">Nome</label>
            <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="rounded-md border border-white/10 bg-muted p-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
        </div>
        <div className="flex flex-col space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Sobrenome</label>
            <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="rounded-md border border-white/10 bg-muted p-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md border border-white/10 bg-muted p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-md border border-white/10 bg-muted p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="rounded-md border border-white/10 bg-muted p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary p-2 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Cadastrar-se
        </button>
      </form>
      <Link href="/login" 
        className="text-center items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-white/20 hover:text-foreground"
      >
        <span>Já tem uma conta? Entre</span>
      </Link>
      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
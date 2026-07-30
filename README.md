# Inventory Hub — Web

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

> Interface web do **Inventory Hub** — um SaaS multi-tenant de gestão de estoque para pequenos negócios, onde cada empresa administra seu inventário de forma isolada, com times e níveis de permissão.

Projeto desenvolvido em dupla:

| Camada | Repositório | Responsável |
|---|---|---|
| **Frontend** (este repo) | [`inventory-hub-web`](https://github.com/ViniciusGualbertoVSG/inventory-hub-web) | [Vinícius Gualberto](https://github.com/ViniciusGualbertoVSG) |
| **Backend** | [`viniciusBarbacovi/learning-nestjs`](https://github.com/viniciusBarbacovi/learning-nestjs) | [Vinícius Barbacovi](https://github.com/viniciusBarbacovi) |

---

## Sobre o projeto

Pequenos negócios raramente têm acesso a uma ferramenta de controle de estoque que seja acessível e simples de operar. O Inventory Hub resolve isso como plataforma multi-tenant: um mesmo usuário pode pertencer a várias empresas, alternar entre elas, e ver apenas os dados da empresa ativa.

Este repositório contém o frontend — consome a API REST do backend em NestJS e implementa toda a experiência de autenticação, seleção de contexto (empresa) e operação do inventário.

## Funcionalidades

- **Autenticação** — registro e login, com token JWT persistido em cookie
- **Multi-tenant com contexto explícito** — após o login, o usuário escolhe a empresa ativa antes de acessar o dashboard; a escolha vive em cookie e governa todas as chamadas seguintes
- **Gestão de empresas** — criar uma empresa nova ou entrar em uma existente por código de convite
- **Inventário** — CRUD de produtos (nome, código, descrição, quantidade, preço, categoria) e de categorias
- **Membros e permissões** — listagem de membros, geração de convites, alteração de cargo e remoção
- **RBAC no client** — a interface distingue `OWNER` (controle administrativo) de `EMPLOYEE` (leitura), derivando `isOwner` do papel do usuário na empresa selecionada
- **Sessão resiliente** — interceptor global trata `401`, limpa os cookies e devolve o usuário ao login

## Arquitetura

### Proteção de rotas no middleware

O `src/middleware.ts` roda antes da renderização e concentra toda a lógica de acesso, verificando a assinatura do JWT com `jose`:

```
não autenticado  →  /dashboard/* ou /select-company   →  redireciona para /login (limpa cookie de empresa)
autenticado      →  /login ou /register               →  redireciona para /dashboard
autenticado      →  /dashboard/* sem empresa ativa    →  redireciona para /select-company
autenticado      →  /select-company com empresa ativa →  redireciona para /dashboard
```

Nenhuma página protegida precisa repetir essa checagem.

### Route groups

O App Router é dividido em dois grupos, que não afetam a URL mas isolam os layouts:

```
src/app/
├── (auth)/                    layout centrado, sem navegação
│   ├── login/
│   └── register/
├── (dashboard)/               layout com Sidebar + Header e hidratação de estado
│   └── dashboard/
│       ├── inventory/         produtos e categorias
│       ├── members/           membros e convites
│       └── my-companies/      empresas do usuário
├── select-company/            escolha da empresa ativa
└── page.tsx                   página pública
```

### Estado

Dois stores Zustand com responsabilidades separadas:

- `useAuthStore` — usuário autenticado e lista de empresas
- `useCompanyState` — empresa selecionada, papel do usuário e o derivado `isOwner`

### Camada de API

`src/lib/api.ts` isola toda a comunicação HTTP: instância axios com `baseURL` de ambiente, injeção do header `Authorization`, funções tipadas por domínio e o interceptor de `401`. Nenhum componente chama axios diretamente.

### Organização de componentes

```
src/components/
├── ui/         primitivos de aparência (Button, Modal)
├── forms/      Login, Register, Product, Category, Member, CreateCompany, JoinCompany
├── lists/      listagens (CategoryList)
└── layout/     Header, Sidebar
```

Tipos separados por domínio em `src/types/` — `auth.ts`, `inventory.ts`, `member.ts`.

## Stack

**Framework** Next.js (App Router) · React · TypeScript

**Estilo** Tailwind CSS v4 (via `@tailwindcss/postcss`)

**Estado** Zustand

**HTTP** Axios

**Auth no client** `jose` para verificar o JWT no middleware · `js-cookie` para o token e a empresa ativa

## API consumida

Endpoints do backend em NestJS utilizados por este frontend:

| Domínio | Endpoints |
|---|---|
| Autenticação | `POST /auth/register` · `POST /auth/login` |
| Perfil | `GET /users/me` · `PATCH /users/me` · `DELETE /users/me` |
| Empresas | `GET /:companyId/members` · `DELETE /:companyId` |
| Inventário | `POST`, `GET`, `PATCH`, `DELETE` em `/:companyId/inventory` |
| Categorias | `POST`, `GET`, `PATCH`, `DELETE` em `/:companyId/categories` |
| Convites | `POST`, `GET`, `DELETE` em `/:companyId/invites` · `POST /join` |
| Membros | `PATCH` e `DELETE` em `/:companyId/members/:memberId` |

## Como rodar

**Pré-requisitos:** Node.js e o [backend](https://github.com/viniciusBarbacovi/learning-nestjs) em execução.

```bash
git clone https://github.com/ViniciusGualbertoVSG/inventory-hub-web.git
cd inventory-hub-web
npm install
```

Crie um `.env.local` na raiz:

```
NEXT_PUBLIC_API_URL=   # URL base da API NestJS, ex: http://localhost:3000
JWT_SECRET=            # mesmo segredo usado pelo backend para assinar o token
```

> `JWT_SECRET` precisa ser idêntico ao do backend — o middleware valida a assinatura do token localmente.

```bash
npm run dev
```

## Status

MVP funcional, cobrindo o fluxo completo de autenticação, seleção de empresa, inventário e membros.

**Próximos passos mapeados:**

- Página de configurações da empresa (`/dashboard/settings`)
- Testes automatizados
- Feedback de carregamento e erro padronizado nos formulários

## Autores

- **Vinícius de Siqueira Gualberto** — frontend · [GitHub](https://github.com/ViniciusGualbertoVSG) · [LinkedIn](https://www.linkedin.com/in/viniciusvsg/)
- **Vinícius Paulo Barbacovi** — backend · [GitHub](https://github.com/viniciusBarbacovi)

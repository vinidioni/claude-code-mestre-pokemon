# Contexto do Projeto - Exemplo E-commerce

## Overview
Sistema de e-commerce com catálogo de produtos, carrinho e checkout.

## Stack Tecnológica
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + tRPC
- **Banco de Dados:** PostgreSQL + Prisma ORM
- **Autenticação:** NextAuth.js
- **Pagamentos:** Stripe
- **Testes:** Vitest + React Testing Library + Playwright
- **Deploy:** Vercel

## Convenções de Código

### Estilo
- Preferir arrow functions: `const fn = () => {}`
- Async/await ao invés de promises
- Early returns para evitar nesting
- Desestruturar props nos componentes

### Nomenclatura
- Componentes: `PascalCase` (ex: `ProductCard.tsx`)
- Hooks: `camelCase` com prefixo `use` (ex: `useCart.ts`)
- Utilitários: `camelCase` (ex: `formatPrice.ts`)
- Tipos/Interfaces: `PascalCase` com sufixo (ex: `ProductType`, `UserProps`)
- Constantes: `SCREAMING_SNAKE_CASE`

### Estrutura de Pastas
```
app/
├── (shop)/                 # Route group para loja
│   ├── page.tsx           # Home
│   ├── products/
│   └── cart/
├── api/                   # API routes
├── admin/                 # Área administrativa
components/
├── ui/                    # Componentes base (Button, Input)
├── features/              # Componentes de feature (ProductCard, CartItem)
└── layouts/               # Layouts específicos
lib/
├── prisma.ts             # Cliente Prisma
├── stripe.ts             # Config Stripe
└── utils.ts              # Utilitários
hooks/
├── useCart.ts
├── useAuth.ts
└── useProducts.ts
types/
├── product.ts
├── user.ts
└── order.ts
```

## Padrões Importantes

### API/Backend
- Usar tRPC para chamadas de API internas
- API Routes REST apenas para webhooks externos
- Validar todas as entradas com Zod
- Retornar erros padronizados: `{ success: false, error: string }`

### Componentes React
- Server Components por padrão
- 'use client' apenas quando necessário (hooks, eventos)
- Props interfaces sempre definidas
- Composição preferida sobre props booleanas

### Banco de Dados
- Migrations sempre versionadas
- Seeds para dados de desenvolvimento
- Índices em campos de busca frequentes

## Comandos do Projeto

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia build de produção

# Testes
npm test             # Testes unitários (Vitest)
npm run test:e2e     # Testes E2E (Playwright)
npm run test:ui      # Vitest com UI

# Qualidade de Código
npm run lint         # ESLint
npm run lint:fix     # ESLint com auto-fix
npm run type-check   # TypeScript check
npm run format       # Prettier

# Banco de Dados
npm run db:migrate   # Executa migrations
npm run db:seed      # Popula dados de teste
npm run db:studio    # Abre Prisma Studio
```

## Variáveis de Ambiente
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/ecommerce"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Fluxos de Negócio

### Checkout
1. Usuário adiciona produtos ao carrinho (localStorage + context)
2. Vai para checkout → cria Order no banco (status: PENDING)
3. Stripe checkout session criada
4. Webhook confirma pagamento → status: PAID
5. Envio de email de confirmação

### Autenticação
- NextAuth com credentials + Google OAuth
- JWT strategy
- Middleware protege rotas /admin/*

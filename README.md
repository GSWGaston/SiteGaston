# Portfólio — Matheus Gaston

Primeira versão funcional do portfólio pessoal de Matheus Gaston, construída com Next.js, TypeScript e Tailwind CSS.

## Executar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Validação

```bash
npm run lint
npm run typecheck
npm run build
```

## Atualizar conteúdo

- Projetos e categorias: `src/data/projects.ts`
- Informações pessoais, navegação, contatos, competências e ferramentas: `src/data/site.ts`
- Tipos dos cases: `src/types/project.ts`
- Tokens e estilos globais: `src/app/globals.css`

Contatos, redes e a URL pública (`https://mgsgaston.vercel.app`) ficam em `src/data/site.ts`. Projetos sem imagem de capa mostram uma área visual provisória até que a capa seja enviada pelo painel.

`src/data/projects.ts` é só uma cópia de referência usada quando não há `DATABASE_URL` (desenvolvimento local). Os projetos reais vivem no banco e são editados em `/admin`.

## Painel administrativo

O painel fica em `/admin` e usa exclusivamente serviços conectados pela Vercel:

- Neon Postgres para os dados dos projetos;
- Vercel Blob para imagens;
- Sign in with Vercel para autenticação;
- `ADMIN_EMAILS` para limitar o acesso aos e-mails autorizados.

Depois de conectar Neon e Blob no projeto Vercel, baixe as variáveis e prepare o banco:

```bash
vercel env pull .env.local
npm run db:setup
```

`db:setup` só aplica o schema (`database/schema.sql`, com `ADD COLUMN IF NOT EXISTS`); não cria, recria nem altera projetos.

Crie também um App em **Vercel → Team Settings → Apps**, habilite os escopos `openid`, `email` e `profile`, configure `/api/auth/callback` e preencha as variáveis listadas em `.env.example`.

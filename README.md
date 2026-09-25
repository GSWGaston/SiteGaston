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

Os contatos e o endereço público do site estão marcados como placeholders. Substitua-os em `src/data/site.ts` antes da publicação. As áreas visuais dos projetos também são placeholders intencionais até a inclusão das imagens reais.

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

Crie também um App em **Vercel → Team Settings → Apps**, habilite os escopos `openid`, `email` e `profile`, configure `/api/auth/callback` e preencha as variáveis listadas em `.env.example`.

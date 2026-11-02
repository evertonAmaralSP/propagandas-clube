# Propagandas Clube

Banco de imagens do clube para alimentar os templates de propaganda. Veja `CLAUDE.md` para rotas, banco e regras.

## Rodar local (Supabase local)

Precisa de Node 22 e Docker rodando.

```bash
npm install
npm run db:start            # sobe o Supabase local e aplica migrations + seed
npm run db:status           # copie a "Publishable key"
cp .env.example .env.local  # cole a chave em SUPABASE_PUBLISHABLE_KEY
npm run dev                 # http://localhost:3000
```

Contas do seed (só existem no Supabase local):

| E-mail | Senha |
| --- | --- |
| `lider@propagandas.local` | `senha-local-123` |
| `outro@propagandas.local` | `senha-local-123` |

Use a segunda para conferir que uma pessoa vê as fotos da outra, mas não consegue excluí-las.

- Studio (tabelas, Storage, usuários): http://127.0.0.1:55423
- `npm run db:reset` apaga tudo e reaplica migrations e seed. `npm run db:stop` desliga.

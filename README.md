# Propagandas Clube

Banco de imagens do clube para alimentar os templates de propaganda. Veja `CLAUDE.md` para rotas, banco e regras.

```bash
cp .env.example .env.local   # preencha com as chaves do Supabase
npm install
npm run dev
```

Antes do primeiro uso, aplique `supabase/migrations/0001_imagens.sql` no projeto Supabase.

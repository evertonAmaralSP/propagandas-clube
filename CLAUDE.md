# CLAUDE.md – Propagandas Clube

Banco de imagens e, no próximo passo, templates de propaganda/publicidade do clube. A base técnica vem do
repositório `chatbot` (Assistentes Clube), para não reinventar a roda: Next.js 15 (App Router), Supabase
(Auth, Postgres com RLS e Storage) e o visual do portal (`app/estilo/portal.module.css`, fontes locais,
moldura de acesso e `components/rota.tsx`).

## Rotas

- `/login`: e-mail e senha pelo Supabase Auth (cópia do chatbot). Não há cadastro aberto.
- `/enviar`: envio de imagens. Arrastar ou escolher várias; cada foto ganha nome (vem do arquivo) e a leva
  inteira recebe as mesmas etiquetas. Sobe uma por vez pela Server Action `enviarImagem`
  (`app/(app)/acoes.ts`), cada pedido abaixo dos 6 MB da função do Netlify.
- `/galeria`: todas as imagens (quem está logado vê as do clube inteiro), com busca sem acento, filtro por
  etiqueta e *Enviadas por mim*. Tocar abre o detalhe com *Baixar original* e *Excluir* (só quem enviou).
- `/api/imagens/<id>/baixar`: redireciona para uma URL assinada de 60 s com o nome da galeria.
- *Templates*: aparece no menu como "em breve" (passo 2).
- O `middleware.ts` protege tudo menos `/login`.

## Imagens

- Regras em `lib/imagens.ts`: PNG, JPG ou WebP, até 5 MB, tipo conferido pelos bytes (`tipoPelosBytes`),
  até 12 etiquetas (minúsculas, sem repetição), nome até 120 caracteres.
- Migration `supabase/migrations/0001_imagens.sql`: tabela `public.imagens` e balde privado `imagens`.
  - Arquivo em `imagens/<usuario_id>/<id>.<ext>`; as policies do Storage só deixam gravar e apagar na
    própria pasta. Se o registro falha, o arquivo sai do Storage.
  - A galeria assina as URLs no servidor (`createSignedUrls`, 1 hora) e o navegador baixa direto do
    Storage, sem passar pela função. Sem otimizador de imagem (transformação é recurso pago do Supabase).
- As medidas (largura × altura) são lidas no navegador antes do envio.

## Variáveis

`SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` (veja `.env.example`). O navegador não fala com o Supabase
(exceto para baixar a imagem pela URL assinada): a sessão é lida no servidor.

## Testes

`npm run lint`, `npx tsc --noEmit` e `npm run build`. Sem modelo de IA neste projeto até agora.

## Próximo passo

Galeria de templates de propaganda, que usa as imagens desta galeria como entrada.

## Idioma

Toda a interação com o usuário é em português do Brasil. Código e identificadores em português, como no chatbot.

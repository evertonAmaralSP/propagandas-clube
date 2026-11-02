# CLAUDE.md – Propagandas Clube

Banco de imagens, logo e templates de propaganda/publicidade do clube. A base técnica vem do
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
- `/logo` (*Logo do clube*): as versões do logo (colorido, branco...), só PNG transparente. Uma é a
  principal (o template usa quando ninguém escolhe outra); o primeiro envio já entra como principal e,
  se a principal for excluída, a mais nova assume. O logo é do clube: qualquer pessoa logada envia,
  troca a principal e exclui. Prévia sobre xadrez, fundo claro ou escuro. Baixar em `/api/logos/<id>/baixar`.
- `/templates` (*Nova propaganda*): dois modos. *Automático* (padrão) é o wizard em 4 passos: categoria, informações (mais as fotos e o logo do
  sorteio), modelos e opções sorteadas, das quais se marcam as que vão para a galeria. *Manual* (`?modo=manual`) é a lista dos 27 modelos por
  categoria, com miniatura; tocar abre o editor. `/templates/<id>` é o editor:
  formulário, prévia ao vivo, *Baixar PNG*, *Enviar no WhatsApp* e *Salvar na galeria*. Com `?de=<id>`
  abre a cópia de uma propaganda salva (mesmo template), já preenchida.
- `/propagandas`: a galeria das artes salvas (todas do clube), com busca, filtro por template e *Salvas por
  mim*. O detalhe tem *Baixar* (`/api/propagandas/<id>/baixar`), *Enviar no WhatsApp*, *Editar uma cópia* e
  *Excluir* (só quem salvou).
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

## Logos

- Regras em `lib/logos.ts`; ações em `app/(app)/logo/acoes.ts`. Migration `0002_logos.sql`: tabela
  `public.logos` (índice único garante uma principal só), função `definir_logo_principal` (troca numa
  transação) e balde privado `logos` só de PNG, arquivo em `logos/<id>.png`.
- Transparência conferida em duas camadas: o servidor (`conferirPng`) exige canal alfa ou bloco `tRNS`
  pelos bytes; o navegador decodifica e barra PNG com alfa mas todo opaco. Abaixo de 500 px só avisa.

## Templates (motor de propagandas)

- Os desenhos vêm do canvas "Chamadas do Clube": 27 templates em 2 categorias. **Reunião Regular**:
  `reuniao` e `r01`–`r12` (ids `rr-*`). **Eventos**: `t01`–`t12` (Investidura, Trilha, Campori…, ids `ev-*`),
  `acampamento` e `traga-um-amigo`. Traduzidos para React em `components/templates/` com as mesmas medidas.
- Um template é uma `DefinicaoDeTemplate` (`components/templates/motor.ts`): campos (texto, tamanho, cor
  com opções, foto, logo) e um componente `Arte` de tamanho fixo (540×960). Template novo = um arquivo com
  definição e arte, registrado em `components/templates/index.ts`; o editor monta o formulário sozinho.
- Wizard (`app/(app)/templates/wizard.tsx`): as `Informacoes` (`components/templates/informacoes.ts`: título,
  chamada, data, hora, local, itens, frase, versículo, nome do clube) são pedidas uma vez. Cada template tem
  `categoria` e `deInformacoes`, que formata no jeito dele (`dataBarra` "05|09", `dataPorExtenso`, `dia`/`mesCurto`,
  `horaFaixa`, itens com •, com · ou em frase; `tamanhoQueCabe` reduz títulos que não cabem). Regra: em Reunião
  Regular, opcional vazio usa o padrão do modelo (`seTiver`); em Eventos, vazio fica vazio e o elemento some, para
  texto de um evento (ex.: "CERIMÔNIA DE", "8 KM") não vazar em outro.
- Sorteio (`components/templates/sorteio.ts`): fotos (galeria toda, por etiqueta ou escolhidas), cores entre as
  opções do modelo e logo (sortear entre as versões, versão fixa ou sem logo). Até 24 opções por vez. O estado do
  wizard fica no `sessionStorage` (`wizard:propagandas`); *Ajustar* abre o editor com `?rascunho=<chave>` e volta
  sem perder nada. O nome do clube fica no `localStorage`. Publicar gera o PNG de cada opção marcada (da própria
  miniatura, em tamanho cheio) e salva uma por vez com `salvarPropaganda`.
- Foto e logo guardam o id; `resolverImagens` troca pela URL assinada. Toda foto e todo texto `obrigatorio`
  precisam estar preenchidos para gerar (`pendencias`). Logo vazio = arte sem logo; começa na principal.
- O PNG sai no navegador, da própria prévia, com `modern-screenshot` em 2× (1080×1920), sem passar pela
  função. O Storage precisa responder com CORS (responde `*`), senão as fotos saem em branco.
- WhatsApp: com `navigator.canShare({ files })` (celular) abre o menu de compartilhar com a imagem; se o
  navegador perder o gesto enquanto gera, aparece *Toque para enviar*. Sem isso (computador), baixa o PNG
  e abre o WhatsApp Web.
- Fontes das artes locais (`components/templates/fontes.ts`, caminhos escritos por extenso: o `next/font` não aceita
  caminho montado com variável): Anton, Montserrat, Raleway, Gochi Hand, Playfair Display, Archivo, Archivo Black,
  Bebas Neue, Poppins, Oswald, Inter, DM Serif Display, Outfit, Caveat e Fraunces.
- *Salvar na galeria* (`salvarPropaganda` em `app/(app)/propagandas/acoes.ts`) sobe o mesmo PNG pela Server
  Action; se passar de 5 MB, vai em JPG (0,9 → 0,7). Migration `0003_propagandas.sql`: tabela
  `public.propagandas` com os `valores` do formulário em jsonb (limpos por `limparValores`, que só aceita as
  chaves e os tipos do template) e balde privado `propagandas` em `<usuario_id>/<id>.<ext>`.
- Na cópia, foto ou logo que foram excluídos depois voltam vazios (e a arte pede de novo).

## Desenvolvimento local

Por decisão do dono, o desenvolvimento segue com **Supabase local** (CLI `supabase` nas devDependencies,
`supabase/config.toml`): `npm run db:start`, `db:status`, `db:reset` e `db:stop`. O `supabase/seed.sql` cria
duas contas locais (`lider@` e `outro@propagandas.local`, senha no README). O cadastro aberto fica desligado
(`enable_signup = false`), como no chatbot. Ainda não há projeto Supabase na nuvem nem site no Netlify.
As portas locais ficam na faixa 554xx (API 55421, banco 55422, Studio 55423), porque outro projeto da
máquina já usa as padrão 543xx. Migration nova sem perder dados: `npx supabase migration up`.

## Variáveis

`SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` (veja `.env.example`). O navegador não fala com o Supabase
(exceto para baixar a imagem pela URL assinada): a sessão é lida no servidor.

## Testes

`npm run lint`, `npx tsc --noEmit` e `npm run build`. Sem modelo de IA neste projeto até agora.

## Idioma

Toda a interação com o usuário é em português do Brasil. Código e identificadores em português, como no chatbot.

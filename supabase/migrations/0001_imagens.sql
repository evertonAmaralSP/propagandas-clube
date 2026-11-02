-- Banco de imagens das propagandas: as fotos que alimentam os templates de publicidade.
-- O arquivo fica no Storage (balde privado `imagens`, em <usuario_id>/<id>.<ext>) e os dados
-- de cada foto em public.imagens. O navegador não fala com o Supabase: o servidor lê e grava
-- com a sessão de quem está logado; a galeria recebe URLs assinadas de curta duração.
--
-- Quem está logado vê todas as imagens (a galeria é do clube); só quem enviou apaga ou edita.

create table public.imagens (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  caminho text not null unique,
  nome text not null check (char_length(nome) between 1 and 120),
  etiquetas text[] not null default '{}' check (cardinality(etiquetas) <= 12),
  tipo text not null check (tipo in ('image/png', 'image/jpeg', 'image/webp')),
  tamanho integer not null check (tamanho > 0 and tamanho <= 5242880),
  largura integer check (largura > 0),
  altura integer check (altura > 0),
  criado_em timestamptz not null default now()
);

create index imagens_criado_em on public.imagens (criado_em desc);
create index imagens_usuario on public.imagens (usuario_id);

alter table public.imagens enable row level security;

create policy "imagens: logado lê" on public.imagens for select to authenticated
  using (true);
create policy "imagens: envia como si" on public.imagens for insert to authenticated
  with check (usuario_id = (select auth.uid()));
create policy "imagens: dono edita" on public.imagens for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));
create policy "imagens: dono apaga" on public.imagens for delete to authenticated
  using (usuario_id = (select auth.uid()));

-- Balde privado: 5 MB por arquivo, só PNG, JPG e WebP (o servidor confere também pelos bytes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', false, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "imagens: logado baixa" on storage.objects for select to authenticated
  using (bucket_id = 'imagens');
-- cada pessoa só grava e apaga dentro da própria pasta (<usuario_id>/...)
create policy "imagens: envia na própria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'imagens' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "imagens: apaga da própria pasta" on storage.objects for delete to authenticated
  using (bucket_id = 'imagens' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Galeria de propagandas: as artes geradas pelos templates e salvas pelo editor. O arquivo fica no
-- Storage (balde privado `propagandas`, em <usuario_id>/<id>.<ext>) e os dados em public.propagandas,
-- incluindo os valores do formulário, para reabrir o editor e fazer uma cópia.
--
-- Como na galeria de fotos: quem está logado vê todas; só quem salvou apaga.

create table public.propagandas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  template text not null check (template ~ '^[a-z0-9-]{1,40}$'),
  nome text not null check (char_length(nome) between 1 and 120),
  caminho text not null unique,
  tipo text not null check (tipo in ('image/png', 'image/jpeg')),
  tamanho integer not null check (tamanho > 0 and tamanho <= 5242880),
  largura integer not null check (largura > 0),
  altura integer not null check (altura > 0),
  -- textos, cores e os ids de fotos e logo; limitado para não virar depósito
  valores jsonb not null default '{}' check (jsonb_typeof(valores) = 'object' and pg_column_size(valores) <= 32768),
  criado_em timestamptz not null default now()
);

create index propagandas_criado_em on public.propagandas (criado_em desc);
create index propagandas_usuario on public.propagandas (usuario_id);

alter table public.propagandas enable row level security;

create policy "propagandas: logado lê" on public.propagandas for select to authenticated using (true);
create policy "propagandas: salva como si" on public.propagandas for insert to authenticated
  with check (usuario_id = (select auth.uid()));
create policy "propagandas: dono apaga" on public.propagandas for delete to authenticated
  using (usuario_id = (select auth.uid()));

-- Balde privado: 5 MB por arquivo, PNG ou JPG (JPG só quando o PNG passa do limite).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('propagandas', 'propagandas', false, 5242880, array['image/png', 'image/jpeg'])
on conflict (id) do nothing;

create policy "propagandas: logado baixa" on storage.objects for select to authenticated
  using (bucket_id = 'propagandas');
create policy "propagandas: salva na própria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'propagandas' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "propagandas: apaga da própria pasta" on storage.objects for delete to authenticated
  using (bucket_id = 'propagandas' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Logos do clube: as versões do logo (colorido, branco para fundo escuro, só o símbolo...) que os
-- templates de propaganda vão aplicar sobre as fotos. Só PNG com transparência (o servidor confere
-- pelos bytes). Uma versão é a principal: é a que o template usa quando ninguém escolhe outra.
--
-- O logo é do clube, não de quem enviou: qualquer pessoa logada vê, envia, troca a principal e
-- exclui. `usuario_id` fica só como registro de quem enviou.

create table public.logos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid default auth.uid() references auth.users (id) on delete set null,
  caminho text not null unique,
  nome text not null check (char_length(nome) between 1 and 120),
  principal boolean not null default false,
  tamanho integer not null check (tamanho > 0 and tamanho <= 5242880),
  largura integer check (largura > 0),
  altura integer check (altura > 0),
  criado_em timestamptz not null default now()
);

-- no máximo uma principal
create unique index logos_uma_principal on public.logos (principal) where principal;
create index logos_criado_em on public.logos (criado_em desc);

alter table public.logos enable row level security;

create policy "logos: logado lê" on public.logos for select to authenticated using (true);
create policy "logos: logado envia" on public.logos for insert to authenticated
  with check (usuario_id = (select auth.uid()));
create policy "logos: logado edita" on public.logos for update to authenticated using (true) with check (true);
create policy "logos: logado apaga" on public.logos for delete to authenticated using (true);

-- Troca a principal numa transação só: primeiro tira a marca da atual, depois põe na escolhida
-- (o índice único não deixa as duas marcadas nem por um instante).
create function public.definir_logo_principal(alvo uuid) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (select 1 from public.logos where id = alvo) then
    raise exception 'logo não encontrado' using errcode = 'P0002';
  end if;
  update public.logos set principal = false where principal and id <> alvo;
  update public.logos set principal = true where id = alvo and not principal;
end;
$$;

revoke execute on function public.definir_logo_principal(uuid) from public, anon;
grant execute on function public.definir_logo_principal(uuid) to authenticated;

-- Balde privado só de PNG, 5 MB por arquivo. Arquivo em <id>.png, sem pasta por pessoa.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', false, 5242880, array['image/png'])
on conflict (id) do nothing;

create policy "logos: logado baixa" on storage.objects for select to authenticated
  using (bucket_id = 'logos');
create policy "logos: logado envia arquivo" on storage.objects for insert to authenticated
  with check (bucket_id = 'logos');
create policy "logos: logado apaga arquivo" on storage.objects for delete to authenticated
  using (bucket_id = 'logos');

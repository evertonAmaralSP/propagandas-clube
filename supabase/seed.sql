-- Contas do Supabase LOCAL, para validar as telas (rodado por `npm run db:reset`).
-- Só existem na máquina de quem desenvolve: nunca rode este arquivo num projeto da nuvem.
--   lider@propagandas.local  / senha-local-123
--   outro@propagandas.local  / senha-local-123   (para conferir que um não exclui a foto do outro)

do $$
declare
  conta record;
begin
  for conta in
    select * from (values
      ('00000000-0000-4000-8000-000000000001'::uuid, 'lider@propagandas.local', 'Líder Local'),
      ('00000000-0000-4000-8000-000000000002'::uuid, 'outro@propagandas.local', 'Outra Pessoa')
    ) as c(id, email, nome)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', conta.id, 'authenticated', 'authenticated', conta.email,
      extensions.crypt('senha-local-123', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', jsonb_build_object('nome', conta.nome), now(), now(),
      '', '', '', ''
    );
    insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), conta.id, conta.id::text, 'email',
      jsonb_build_object('sub', conta.id::text, 'email', conta.email, 'email_verified', true), now(), now(), now());
  end loop;
end $$;

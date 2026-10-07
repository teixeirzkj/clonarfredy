-- Banco do portal do cliente (Setup da Conta · Frédy)
-- Rodar uma vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- Guarda os acessos do portal e os cadastros (chave → valor em JSON).
-- O token do WTS de cada cliente fica criptografado pela página antes de chegar aqui.

create table if not exists public.portal_kv (
  key        text primary key,
  value      jsonb,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Fechada para acesso de fora: RLS ligado e nenhuma política.
-- Só a chave service_role (que fica no servidor da Vercel) consegue ler e gravar.
alter table public.portal_kv enable row level security;
revoke all on table public.portal_kv from anon, authenticated;

-- Contador com validade (tentativas de login e envios do cadastro), sem disputa entre acessos.
create or replace function public.portal_hit(k text, ttl integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  insert into portal_kv (key, value, expires_at)
  values (k, '1'::jsonb, now() + make_interval(secs => ttl))
  on conflict (key) do update set
    value = case
      when portal_kv.expires_at is null or portal_kv.expires_at < now() then '1'::jsonb
      else to_jsonb((portal_kv.value #>> '{}')::integer + 1)
    end,
    expires_at = case
      when portal_kv.expires_at is null or portal_kv.expires_at < now() then now() + make_interval(secs => ttl)
      else portal_kv.expires_at
    end,
    updated_at = now()
  returning (value #>> '{}')::integer into n;
  return n;
end;
$$;

revoke all on function public.portal_hit(text, integer) from public, anon, authenticated;
grant execute on function public.portal_hit(text, integer) to service_role;

-- Limpeza opcional dos contadores vencidos (pode rodar quando quiser):
-- delete from public.portal_kv where expires_at is not null and expires_at < now();

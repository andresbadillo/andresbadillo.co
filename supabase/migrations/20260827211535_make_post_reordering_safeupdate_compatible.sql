-- PostgREST se conecta mediante `authenticator`, que precarga `safeupdate` y
-- exige un WHERE explícito incluso cuando la intención es actualizar la tabla.
create or replace function public.create_post_at_top(
  p_slug text,
  p_title text,
  p_excerpt text,
  p_published_at date,
  p_featured boolean,
  p_tags text[],
  p_cover_key text,
  p_linkedin_embed jsonb
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_post_id bigint;
begin
  if coalesce(auth.jwt()->'app_metadata'->>'role', '') <> 'admin' then
    raise exception 'Administrators only' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(728496036492401);

  if exists (select 1 from public.posts where display_order >= 9999) then
    raise exception 'Post position limit reached' using errcode = '23514';
  end if;

  update public.posts
  set display_order = display_order + 1
  where true;

  insert into public.posts (
    slug,
    title,
    excerpt,
    published_at,
    featured,
    tags,
    cover_key,
    linkedin_embed,
    display_order
  ) values (
    p_slug,
    p_title,
    p_excerpt,
    p_published_at,
    p_featured,
    p_tags,
    p_cover_key,
    p_linkedin_embed,
    0
  )
  returning id into new_post_id;

  return new_post_id;
end;
$$;

revoke all on function public.create_post_at_top(
  text, text, text, date, boolean, text[], text, jsonb
) from public, anon;

grant execute on function public.create_post_at_top(
  text, text, text, date, boolean, text[], text, jsonb
) to authenticated;

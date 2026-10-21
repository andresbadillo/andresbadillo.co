-- Localiza título, extracto y etiquetas de posts en la misma fila.
-- El texto actual pasa al idioma en que está escrito y esta migración redacta el otro.
-- La aplicación deja de leer title, excerpt y tags text[].

alter table public.posts
  add column title_es text,
  add column title_en text,
  add column excerpt_es text,
  add column excerpt_en text;

update public.posts
set title_es = title,
    excerpt_es = excerpt;

-- "Control" by Freddy Vega está escrito en inglés. El extracto de esa fila está en español.
update public.posts
set title_en = title,
    excerpt_es = excerpt
where slug = 'control';

update public.posts
set title_en = $ten_desarrollo_automatizado$My programmer has no phone. Or hands$ten_desarrollo_automatizado$,
    excerpt_en = $een_desarrollo_automatizado$I asked my programmer to merge into master while I was out on the street. My programmer has no phone. Or hands.$een_desarrollo_automatizado$
where slug = 'desarrollo-automatizado';

update public.posts
set title_en = $ten_buscar_documentos_fisicos$Finding a document used to take hours$ten_buscar_documentos_fisicos$,
    excerpt_en = $een_buscar_documentos_fisicos$The most powerful tool I have shipped did not cost me a peso in new licenses.$een_buscar_documentos_fisicos$
where slug = 'buscar-documentos-fisicos';

update public.posts
set title_en = $ten_tu_automatizacion_tiene_vencimiento$Your automation has an expiration date$ten_tu_automatizacion_tiene_vencimiento$,
    excerpt_en = $een_tu_automatizacion_tiene_vencimiento$On October 14 OpenAI announced that on January 14, 2027 it shuts down GPT-4o, GPT-4o mini, GPT-4.1, and GPT-4.1 mini in its API.$een_tu_automatizacion_tiene_vencimiento$
where slug = 'tu-automatizacion-tiene-vencimiento';

update public.posts
set title_en = $ten_4_anios_con_ia$4 years with AI$ten_4_anios_con_ia$,
    excerpt_en = $een_4_anios_con_ia$I started using ChatGPT 4 years ago.

As soon as they approved my subscription, I used it every day. Today I am amazed. And, to be honest, a little terrified too. One fact sums it up better than any opinion.$een_4_anios_con_ia$
where slug = '4-anios-con-ia';

update public.posts
set title_en = $ten_metale_mas_ia$Just add more AI$ten_metale_mas_ia$,
    excerpt_en = $een_metale_mas_ia$The line comes from above and almost always without a name: it does not say which process, with which data, or what it should solve.$een_metale_mas_ia$
where slug = 'metale-mas-ia';

update public.posts
set title_en = $ten_github$Contributions on GitHub$ten_github$,
    excerpt_en = $een_github$Today I looked at my GitHub contribution graph and it stood out: 236 contributions in the last year.$een_github$
where slug = 'github';

update public.posts
set title_es = $tes_control$"Control" de Freddy Vega$tes_control$,
    title_en = $ten_control$"Control" by Freddy Vega$ten_control$,
    excerpt_en = $een_control$Control is not rigidity. Control is direction.$een_control$
where slug = 'control';

update public.posts
set title_en = $ten_preparen_fuego_apunten$Ready - Fire - Aim$ten_preparen_fuego_apunten$,
    excerpt_en = $een_preparen_fuego_apunten$Do not wait for the perfect solution before you start.$een_preparen_fuego_apunten$
where slug = 'preparen-fuego-apunten';

update public.posts
set title_en = $ten_web_personal$Building for myself$ten_web_personal$,
    excerpt_en = $een_web_personal$Some of the best things are born when you decide to build for yourself.$een_web_personal$
where slug = 'web-personal';

update public.posts
set title_en = $ten_interseccion_de_habilidades$Intersection of skills$ten_interseccion_de_habilidades$,
    excerpt_en = $een_interseccion_de_habilidades$Do not underestimate what you know once you decide to combine it.$een_interseccion_de_habilidades$
where slug = 'interseccion-de-habilidades';

update public.posts
set title_en = $ten_liderando_equipos$Leading teams$ten_liderando_equipos$,
    excerpt_en = $een_liderando_equipos$The leader who understands the business and also builds solutions transforms organizations.$een_liderando_equipos$
where slug = 'liderando-equipos';

update public.posts
set title_en = $ten_disciplina_de_datos$Data discipline$ten_disciplina_de_datos$,
    excerpt_en = $een_disciplina_de_datos$Data discipline is the foundation of digital transformation.$een_disciplina_de_datos$
where slug = 'disciplina-de-datos';

update public.posts
set title_en = $ten_valor_de_negocio$Business value - digital transformation$ten_valor_de_negocio$,
    excerpt_en = $een_valor_de_negocio$Knowing the business value is the foundation of digital transformation.$een_valor_de_negocio$
where slug = 'valor-de-negocio';

update public.posts
set title_en = $ten_construyendo_soluciones$Building solutions$ten_construyendo_soluciones$,
    excerpt_en = $een_construyendo_soluciones$Leadership is also measured by the friction you take off your team.$een_construyendo_soluciones$
where slug = 'construyendo-soluciones';

update public.posts
set title_en = $ten_pensar_en_sistemas$Think in systems, not only in solutions$ten_pensar_en_sistemas$,
    excerpt_en = $een_pensar_en_sistemas$Quick solutions win weeks. Well-designed systems win years.$een_pensar_en_sistemas$
where slug = 'pensar-en-sistemas';

alter table public.posts
  add column tags_i18n jsonb;

update public.posts
set tags_i18n = (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'slug', lower(item.tag),
        'es', item.tag,
        'en', case item.tag
          when 'Automatización' then 'Automation'
          when 'Desarrollo' then 'Development'
          when 'IA' then 'AI'
          when 'IA Generativa' then 'Generative AI'
          when 'Disciplina' then 'Discipline'
          when 'Liderazgo' then 'Leadership'
          when 'Transformación Digital' then 'Digital transformation'
          when 'Productividad' then 'Productivity'
          when 'Negocios' then 'Business'
          else item.tag
        end
      )
      order by item.ordinality
    ),
    '[]'::jsonb
  )
  from unnest(tags) with ordinality as item(tag, ordinality)
);

alter table public.posts drop constraint if exists posts_content_limits;

alter table public.posts drop column title;
alter table public.posts drop column excerpt;
alter table public.posts drop column tags;

alter table public.posts rename column tags_i18n to tags;

alter table public.posts
  alter column tags set default '[]'::jsonb,
  alter column tags set not null;

alter table public.posts
  add constraint posts_content_limits
  check (
    (title_es is not null or title_en is not null)
    and (excerpt_es is not null or excerpt_en is not null)
    and (title_es is null or char_length(btrim(title_es)) between 1 and 120)
    and (title_en is null or char_length(btrim(title_en)) between 1 and 120)
    and (excerpt_es is null or char_length(btrim(excerpt_es)) between 1 and 300)
    and (excerpt_en is null or char_length(btrim(excerpt_en)) between 1 and 300)
    and display_order between 0 and 9999
    and jsonb_typeof(tags) = 'array'
    and jsonb_array_length(tags) <= 10
  );

alter table public.posts validate constraint posts_content_limits;

drop function if exists public.create_post_at_top(text, text, text, date, boolean, text[], text, jsonb);

create function public.create_post_at_top(
  p_slug text,
  p_title_es text,
  p_title_en text,
  p_excerpt_es text,
  p_excerpt_en text,
  p_published_at date,
  p_featured boolean,
  p_tags jsonb,
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
    title_es,
    title_en,
    excerpt_es,
    excerpt_en,
    published_at,
    featured,
    tags,
    cover_key,
    linkedin_embed,
    display_order
  ) values (
    p_slug,
    p_title_es,
    p_title_en,
    p_excerpt_es,
    p_excerpt_en,
    p_published_at,
    p_featured,
    coalesce(p_tags, '[]'::jsonb),
    p_cover_key,
    p_linkedin_embed,
    0
  )
  returning id into new_post_id;

  return new_post_id;
end;
$$;

revoke all on function public.create_post_at_top(
  text, text, text, text, text, date, boolean, jsonb, text, jsonb
) from public, anon;

grant execute on function public.create_post_at_top(
  text, text, text, text, text, date, boolean, jsonb, text, jsonb
) to authenticated;

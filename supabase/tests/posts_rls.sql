begin;

create extension if not exists pgtap with schema extensions;
select plan(18);

insert into public.posts (
  id, slug, title, excerpt, published_at, featured, tags, cover_key, linkedin_embed, display_order
) values (
  900001, 'rls-existing', 'RLS existing', 'Policy test row', now(), false, '{}', 'thumb-1', null, 9000
);

set local role anon;
select is((select count(*) from public.posts where id = 900001), 1::bigint, 'anon can read posts');
select throws_ok(
  $$insert into public.posts (id, slug, title, excerpt, published_at, display_order) values (900002, 'anon-write', 'Denied', 'Denied', now(), 9001)$$,
  '42501',
  'permission denied for table posts',
  'anon cannot insert posts'
);
select is(
  has_function_privilege(
    current_user,
    'public.create_post_at_top(text,text,text,date,boolean,text[],text,jsonb)',
    'EXECUTE'
  ),
  false,
  'anon has no execute privilege on the create-post RPC'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","app_metadata":{"role":"viewer"}}', true);
set local role authenticated;
select is((select count(*) from public.posts where id = 900001), 1::bigint, 'authenticated non-admin can read posts');
select throws_ok(
  $$insert into public.posts (id, slug, title, excerpt, published_at, display_order) values (900003, 'viewer-write', 'Denied', 'Denied', now(), 9002)$$,
  '42501',
  'new row violates row-level security policy for table "posts"',
  'authenticated non-admin cannot insert posts'
);
update public.posts set title = 'Viewer changed it' where id = 900001;
select is((select title from public.posts where id = 900001), 'RLS existing', 'authenticated non-admin cannot update posts');
select throws_ok(
  $$select public.create_post_at_top('viewer-rpc', 'Denied', 'Denied', current_date, false, '{}', null, null)$$,
  '42501',
  'Administrators only',
  'authenticated non-admin cannot create a post through the RPC'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","app_metadata":{"role":"admin"}}', true);
set local role authenticated;
insert into public.posts (
  id, slug, title, excerpt, published_at, featured, tags, cover_key, linkedin_embed, display_order
) values (
  900004, 'admin-write', 'Admin created', 'Allowed', now(), false, '{}', 'thumb-1', null, 9003
);
select is((select count(*) from public.posts where id = 900004), 1::bigint, 'admin can insert posts');
update public.posts set title = 'Admin updated' where id = 900004;
select is((select title from public.posts where id = 900004), 'Admin updated', 'admin can update posts');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","app_metadata":{}}', true);
set local role authenticated;
update public.posts set title = 'Stale token update' where id = 900004;
select is((select title from public.posts where id = 900004), 'Admin updated', 'writes stop when refreshed token loses admin role');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","app_metadata":{"role":"admin"}}', true);
set local role authenticated;
select lives_ok(
  $$insert into public.posts (id, slug, title, excerpt, published_at, display_order, linkedin_embed) values (
    900005,
    'valid-linkedin-embed',
    'Valid embed',
    'Allowed',
    now(),
    9004,
    '{"compact":{"src":"https://www.linkedin.com/embed/feed/update/1","width":320,"height":200},"full":{"src":"https://www.linkedin.com/embed/feed/update/1","width":800,"height":1000}}'
  )$$,
  'admin can insert a valid LinkedIn embed'
);
select throws_ok(
  $$insert into public.posts (id, slug, title, excerpt, published_at, display_order, linkedin_embed) values (
    900006,
    'missing-linkedin-src',
    'Missing src',
    'Denied',
    now(),
    9005,
    '{"compact":{"width":320},"full":{"src":"https://www.linkedin.com/embed/feed/update/1"}}'
  )$$,
  '23514',
  'new row for relation "posts" violates check constraint "posts_linkedin_embed_safe"',
  'database rejects a LinkedIn embed without src'
);
select throws_ok(
  $$insert into public.posts (id, slug, title, excerpt, published_at, display_order, linkedin_embed) values (
    900007,
    'malicious-linkedin-host',
    'Malicious host',
    'Denied',
    now(),
    9006,
    '{"compact":{"src":"https://www.linkedin.com.evil.test/embed/1"},"full":{"src":"https://www.linkedin.com/embed/feed/update/1"}}'
  )$$,
  '23514',
  'new row for relation "posts" violates check constraint "posts_linkedin_embed_safe"',
  'database rejects a malicious LinkedIn host'
);
delete from public.posts where id = 900005;
delete from public.posts where id = 900004;
select is((select count(*) from public.posts where id = 900004), 0::bigint, 'admin can delete posts');

select lives_ok(
  $$select public.create_post_at_top(
    'admin-rpc',
    'Created at top',
    'Allowed',
    current_date,
    false,
    '{Supabase}',
    'thumb-1',
    null
  )$$,
  'admin can create a post atomically at the top'
);
select is(
  (select display_order from public.posts where slug = 'admin-rpc'),
  0,
  'the newly created post receives position zero'
);
select is(
  (select display_order from public.posts where id = 900001),
  9001,
  'the existing post moves down one position'
);
select is(
  (select count(*) from public.posts),
  (select count(distinct display_order) from public.posts),
  'all display positions remain unique'
);
delete from public.posts where slug = 'admin-rpc';
reset role;

select * from finish();
rollback;

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('profile SQL: A/B/anonymous isolation, public projection, suspension and transactional updates', async () => {
  const db = new PGlite();
  const a = '11111111-1111-4111-8111-111111111111';
  const b = '22222222-2222-4222-8222-222222222222';
  const role = async (name: 'authenticated' | 'anon' | 'postgres', id = '') => {
    await db.exec('reset role');
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
    await db.exec(`set role ${name}`);
  };
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;`);
    await db.exec(await readFile(new URL('../supabase/migrations/20261109000100_foundation_auth_creator.sql', import.meta.url), 'utf8'));
    await db.exec(await readFile(new URL('../supabase/proposals/creator_public_profile.sql', import.meta.url), 'utf8'));
    await db.query('insert into auth.users(id) values ($1),($2)', [a, b]);
    await role('authenticated', a);
    await db.query('insert into public.creator_profiles(user_id,username,display_name) values ($1,$2,$3)', [a, 'alice', 'Alice']);
    assert.equal((await db.query<{ problem: string | null }>("select public.username_problem('alice') as problem")).rows[0].problem, 'taken');
    assert.equal((await db.query<{ problem: string | null }>("select public.username_problem('available') as problem")).rows[0].problem, null);
    assert.equal((await db.query<{ problem: string | null }>("select public.username_problem('app') as problem")).rows[0].problem, 'reserved');
    await role('anon');
    assert.equal((await db.query<Record<string, unknown>>("select * from public.get_public_creator('alice')")).rows.length, 0);
    await assert.rejects(db.query('select * from public.creator_profiles'));
    await assert.rejects(db.query<{ problem: string | null }>("select public.username_problem('alice')"));
    await role('authenticated', a);
    const save = (name: string, timezone: string, links = '[]') => db.query('select public.save_creator_profile($1,$2,$3,$4,$5,true)', [name, 'Bio', 'pt-br', timezone, links]);
    await save('Alice Public', 'America/Sao_Paulo', '[{"network":"instagram","url":"https://instagram.com/alice"}]');
    await assert.rejects(save('Should rollback', 'Not/A_Timezone'));
    assert.equal((await db.query<{ display_name: string }>('select display_name from public.creator_profiles')).rows[0].display_name, 'Alice Public');
    await assert.rejects(save('Invalid link', 'UTC', '[{"network":"instagram","url":"javascript:alert(1)"}]'));
    await assert.rejects(save('Missing URL', 'UTC', '[{"network":"instagram","other":"x"}]'));
    await assert.rejects(db.query("update public.creator_profiles set avatar_namespace=gen_random_uuid()"));
    await assert.rejects(db.query("update public.creator_profiles set avatar_path='00000000-0000-0000-0000-000000000000/22222222-2222-4222-8222-222222222222.webp'"));
    await role('authenticated', b);
    assert.equal((await db.query('select * from public.creator_profiles')).rows.length, 0);
    assert.equal((await db.query("update public.creator_profiles set display_name='Attacker' returning user_id")).rows.length, 0);
    await assert.rejects(db.query('insert into public.creator_profiles(user_id,username,display_name) values ($1,$2,$3)', [b, 'alice', 'Other']));
    await role('anon');
    const rows = (await db.query<Record<string, unknown>>("select * from public.get_public_creator('alice')")).rows;
    assert.equal(rows.length, 1);
    assert.deepEqual(Object.keys(rows[0]).sort(), ['username','display_name','bio','avatar_path','social_links'].sort());
    await role('postgres');
    await db.query("update public.profiles set account_state='suspended' where user_id=$1", [a]);
    await role('anon');
    assert.equal((await db.query<Record<string, unknown>>("select * from public.get_public_creator('alice')")).rows.length, 0);
    await role('authenticated', a);
    await assert.rejects(save('Suspended', 'UTC'));
    await assert.rejects(db.query<{ problem: string | null }>("select public.username_problem('available')"));
    assert.equal((await db.query("update public.creator_profiles set bio='blocked' returning user_id")).rows.length, 0);
  } finally { await db.close(); }
});

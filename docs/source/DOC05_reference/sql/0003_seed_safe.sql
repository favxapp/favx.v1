-- 0003_seed_safe.sql — somente valores conhecidos, sem suposicao de ano/mensal internacional
BEGIN;
INSERT INTO app.plans(id,label) VALUES ('creator_free','Creator Free'),('creator_plus','Creator Plus') ON CONFLICT DO NOTHING;
INSERT INTO app.plan_prices(plan_id,currency,billing_interval,minor_units,is_approved)
VALUES ('creator_plus','BRL','month',8990,true),('creator_plus','BRL','year',89900,true),
       ('creator_plus','USD','month',1900,true),('creator_plus','EUR','month',1900,true)
ON CONFLICT (plan_id,currency,billing_interval) DO NOTHING;
INSERT INTO app.feature_flags(flag_key,enabled) VALUES
 ('marketplace_brands',false),('global_search',false),('events',false),('proof',false),
 ('conversational_search',false),('native_capture',false),('creator_plus_billing',false)
ON CONFLICT DO NOTHING;
INSERT INTO app.reserved_slugs(slug,reason) VALUES
 ('api','system'),('admin','system'),('login','system'),('signup','system'),
 ('settings','system'),('search','system'),('pricing','system'),('partners','system'),
 ('help','system'),('privacy','system'),('terms','system')
ON CONFLICT DO NOTHING;
COMMIT;

-- A2 and B1 live class groups — same time slots as A1.
-- Run in the Supabase SQL editor (idempotent). Mirrors the A1 seed in
-- 2026-06-22_live_classes.sql.
insert into public.class_groups (id, label, schedule, level, room_slug, sort_order) values
  ('a2-1600',    'A2 — 16h-17h',           'Lun-Ven 16:00-17:00', 'a2', 'GoGermanyA2-1600', 11),
  ('a2-1700',    'A2 — 17h-18h',           'Lun-Ven 17:00-18:00', 'a2', 'GoGermanyA2-1700', 12),
  ('a2-1800',    'A2 — 18h-19h',           'Lun-Ven 18:00-19:00', 'a2', 'GoGermanyA2-1800', 13),
  ('a2-1900',    'A2 — 19h-20h',           'Lun-Ven 19:00-20:00', 'a2', 'GoGermanyA2-1900', 14),
  ('a2-weekend', 'A2 Intensif — Week-end', 'Sam-Dim 16:00-19:00', 'a2', 'GoGermanyA2-WE',   15),
  ('b1-1600',    'B1 — 16h-17h',           'Lun-Ven 16:00-17:00', 'b1', 'GoGermanyB1-1600', 21),
  ('b1-1700',    'B1 — 17h-18h',           'Lun-Ven 17:00-18:00', 'b1', 'GoGermanyB1-1700', 22),
  ('b1-1800',    'B1 — 18h-19h',           'Lun-Ven 18:00-19:00', 'b1', 'GoGermanyB1-1800', 23),
  ('b1-1900',    'B1 — 19h-20h',           'Lun-Ven 19:00-20:00', 'b1', 'GoGermanyB1-1900', 24),
  ('b1-weekend', 'B1 Intensif — Week-end', 'Sam-Dim 16:00-19:00', 'b1', 'GoGermanyB1-WE',   25)
on conflict (id) do nothing;

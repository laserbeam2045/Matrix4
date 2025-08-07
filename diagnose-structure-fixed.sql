-- Diagnose the current data structure and constraints (PostgreSQL 12+ compatible)

-- 1. Check current data structure
SELECT id, txt, lft, rgt, 
       (rgt - lft) as space_size,
       lft::text as lft_text,
       rgt::text as rgt_text
FROM sets 
ORDER BY lft;

-- 2. Check for duplicates in lft/rgt values
SELECT lft, COUNT(*) as lft_count FROM sets GROUP BY lft HAVING COUNT(*) > 1;
SELECT rgt, COUNT(*) as rgt_count FROM sets GROUP BY rgt HAVING COUNT(*) > 1;

-- 3. Check constraints (PostgreSQL 12+ compatible)
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'sets'::regclass;

-- 4. Check unique constraints specifically
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'sets';

-- 5. See what values are available for insertion
SELECT 
    id,
    lft,
    rgt,
    LEAD(lft) OVER (ORDER BY lft) as next_lft,
    (LEAD(lft) OVER (ORDER BY lft) - rgt) as available_space
FROM sets 
ORDER BY lft;

-- 6. Check the parent node specifically
SELECT id, txt, lft, rgt, (rgt - lft) as total_space
FROM sets 
WHERE id = 'SiEBuCsBGkm/UUUe';

-- 7. Check children of the parent
SELECT id, txt, lft, rgt
FROM sets 
WHERE lft > (SELECT lft FROM sets WHERE id = 'SiEBuCsBGkm/UUUe')
  AND rgt < (SELECT rgt FROM sets WHERE id = 'SiEBuCsBGkm/UUUe')
ORDER BY lft;

-- 8. Check PostgreSQL version
SELECT version();

-- 9. Test what happens if we try to calculate space manually
SELECT 
    (SELECT lft FROM sets WHERE id = 'SiEBuCsBGkm/UUUe') as parent_lft,
    (SELECT rgt FROM sets WHERE id = 'SiEBuCsBGkm/UUUe') as parent_rgt,
    (SELECT MAX(rgt) FROM sets 
     WHERE lft > (SELECT lft FROM sets WHERE id = 'SiEBuCsBGkm/UUUe')
       AND rgt < (SELECT rgt FROM sets WHERE id = 'SiEBuCsBGkm/UUUe')) as max_child_rgt;

-- 10. Calculate what the new lft/rgt values would be
WITH parent_info AS (
    SELECT lft as parent_lft, rgt as parent_rgt 
    FROM sets WHERE id = 'SiEBuCsBGkm/UUUe'
),
max_child AS (
    SELECT COALESCE(MAX(rgt), 0) as max_child_rgt
    FROM sets 
    WHERE lft > (SELECT parent_lft FROM parent_info)
      AND rgt < (SELECT parent_rgt FROM parent_info)
)
SELECT 
    parent_lft,
    parent_rgt,
    max_child_rgt,
    CASE 
        WHEN max_child_rgt = 0 THEN parent_lft + 0.000000000000000000000000000001
        ELSE max_child_rgt + 0.000000000000000000000000000001
    END as calculated_lft,
    CASE 
        WHEN max_child_rgt = 0 THEN parent_lft + 0.000000000000000000000000000002  
        ELSE max_child_rgt + 0.000000000000000000000000000002
    END as calculated_rgt
FROM parent_info, max_child;
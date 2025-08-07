-- Debug INSERT operations

-- 1. Check current data state
SELECT id, txt, lft, rgt, "createdAt", "updatedAt" 
FROM sets 
ORDER BY lft;

-- 2. Test manual insert to see if basic insertion works
INSERT INTO sets (id, txt, text, lft, rgt, opened) 
VALUES ('test123456789', 'Manual Test Node', 'Test Description', 0.5, 0.6, true);

-- 3. Check if manual insert worked
SELECT COUNT(*) as total_nodes FROM sets;
SELECT * FROM sets WHERE id = 'test123456789';

-- 4. Test the insert function with a known parent
SELECT insert_node_with_space('SiEBuCsBGkm/UUUe', 'Function Test', 'Function Description', 'http://example.com') as new_id;

-- 5. Check if function insert worked
SELECT COUNT(*) as total_after_function FROM sets;
SELECT * FROM sets WHERE txt = 'Function Test';

-- 6. Test space calculation directly
SELECT * FROM get_space('SiEBuCsBGkm/UUUe', -1);

-- 7. Check for any constraint violations or issues
SELECT conname, contype, consrc 
FROM pg_constraint 
WHERE conrelid = 'sets'::regclass;
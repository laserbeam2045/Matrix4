-- Supabase Troubleshooting - Check if setup was successful

-- 1. Check if table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sets' 
ORDER BY ordinal_position;

-- 2. Check if functions were created successfully
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines
WHERE routine_name IN (
    'randomstr',
    'update_ancestors', 
    'select_tree_by_id',
    'select_node_by_id',
    'search_nodes_by_text',
    'get_space',
    'insert_node_with_space'
)
ORDER BY routine_name;

-- 3. Check if test data was inserted
SELECT COUNT(*) as row_count FROM sets;
SELECT id, txt, lft, rgt FROM sets ORDER BY lft;

-- 4. Test basic functions
SELECT randomstr(8, 'ABC123') as test_random;

-- 5. Test select functions (if data exists)
-- SELECT * FROM select_tree_by_id('SiEBuCsBGkm/UUUe') LIMIT 1;
-- SELECT * FROM select_node_by_id('SiEBuCsBGkm/UUUe') LIMIT 1;
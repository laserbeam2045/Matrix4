-- Subtree deletion functions for complete tree removal

-- Function to delete entire subtree (node + all descendants)
CREATE OR REPLACE FUNCTION delete_subtree(target_id VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    target_lft NUMERIC;
    target_rgt NUMERIC;
    deleted_count INTEGER;
BEGIN
    -- Get the bounds of the subtree to delete
    SELECT lft, rgt INTO target_lft, target_rgt
    FROM sets WHERE id = target_id;
    
    IF target_lft IS NULL THEN
        RAISE NOTICE 'Node % not found', target_id;
        RETURN 0;
    END IF;
    
    -- Update ancestors first (equivalent to CALL updateAncestors with type 5 for delete)
    PERFORM update_ancestors(target_id, 5);
    
    -- Delete all nodes within the subtree bounds (including the root node)
    -- This deletes the target node and ALL its descendants
    DELETE FROM sets 
    WHERE lft >= target_lft AND rgt <= target_rgt;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Deleted % nodes from subtree starting with %', deleted_count, target_id;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Alternative version with explicit bounds checking for safety
CREATE OR REPLACE FUNCTION delete_subtree_safe(target_id VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    target_node RECORD;
    deleted_count INTEGER;
    subtree_nodes INTEGER;
BEGIN
    -- Get target node info
    SELECT * INTO target_node FROM sets WHERE id = target_id;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'Node % not found', target_id;
        RETURN 0;
    END IF;
    
    -- Count how many nodes will be deleted
    SELECT COUNT(*) INTO subtree_nodes
    FROM sets 
    WHERE lft >= target_node.lft AND rgt <= target_node.rgt;
    
    RAISE NOTICE 'About to delete % nodes in subtree: %', subtree_nodes, target_node.txt;
    
    -- Update ancestors timestamps
    PERFORM update_ancestors(target_id, 5);
    
    -- Delete the entire subtree
    DELETE FROM sets 
    WHERE lft >= target_node.lft AND rgt <= target_node.rgt;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Successfully deleted % nodes', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Test function to see what would be deleted (without actually deleting)
CREATE OR REPLACE FUNCTION preview_subtree_delete(target_id VARCHAR)
RETURNS TABLE(
    id VARCHAR,
    txt VARCHAR,
    lft NUMERIC,
    rgt NUMERIC
) AS $$
DECLARE
    target_lft NUMERIC;
    target_rgt NUMERIC;
BEGIN
    SELECT s.lft, s.rgt INTO target_lft, target_rgt
    FROM sets s WHERE s.id = target_id;
    
    IF target_lft IS NULL THEN
        RAISE EXCEPTION 'Node % not found', target_id;
    END IF;
    
    RETURN QUERY
    SELECT s.id, s.txt, s.lft, s.rgt
    FROM sets s
    WHERE s.lft >= target_lft AND s.rgt <= target_rgt
    ORDER BY s.lft;
END;
$$ LANGUAGE plpgsql;

-- Test the preview function first (safe - doesn't delete anything)
-- SELECT * FROM preview_subtree_delete('your-node-id-here');

-- Test actual deletion (be careful!)
-- SELECT delete_subtree_safe('your-test-node-id-here');
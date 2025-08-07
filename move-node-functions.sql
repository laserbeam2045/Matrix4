-- Node moving functions for drag and drop functionality
-- Based on MySQL moveSets procedure implementation

-- Helper function: Get include count (check if child is ancestor of parent)
CREATE OR REPLACE FUNCTION get_include_count(outside_id VARCHAR, inside_id VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    include_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO include_count
    FROM sets inside_node, sets outside_node
    WHERE inside_node.id = inside_id 
      AND outside_node.id = outside_id
      AND inside_node.lft >= outside_node.lft 
      AND inside_node.rgt <= outside_node.rgt;
    
    RETURN include_count;
END;
$$ LANGUAGE plpgsql;

-- Main move function: Move a node/subtree to a new position
CREATE OR REPLACE FUNCTION move_sets(
    child_id VARCHAR,      -- cID: Node to move
    parent_id VARCHAR,     -- pID: New parent
    insert_idx INTEGER     -- idx: Position in new parent (0-based, -1 = end)
) RETURNS INTEGER AS $$
DECLARE
    -- Variables from MySQL version
    current_idx INTEGER := -1;
    alpha INTEGER := 0;
    
    -- Parent coordinates
    parent_lft NUMERIC;
    parent_rgt NUMERIC;
    
    -- Child coordinates and distance
    child_lft NUMERIC;
    child_rgt NUMERIC;
    child_distance NUMERIC;
    
    -- Relative coordinates and distance
    rel_lft NUMERIC;
    rel_rgt NUMERIC;
    rel_distance NUMERIC;
    
    -- Temporary coordinates
    tmp_lft NUMERIC;
    tmp_rgt NUMERIC;
    
    -- Target insertion point
    new_address NUMERIC;
    
    -- Sibling information
    sibling_record RECORD;
    sibling_count INTEGER;
    child_info RECORD;
BEGIN
    -- Check for invalid move: prevent moving node into its own subtree
    IF get_include_count(child_id, parent_id) > 0 THEN
        RETURN 1; -- Error: Cannot move node into its own subtree
    END IF;
    
    -- Get child and parent coordinates
    SELECT lft, rgt INTO child_lft, child_rgt FROM sets WHERE id = child_id;
    SELECT lft, rgt INTO parent_lft, parent_rgt FROM sets WHERE id = parent_id;
    
    IF child_lft IS NULL OR parent_lft IS NULL THEN
        RETURN 2; -- Error: Node not found
    END IF;
    
    -- Create temporary table for sibling information (PostgreSQL way)
    CREATE TEMP TABLE IF NOT EXISTS move_siblings (
        id VARCHAR,
        lft NUMERIC,
        rgt NUMERIC,
        sibling_idx INTEGER
    );
    DELETE FROM move_siblings;
    
    -- Get siblings of the target parent (direct children only)
    INSERT INTO move_siblings (id, lft, rgt, sibling_idx)
    SELECT 
        s.id, 
        s.lft, 
        s.rgt,
        ROW_NUMBER() OVER (ORDER BY s.lft) - 1 as sibling_idx
    FROM sets s
    WHERE s.lft > parent_lft 
      AND s.rgt < parent_rgt
      AND NOT EXISTS (
          SELECT 1 FROM sets middle
          WHERE middle.lft > parent_lft 
            AND middle.rgt < parent_rgt
            AND s.lft > middle.lft 
            AND s.rgt < middle.rgt
            AND middle.id != s.id
      )
    ORDER BY s.lft;
    
    -- Count siblings and adjust insert_idx if negative
    SELECT COUNT(*) INTO sibling_count FROM move_siblings;
    IF insert_idx < 0 THEN
        insert_idx := sibling_count;
    END IF;
    
    -- Find current position of moving node among siblings
    SELECT sibling_idx INTO current_idx FROM move_siblings WHERE id = child_id;
    current_idx := COALESCE(current_idx, -1);
    
    -- Adjust for same parent moves (MySQL alpha logic)
    IF current_idx >= 0 AND current_idx < insert_idx THEN
        alpha := 1;
    END IF;
    
    -- Calculate insertion boundaries
    -- Left boundary: max rgt of siblings before insertion point
    SELECT MAX(rgt) INTO tmp_lft 
    FROM move_siblings 
    WHERE sibling_idx < (insert_idx + alpha);
    tmp_lft := COALESCE(tmp_lft, parent_lft);
    
    -- Right boundary: min lft of siblings at/after insertion point
    SELECT MIN(lft) INTO tmp_rgt 
    FROM move_siblings 
    WHERE sibling_idx >= (insert_idx + alpha);
    tmp_rgt := COALESCE(tmp_rgt, parent_rgt);
    
    -- Calculate new insertion address
    new_address := (tmp_lft + tmp_rgt) / 2;
    
    RAISE NOTICE 'Moving node % to position % between % and %, new_address=%', 
        child_id, insert_idx, tmp_lft, tmp_rgt, new_address;
    
    -- Determine movement direction and calculate distances
    IF new_address < child_lft THEN
        -- Moving left
        -- Find the boundary for relative movement
        SELECT MIN(lft) INTO rel_lft FROM sets 
        WHERE lft > new_address AND lft < child_lft;
        SELECT MAX(lft) INTO rel_rgt FROM sets 
        WHERE lft > new_address AND lft < child_lft;
        
        rel_lft := COALESCE(rel_lft, new_address);
        rel_rgt := COALESCE(rel_rgt, child_lft);
        
        child_distance := rel_lft - child_lft;
        rel_distance := child_rgt - rel_rgt;
    ELSE
        -- Moving right
        SELECT MIN(lft) INTO rel_lft FROM sets 
        WHERE lft > child_rgt AND lft < new_address;
        SELECT MAX(lft) INTO rel_rgt FROM sets 
        WHERE lft > child_rgt AND lft < new_address;
        
        rel_lft := COALESCE(rel_lft, child_rgt);
        rel_rgt := COALESCE(rel_rgt, new_address);
        
        child_distance := rel_rgt - child_rgt;
        rel_distance := child_lft - rel_lft;
    END IF;
    
    -- Perform the actual coordinate updates
    -- 1. Move the target subtree (child and all descendants)
    UPDATE sets 
    SET lft = lft + child_distance, rgt = rgt + child_distance
    WHERE lft >= child_lft AND rgt <= child_rgt;
    
    -- 2. Update nodes that need relative adjustment (rgt only)
    UPDATE sets 
    SET rgt = rgt + rel_distance
    WHERE rgt >= rel_lft AND rgt <= rel_rgt
      AND NOT (lft >= child_lft AND rgt <= child_rgt); -- Exclude already moved nodes
    
    -- 3. Update nodes that need relative adjustment (lft only)
    UPDATE sets 
    SET lft = lft + rel_distance
    WHERE lft >= rel_lft AND lft <= rel_rgt
      AND NOT (lft >= child_lft AND rgt <= child_rgt); -- Exclude already moved nodes
    
    -- Clean up temp table
    DROP TABLE IF EXISTS move_siblings;
    
    RETURN 0; -- Success
END;
$$ LANGUAGE plpgsql;

-- Wrapper function for move_node API
CREATE OR REPLACE FUNCTION move_node_api(
    child_id VARCHAR,
    parent_id VARCHAR,
    insert_idx INTEGER
) RETURNS INTEGER AS $$
DECLARE
    result INTEGER;
BEGIN
    -- Update ancestors before move
    PERFORM update_ancestors(child_id, 6);
    
    -- Perform the move
    SELECT move_sets(child_id, parent_id, insert_idx) INTO result;
    
    -- Update ancestors after move
    PERFORM update_ancestors(parent_id, 6);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Test function (use carefully)
-- SELECT move_node_api('child-id', 'parent-id', 0) as move_result;
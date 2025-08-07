-- Fix space allocation algorithm to match MySQL original implementation
-- The correct formula is the 3-way division algorithm, not tiny increments

CREATE OR REPLACE FUNCTION get_space(parent_id VARCHAR, insert_position INTEGER, OUT lft_val NUMERIC, OUT rgt_val NUMERIC)
AS $$
DECLARE
    parent_lft NUMERIC;
    parent_rgt NUMERIC;
    tmp_lft NUMERIC;
    tmp_rgt NUMERIC;
    child_count INTEGER;
    target_idx INTEGER;
BEGIN
    -- Get parent's coordinates
    SELECT lft, rgt INTO parent_lft, parent_rgt
    FROM sets WHERE id = parent_id;
    
    IF parent_lft IS NULL THEN
        RAISE EXCEPTION 'Parent node not found: %', parent_id;
    END IF;
    
    -- Get children count
    SELECT COUNT(*) INTO child_count
    FROM sets 
    WHERE lft > parent_lft AND rgt < parent_rgt;
    
    -- Adjust insert position (MySQL logic: negative or too large = append at end)
    IF insert_position < 0 OR insert_position > child_count THEN
        target_idx := child_count;
    ELSE
        target_idx := insert_position;
    END IF;
    
    -- Get left boundary (right edge of previous child, or parent left if no previous child)
    IF target_idx = 0 THEN
        tmp_lft := parent_lft;
    ELSE
        -- Get the rgt value of the (target_idx-1)th child
        SELECT rgt INTO tmp_lft
        FROM (
            SELECT rgt, ROW_NUMBER() OVER (ORDER BY lft) as rn
            FROM sets 
            WHERE lft > parent_lft AND rgt < parent_rgt
        ) ranked_children
        WHERE rn = target_idx;
        
        -- If not found, use parent left
        IF tmp_lft IS NULL THEN
            tmp_lft := parent_lft;
        END IF;
    END IF;
    
    -- Get right boundary (left edge of next child, or parent right if no next child)  
    SELECT lft INTO tmp_rgt
    FROM (
        SELECT lft, ROW_NUMBER() OVER (ORDER BY lft) as rn
        FROM sets 
        WHERE lft > parent_lft AND rgt < parent_rgt
    ) ranked_children
    WHERE rn = target_idx + 1;
    
    -- If no next child, use parent right
    IF tmp_rgt IS NULL THEN
        tmp_rgt := parent_rgt;
    END IF;
    
    -- Calculate new coordinates using MySQL's 3-way division algorithm
    -- This ensures proper space distribution and prevents precision issues
    lft_val := (tmp_lft * 2 + tmp_rgt) / 3;
    rgt_val := (tmp_lft + tmp_rgt * 2) / 3;
    
    RAISE NOTICE 'Space allocation: parent=[%, %], boundaries=[%, %], new=[%, %]', 
        parent_lft, parent_rgt, tmp_lft, tmp_rgt, lft_val, rgt_val;
END;
$$ LANGUAGE plpgsql;

-- Also update the simple insert function to use this fixed algorithm
CREATE OR REPLACE FUNCTION simple_insert_node(
    parent_id VARCHAR,
    txt VARCHAR,
    text VARCHAR DEFAULT '',
    link VARCHAR DEFAULT ''
) RETURNS VARCHAR AS $$
DECLARE
    new_id VARCHAR;
    new_lft NUMERIC;
    new_rgt NUMERIC;
BEGIN
    -- Generate new ID
    new_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Get proper space allocation using fixed algorithm
    SELECT lft_val, rgt_val INTO new_lft, new_rgt 
    FROM get_space(parent_id, -1);
    
    -- Insert the new node
    INSERT INTO sets (id, txt, text, link, lft, rgt, opened, "isGroup")
    VALUES (new_id, txt, text, link, new_lft, new_rgt, true, false);
    
    -- Update ancestors
    PERFORM update_ancestors(new_id, 3);
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Test the fix
-- SELECT get_space('SiEBuCsBGkm/UUUe', -1) as space_allocation;
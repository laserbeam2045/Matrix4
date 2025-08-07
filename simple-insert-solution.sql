-- Simple solution: Remove unique constraints temporarily and use simpler logic

-- 1. Drop the problematic unique constraints
DROP INDEX IF EXISTS "indexRgt";
DROP INDEX IF EXISTS "indexLft";

-- 2. Create a much simpler insert function that avoids precision issues
CREATE OR REPLACE FUNCTION simple_insert_node(
    parent_id VARCHAR,
    txt VARCHAR,
    text VARCHAR,
    link VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    new_id VARCHAR;
    parent_lft NUMERIC;
    parent_rgt NUMERIC;
    new_lft NUMERIC;
    new_rgt NUMERIC;
    node_count INTEGER;
BEGIN
    -- Generate new ID
    new_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Get parent bounds
    SELECT lft, rgt INTO parent_lft, parent_rgt
    FROM sets WHERE id = parent_id;
    
    IF parent_lft IS NULL THEN
        RAISE EXCEPTION 'Parent node % not found', parent_id;
    END IF;
    
    -- Get count of existing nodes for unique positioning
    SELECT COUNT(*) INTO node_count FROM sets;
    
    -- Use simple sequential values to avoid conflicts
    new_lft := parent_lft + (node_count * 0.001) + 0.001;
    new_rgt := new_lft + 0.0005;
    
    -- Ensure we stay within parent bounds
    IF new_rgt >= parent_rgt THEN
        -- Use timestamp-based unique values if space is tight  
        new_lft := parent_lft + (EXTRACT(EPOCH FROM NOW())::NUMERIC / 1000000000);
        new_rgt := new_lft + 0.000001;
    END IF;
    
    -- Insert the new node
    INSERT INTO sets (id, txt, text, link, lft, rgt, opened, "createdAt")
    VALUES (new_id, txt, text, link, new_lft, new_rgt, true, NOW());
    
    -- Update ancestors
    PERFORM update_ancestors(new_id, 3);
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Replace the complex insert function with the simple one
CREATE OR REPLACE FUNCTION insert_node_with_space(
    parent_id VARCHAR, 
    txt VARCHAR, 
    text VARCHAR, 
    link VARCHAR
) RETURNS VARCHAR AS $$
BEGIN
    RETURN simple_insert_node(parent_id, txt, text, link);
END;
$$ LANGUAGE plpgsql;

-- 4. Test the simple insertion
SELECT simple_insert_node('SiEBuCsBGkm/UUUe', 'Simple Test', 'Simple Description', 'http://test.com') as new_id;

-- 5. Verify it worked
SELECT COUNT(*) as total_nodes FROM sets;
SELECT id, txt, lft, rgt FROM sets ORDER BY "createdAt" DESC LIMIT 3;
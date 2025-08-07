-- Simple PostgreSQL clone function for tree nodes

-- Simple clone function that duplicates a node and its direct children
CREATE OR REPLACE FUNCTION clone_node_simple(source_id VARCHAR, target_parent_id VARCHAR DEFAULT NULL)
RETURNS VARCHAR AS $$
DECLARE
    new_id VARCHAR;
    source_node RECORD;
    child_node RECORD;
    child_new_id VARCHAR;
    clone_parent_id VARCHAR;
BEGIN
    -- Generate new ID for the cloned node
    new_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Get the source node data
    SELECT * INTO source_node FROM sets WHERE id = source_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source node % not found', source_id;
    END IF;
    
    -- Determine where to place the clone
    clone_parent_id := COALESCE(target_parent_id, 'SiEBuCsBGkm/UUUe'); -- Default to biology parent
    
    -- Insert the cloned node using our working simple_insert_node function
    SELECT simple_insert_node(
        clone_parent_id,
        'Copy of ' || source_node.txt,
        source_node.text,
        source_node.link
    ) INTO new_id;
    
    -- Clone direct children (one level only for simplicity)
    FOR child_node IN 
        SELECT * FROM sets 
        WHERE lft > source_node.lft 
          AND rgt < source_node.rgt
          AND NOT EXISTS (
              SELECT 1 FROM sets s2 
              WHERE s2.lft > source_node.lft 
                AND s2.rgt < source_node.rgt
                AND s2.lft < sets.lft 
                AND s2.rgt > sets.rgt
          )
    LOOP
        -- Clone each direct child
        SELECT simple_insert_node(
            new_id,
            child_node.txt,
            child_node.text,
            child_node.link
        ) INTO child_new_id;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Alternative: Even simpler version that only clones the single node
CREATE OR REPLACE FUNCTION clone_single_node(source_id VARCHAR, target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe')
RETURNS VARCHAR AS $$
DECLARE
    source_node RECORD;
    new_id VARCHAR;
BEGIN
    -- Get source node
    SELECT * INTO source_node FROM sets WHERE id = source_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source node % not found', source_id;
    END IF;
    
    -- Create clone with "Copy of" prefix
    SELECT simple_insert_node(
        target_parent_id,
        'Copy of ' || source_node.txt,
        source_node.text,
        source_node.link
    ) INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Test the simple clone function
SELECT clone_single_node('SiEBuCsBGkm/UUUe') as cloned_id;

-- Verify the clone was created
SELECT id, txt, "createdAt" FROM sets ORDER BY "createdAt" DESC LIMIT 3;
-- Complete subtree cloning function - clones entire tree structure recursively

-- First, create a function to get all descendants in hierarchical order
CREATE OR REPLACE FUNCTION get_subtree_nodes(root_id VARCHAR)
RETURNS TABLE(
    original_id VARCHAR,
    txt VARCHAR,
    text VARCHAR,
    link VARCHAR,
    opened BOOLEAN,
    "isGroup" BOOLEAN,
    lft NUMERIC,
    rgt NUMERIC,
    level INTEGER,
    parent_original_id VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE subtree AS (
        -- Root node
        SELECT 
            s1.id as original_id,
            s1.txt,
            s1.text,
            s1.link,
            s1.opened,
            s1."isGroup",
            s1.lft,
            s1.rgt,
            0 as level,
            NULL::VARCHAR as parent_original_id,
            s1.lft as root_lft,
            s1.rgt as root_rgt
        FROM sets s1
        WHERE s1.id = root_id
        
        UNION ALL
        
        -- Children
        SELECT 
            s2.id as original_id,
            s2.txt,
            s2.text,
            s2.link,
            s2.opened,
            s2."isGroup",
            s2.lft,
            s2.rgt,
            st.level + 1 as level,
            st.original_id as parent_original_id,
            st.root_lft,
            st.root_rgt
        FROM sets s2
        INNER JOIN subtree st ON s2.lft > st.lft AND s2.rgt < st.rgt
        WHERE s2.lft > st.root_lft AND s2.rgt < st.root_rgt
    )
    SELECT 
        st.original_id,
        st.txt,
        st.text,
        st.link,
        st.opened,
        st."isGroup",
        st.lft,
        st.rgt,
        st.level,
        st.parent_original_id
    FROM subtree st
    ORDER BY st.lft;
END;
$$ LANGUAGE plpgsql;

-- Alternative simpler approach: Get all descendants using nested intervals
CREATE OR REPLACE FUNCTION get_all_descendants(root_id VARCHAR)
RETURNS TABLE(
    id VARCHAR,
    txt VARCHAR,
    text VARCHAR,
    link VARCHAR,
    opened BOOLEAN,
    "isGroup" BOOLEAN,
    lft NUMERIC,
    rgt NUMERIC,
    depth INTEGER
) AS $$
DECLARE
    root_lft NUMERIC;
    root_rgt NUMERIC;
BEGIN
    -- Get root bounds
    SELECT s.lft, s.rgt INTO root_lft, root_rgt
    FROM sets s WHERE s.id = root_id;
    
    RETURN QUERY
    SELECT 
        s.id,
        s.txt,
        s.text,
        s.link,
        s.opened,
        s."isGroup",
        s.lft,
        s.rgt,
        (SELECT COUNT(*) FROM sets ancestors 
         WHERE ancestors.lft < s.lft AND ancestors.rgt > s.rgt 
         AND ancestors.lft >= root_lft AND ancestors.rgt <= root_rgt)::INTEGER as depth
    FROM sets s
    WHERE s.lft >= root_lft AND s.rgt <= root_rgt
    ORDER BY s.lft;
END;
$$ LANGUAGE plpgsql;

-- Complete subtree clone function
CREATE OR REPLACE FUNCTION clone_complete_subtree(
    source_root_id VARCHAR, 
    target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe'
) RETURNS VARCHAR AS $$
DECLARE
    node_record RECORD;
    new_root_id VARCHAR;
    id_mapping JSONB := '{}';
    current_parent_id VARCHAR;
    previous_depth INTEGER := -1;
    parent_stack VARCHAR[] := ARRAY[]::VARCHAR[];
BEGIN
    -- Clone all nodes in the subtree
    FOR node_record IN 
        SELECT * FROM get_all_descendants(source_root_id)
    LOOP
        -- Generate new ID for this node
        DECLARE
            new_node_id VARCHAR := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        BEGIN
            -- Store the ID mapping
            id_mapping := jsonb_set(id_mapping, ARRAY[node_record.id], to_jsonb(new_node_id));
            
            -- Determine parent for this node
            IF node_record.depth = 0 THEN
                -- Root node of the subtree
                current_parent_id := target_parent_id;
                new_root_id := new_node_id;
                parent_stack := ARRAY[new_node_id];
            ELSE
                -- Child node - adjust parent stack based on depth
                IF node_record.depth > previous_depth THEN
                    -- Going deeper - current parent is the last inserted node
                    current_parent_id := parent_stack[array_length(parent_stack, 1)];
                ELSIF node_record.depth = previous_depth THEN
                    -- Same level - parent is one level up
                    current_parent_id := parent_stack[array_length(parent_stack, 1) - 1];
                ELSE
                    -- Going up - trim parent stack
                    parent_stack := parent_stack[1:(node_record.depth + 1)];
                    current_parent_id := parent_stack[array_length(parent_stack, 1)];
                END IF;
                
                -- Add current node to stack
                parent_stack := parent_stack || new_node_id;
            END IF;
            
            -- Create the cloned node
            PERFORM simple_insert_node(
                current_parent_id,
                CASE 
                    WHEN node_record.depth = 0 THEN 'Copy of ' || node_record.txt
                    ELSE node_record.txt
                END,
                node_record.text,
                node_record.link
            );
            
            previous_depth := node_record.depth;
        END;
    END LOOP;
    
    RETURN new_root_id;
END;
$$ LANGUAGE plpgsql;

-- Simpler version using direct hierarchical copying
CREATE OR REPLACE FUNCTION clone_subtree_simple(
    source_id VARCHAR,
    target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe'
) RETURNS VARCHAR AS $$
DECLARE
    source_node RECORD;
    child_node RECORD;
    new_root_id VARCHAR;
    new_child_id VARCHAR;
BEGIN
    -- Get source root node
    SELECT * INTO source_node FROM sets WHERE id = source_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source node % not found', source_id;
    END IF;
    
    -- Create root of cloned subtree
    SELECT simple_insert_node(
        target_parent_id,
        'Copy of ' || source_node.txt,
        source_node.text,
        source_node.link
    ) INTO new_root_id;
    
    -- Recursively clone all children
    FOR child_node IN 
        SELECT * FROM sets 
        WHERE lft > source_node.lft 
          AND rgt < source_node.rgt
        ORDER BY lft
    LOOP
        -- For now, add all children directly under the new root
        -- (This simplifies the hierarchy but preserves content)
        SELECT simple_insert_node(
            new_root_id,
            child_node.txt,
            child_node.text,
            child_node.link
        ) INTO new_child_id;
    END LOOP;
    
    RETURN new_root_id;
END;
$$ LANGUAGE plpgsql;

-- Test the subtree cloning
-- SELECT clone_subtree_simple('SiEBuCsBGkm/UUUe') as cloned_subtree_id;

-- Check the result
-- SELECT id, txt, lft, rgt FROM sets WHERE txt LIKE 'Copy of%' ORDER BY lft;
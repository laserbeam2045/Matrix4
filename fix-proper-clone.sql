-- Proper subtree cloning that preserves hierarchical structure
-- Based on MySQL original implementation in server/backend_php/sets/insert/tree.php

CREATE OR REPLACE FUNCTION clone_subtree_proper(
    source_id VARCHAR,
    target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe'
) RETURNS VARCHAR AS $$
DECLARE
    source_node RECORD;
    target_parent RECORD;
    subtree_width NUMERIC;
    coordinate_offset NUMERIC;
    new_root_id VARCHAR;
    subtree_record RECORD;
    new_node_id VARCHAR;
BEGIN
    -- Get source subtree root information
    SELECT * INTO source_node FROM sets WHERE id = source_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source node % not found', source_id;
    END IF;
    
    -- Get target parent information
    SELECT * INTO target_parent FROM sets WHERE id = target_parent_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target parent % not found', target_parent_id;
    END IF;
    
    -- Calculate subtree width
    subtree_width := source_node.rgt - source_node.lft;
    
    -- Find insertion point: after the last child of target parent, or at parent.lft if no children
    SELECT COALESCE(MAX(rgt), target_parent.lft) INTO coordinate_offset
    FROM sets 
    WHERE lft > target_parent.lft AND rgt < target_parent.rgt;
    
    -- Calculate the offset to move source coordinates to new location
    coordinate_offset := coordinate_offset - source_node.lft;
    
    -- Expand target parent's right boundary to accommodate new subtree
    UPDATE sets 
    SET rgt = target_parent.rgt + subtree_width
    WHERE id = target_parent_id;
    
    -- Also update any ancestors of target parent that need expansion
    UPDATE sets 
    SET rgt = rgt + subtree_width
    WHERE lft < target_parent.lft AND rgt > target_parent.rgt;
    
    -- Generate new root ID for the cloned subtree
    new_root_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Clone all nodes in the subtree while preserving hierarchy
    FOR subtree_record IN
        SELECT * FROM sets 
        WHERE lft >= source_node.lft AND rgt <= source_node.rgt
        ORDER BY lft
    LOOP
        -- Generate new ID for each node (except we already have the root ID)
        IF subtree_record.id = source_id THEN
            new_node_id := new_root_id;
        ELSE
            new_node_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        END IF;
        
        -- Insert cloned node with offset coordinates
        INSERT INTO sets (
            id, 
            txt, 
            text, 
            link, 
            lft, 
            rgt, 
            opened, 
            "isGroup",
            "createdAt",
            "updatedAt"
        ) VALUES (
            new_node_id,
            CASE 
                WHEN subtree_record.id = source_id THEN 'Copy of ' || subtree_record.txt
                ELSE subtree_record.txt
            END,
            subtree_record.text,
            subtree_record.link,
            subtree_record.lft + coordinate_offset,
            subtree_record.rgt + coordinate_offset,
            subtree_record.opened,
            subtree_record."isGroup",
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Cloned node: % -> % (%, %) -> (%, %)', 
            subtree_record.txt, new_node_id, 
            subtree_record.lft, subtree_record.rgt,
            subtree_record.lft + coordinate_offset, subtree_record.rgt + coordinate_offset;
    END LOOP;
    
    -- Update ancestors timestamp for the new subtree
    PERFORM update_ancestors(new_root_id, 3);
    
    RETURN new_root_id;
END;
$$ LANGUAGE plpgsql;

-- Alternative simpler approach that doesn't expand parent boundaries
-- Instead inserts into available space using proper space allocation
CREATE OR REPLACE FUNCTION clone_subtree_with_space(
    source_id VARCHAR,
    target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe'
) RETURNS VARCHAR AS $$
DECLARE
    source_subtree RECORD;
    parent_info RECORD;
    space_lft NUMERIC;
    space_rgt NUMERIC;
    space_width NUMERIC;
    subtree_width NUMERIC;
    scale_factor NUMERIC;
    new_root_id VARCHAR;
    subtree_record RECORD;
    new_node_id VARCHAR;
BEGIN
    -- Get source subtree root
    SELECT * INTO source_subtree FROM sets WHERE id = source_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source node % not found', source_id;
    END IF;
    
    -- Get target parent info
    SELECT * INTO parent_info FROM sets WHERE id = target_parent_id;
    
    -- Get available space for insertion
    SELECT lft_val, rgt_val INTO space_lft, space_rgt 
    FROM get_space(target_parent_id, -1);
    
    -- Calculate space dimensions
    space_width := space_rgt - space_lft;
    subtree_width := source_subtree.rgt - source_subtree.lft;
    
    -- Calculate scale factor if needed (usually 1.0 for sufficient space)
    scale_factor := space_width / subtree_width;
    
    -- Generate new root ID
    new_root_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Clone all nodes with proportional coordinate scaling
    FOR subtree_record IN
        SELECT * FROM sets 
        WHERE lft >= source_subtree.lft AND rgt <= source_subtree.rgt
        ORDER BY lft
    LOOP
        -- Generate new ID
        IF subtree_record.id = source_id THEN
            new_node_id := new_root_id;
        ELSE
            new_node_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        END IF;
        
        -- Insert with scaled and offset coordinates
        INSERT INTO sets (
            id, txt, text, link, lft, rgt, opened, "isGroup"
        ) VALUES (
            new_node_id,
            CASE 
                WHEN subtree_record.id = source_id THEN 'Copy of ' || subtree_record.txt
                ELSE subtree_record.txt
            END,
            subtree_record.text,
            subtree_record.link,
            space_lft + (subtree_record.lft - source_subtree.lft) * scale_factor,
            space_lft + (subtree_record.rgt - source_subtree.lft) * scale_factor,
            subtree_record.opened,
            subtree_record."isGroup"
        );
    END LOOP;
    
    PERFORM update_ancestors(new_root_id, 3);
    
    RETURN new_root_id;
END;
$$ LANGUAGE plpgsql;

-- Update the API to use the proper clone function
-- Replace the simple version with the hierarchical one
CREATE OR REPLACE FUNCTION clone_subtree_simple(
    source_id VARCHAR,
    target_parent_id VARCHAR DEFAULT 'SiEBuCsBGkm/UUUe'
) RETURNS VARCHAR AS $$
BEGIN
    -- Use the proper hierarchical cloning function
    RETURN clone_subtree_with_space(source_id, target_parent_id);
END;
$$ LANGUAGE plpgsql;
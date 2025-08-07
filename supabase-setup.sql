-- Supabase PostgreSQL Setup for Matrix4 Tree API
-- Execute all functions below in Supabase SQL Editor

-- 1. Create the main sets table with proper structure
CREATE TABLE IF NOT EXISTS sets (
  id VARCHAR(16) NOT NULL,
  txt VARCHAR(255) NOT NULL DEFAULT '',
  text VARCHAR(255) NOT NULL DEFAULT '',
  link VARCHAR(255) NOT NULL DEFAULT '',
  opened BOOLEAN NOT NULL DEFAULT true,
  "isGroup" BOOLEAN NOT NULL DEFAULT false,
  lft NUMERIC(40,30) NOT NULL,
  rgt NUMERIC(40,30) NOT NULL,
  "updatedType" INTEGER DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- 2. Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS "indexLft" ON sets (lft);
CREATE UNIQUE INDEX IF NOT EXISTS "indexRgt" ON sets (rgt);

-- 3. Random string generation function for ID generation
CREATE OR REPLACE FUNCTION randomstr(length INTEGER, chars TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    i INTEGER := 0;
    chars_length INTEGER := char_length(chars);
BEGIN
    WHILE i < length LOOP
        result := result || substr(chars, floor(random() * chars_length + 1)::INTEGER, 1);
        i := i + 1;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Update ancestors function - updates timestamps for node and all ancestors
CREATE OR REPLACE FUNCTION update_ancestors(target_id VARCHAR, update_type INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Update the target node and all its ancestors
  UPDATE sets 
  SET 
    "updatedAt" = CURRENT_TIMESTAMP,
    "updatedType" = update_type
  WHERE 
    id = target_id
    OR (
      lft < (SELECT lft FROM sets WHERE id = target_id) 
      AND rgt > (SELECT lft FROM sets WHERE id = target_id)
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Select tree by ID function - complex hierarchical tree query
CREATE OR REPLACE FUNCTION select_tree_by_id(target_id VARCHAR)
RETURNS TABLE(
  id VARCHAR,
  txt VARCHAR,
  text VARCHAR,
  link VARCHAR,
  opened BOOLEAN,
  "isGroup" BOOLEAN,
  lft NUMERIC,
  rgt NUMERIC,
  "updatedType" INTEGER,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  parent VARCHAR,
  level BIGINT,
  "progeniesCount" BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    Node.id,
    Node.txt,
    Node.text,
    Node.link,
    Node.opened,
    Node."isGroup",
    Node.lft,
    Node.rgt,
    Node."updatedType",
    Node."createdAt",
    Node."updatedAt",
    Parents.id AS parent,
    COUNT(DISTINCT Ancestors.id) AS level,
    COUNT(DISTINCT Progenies.id) AS "progeniesCount"
  FROM
    sets AS Node
    LEFT JOIN sets AS Parents ON
      Node.lft > Parents.lft AND Node.lft < Parents.rgt AND
      Parents.lft = (SELECT MAX(s1.lft) FROM sets s1 WHERE Node.lft > s1.lft AND Node.lft < s1.rgt)
    LEFT JOIN sets AS Progenies ON
      Node.lft < Progenies.lft AND Node.rgt > Progenies.lft
    LEFT JOIN sets AS Ancestors ON
      Node.lft > Ancestors.lft AND Node.lft < Ancestors.rgt
  WHERE
    Node.lft BETWEEN
      (SELECT s2.lft FROM sets s2 WHERE s2.id = target_id) AND
      (SELECT s3.rgt FROM sets s3 WHERE s3.id = target_id)
  GROUP BY
    Node.id, Node.txt, Node.text, Node.link, Node.opened, Node."isGroup",
    Node.lft, Node.rgt, Node."updatedType", Node."createdAt", Node."updatedAt", Parents.id
  ORDER BY
    Node.lft;
END;
$$ LANGUAGE plpgsql;

-- 6. Select single node by ID function - single node with hierarchy info
CREATE OR REPLACE FUNCTION select_node_by_id(target_id VARCHAR)
RETURNS TABLE(
  id VARCHAR,
  txt VARCHAR,
  text VARCHAR,
  link VARCHAR,
  opened BOOLEAN,
  "isGroup" BOOLEAN,
  lft NUMERIC,
  rgt NUMERIC,
  "updatedType" INTEGER,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  parent VARCHAR,
  level BIGINT,
  "progeniesCount" BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    Node.id,
    Node.txt,
    Node.text,
    Node.link,
    Node.opened,
    Node."isGroup",
    Node.lft,
    Node.rgt,
    Node."updatedType",
    Node."createdAt",
    Node."updatedAt",
    Parents.id AS parent,
    COUNT(DISTINCT Ancestors.id) AS level,
    COUNT(DISTINCT Progenies.id) AS "progeniesCount"
  FROM
    sets AS Node
    LEFT JOIN sets AS Parents ON
      Node.lft > Parents.lft AND Node.lft < Parents.rgt
    LEFT JOIN sets AS Progenies ON
      Node.lft < Progenies.lft AND Node.rgt > Progenies.lft
    LEFT JOIN sets AS Ancestors ON
      Node.lft > Ancestors.lft AND Node.lft < Ancestors.rgt
  WHERE
    Node.id = target_id
    AND NOT EXISTS (
      SELECT s1.id FROM sets AS s1
      WHERE
        s1.lft BETWEEN Parents.lft AND Parents.rgt
        AND Node.lft BETWEEN s1.lft AND s1.rgt
        AND s1.id NOT IN (Node.id, Parents.id)
    )
  GROUP BY
    Node.id, Node.txt, Node.text, Node.link, Node.opened, Node."isGroup",
    Node.lft, Node.rgt, Node."updatedType", Node."createdAt", Node."updatedAt", Parents.id
  ORDER BY
    Node.lft;
END;
$$ LANGUAGE plpgsql;

-- 7. Search nodes by text function - search with parent information
CREATE OR REPLACE FUNCTION search_nodes_by_text(search_word VARCHAR)
RETURNS TABLE(
  id VARCHAR,
  txt VARCHAR,
  text VARCHAR,
  parent VARCHAR,
  "parentTxt" VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    Node.id,
    Node.txt,
    Node.text,
    Parents.id AS parent,
    Parents.txt AS "parentTxt"
  FROM
    sets AS Node
    LEFT JOIN sets AS Parents ON
      Node.lft > Parents.lft AND Node.lft < Parents.rgt AND
      Parents.lft = (SELECT MAX(s1.lft) FROM sets s1 WHERE Node.lft > s1.lft AND Node.lft < s1.rgt)
  WHERE
    Node.txt ILIKE '%' || search_word || '%'
  GROUP BY
    Node.id, Node.txt, Node.text, Parents.id, Parents.txt
  ORDER BY
    Node.lft;
END;
$$ LANGUAGE plpgsql;

-- 8. Get insertion space function - calculate insertion coordinates
CREATE OR REPLACE FUNCTION get_space(parent_id VARCHAR, insert_position INTEGER, OUT lft_val NUMERIC, OUT rgt_val NUMERIC)
AS $$
BEGIN
    -- Insert as last child (insert_position = -1)
    IF insert_position = -1 THEN
        -- Get the rightmost child position or parent position
        SELECT 
            COALESCE(MAX(rgt), (SELECT rgt FROM sets WHERE id = parent_id)) - 0.000000000000000000000000000001,
            COALESCE(MAX(rgt), (SELECT rgt FROM sets WHERE id = parent_id))
        INTO lft_val, rgt_val
        FROM sets 
        WHERE lft > (SELECT lft FROM sets WHERE id = parent_id) 
          AND rgt < (SELECT rgt FROM sets WHERE id = parent_id);
          
        -- If no children exist, use parent's space
        IF lft_val IS NULL THEN
            SELECT 
                lft + 0.000000000000000000000000000001,
                rgt - 0.000000000000000000000000000001
            INTO lft_val, rgt_val
            FROM sets WHERE id = parent_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 9. Insert node with space allocation function - complete insertion with space allocation
CREATE OR REPLACE FUNCTION insert_node_with_space(
    parent_id VARCHAR, 
    txt VARCHAR, 
    text VARCHAR, 
    link VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    new_id VARCHAR;
    lft_val NUMERIC;
    rgt_val NUMERIC;
BEGIN
    -- Generate random ID
    new_id := randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    
    -- Get insertion space
    SELECT * INTO lft_val, rgt_val FROM get_space(parent_id, -1);
    
    -- Insert new node
    INSERT INTO sets (id, txt, text, link, lft, rgt, opened)
    VALUES (new_id, txt, text, link, lft_val, rgt_val, true);
    
    -- Update ancestors
    PERFORM update_ancestors(new_id, 3);
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Insert test data for BookMarks functionality
INSERT INTO sets (id, txt, text, lft, rgt, opened, "isGroup") VALUES 
  ('SiEBuCsBGkm/UUUe', '生物', '生物学の学習ツリー', 0.000000000000000000000000000001, 0.999999999999999999999999999999, true, true),
  ('ozmkiRCEBnh7ZT83', 'ミラティブ学園', 'ミラティブ学園のメインツリー', 0.1, 0.9, true, true),
  ('GEO0PuwvgrXdnXVx', 'HomeRoom', 'ホームルーム', 0.2, 0.8, true, true),
  ('root', 'Root', 'ルートノード', 0.0, 1.0, true, true)
ON CONFLICT (id) DO UPDATE SET
  txt = EXCLUDED.txt,
  text = EXCLUDED.text,
  lft = EXCLUDED.lft,
  rgt = EXCLUDED.rgt,
  opened = EXCLUDED.opened,
  "isGroup" = EXCLUDED."isGroup";

-- 11. Test the functions (optional - can be commented out)
-- SELECT * FROM select_tree_by_id('SiEBuCsBGkm/UUUe');
-- SELECT * FROM select_node_by_id('SiEBuCsBGkm/UUUe'); 
-- SELECT * FROM search_nodes_by_text('生物');

/* Nested Intervals Model(入れ子区間モデル) */


--
-- テーブルの構造 `sets`
--
CREATE TABLE IF NOT EXISTS `sets` (
  `id` varchar(16) COLLATE utf8_bin NOT NULL,
  `txt` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `link` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `opened` tinyint(1) NOT NULL DEFAULT '1',
  `lft` decimal(40,30) NOT NULL,
  `rgt` decimal(40,30) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `indexLft` (`lft`),
  UNIQUE KEY `indexRgt` (`rgt`),
  UNIQUE KEY `indexMix` (`lft`,`rgt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- テーブル初期データ例
--
INSERT INTO `sets`
(`id`, `txt`, `link`, `opened`, `lft`, `rgt`, `createdAt`, `updatedAt`) VALUES
('+1PJqdqGklc83g7i', '3組', '', 1, '38.000000000000000000000000000000', '39.000000000000000000000000000000', '2021-12-09 21:54:26', '2021-12-29 18:43:25'),
('+3DouI0S/y8gHcwQ', '肖像', '', 1, '341.000000000000000000000000000000', '342.000000000000000000000000000000', '2021-12-17 15:41:09', '2021-12-29 18:43:25');


-- とても参考になるサイト
-- http://miztools.so.land.to/php5_list/cake2.php/sql/nestmap_sql


--  mysqlでは、check構文は無効なので、trigger で、左右値の大小を規定します。
--  insert したものが不正データなら、insert前にerror を発生させてストップ
DELIMITER //
CREATE TRIGGER `treeins_lr_chk`
BEFORE INSERT ON `sets` FOR EACH ROW
BEGIN
  IF NEW.lft >= NEW.rgt  
    OR (EXISTS (SELECT * FROM `sets` t WHERE NEW.lft = t.rgt))
    OR (EXISTS (SELECT * FROM `sets` t WHERE NEW.rgt = t.lft))
  THEN
    DELETE FROM `sets` WHERE id = NEW.id;
  ELSE
    SET @dum = '';
  END IF;
END//
DELIMITER ;


  DROP VIEW IF EXISTS view_seq;
CREATE VIEW view_seq AS
  SELECT
    lft AS seq,
    id
  FROM
    `sets`
  UNION ALL
  SELECT
    rgt,
    id
  FROM
    `sets`;


-- -- それぞれの集合の、ネストの深さ(1 <= level)を取得するview
--   DROP VIEW IF EXISTS view_levels;
-- CREATE VIEW view_levels AS
--   SELECT
--     node.id,
--     COUNT(*) AS level
--   FROM
--     `sets` node
--     LEFT JOIN `sets` ancestors
--       ON node.lft BETWEEN ancestors.lft AND ancestors.rgt
--   GROUP BY
--     node.id;


/********************************
指定した集合の親集合のidを取得するストアドプロシージャ
第1引数(入力): cID: 基準となる集合のid
第2引数(出力): pID: 親集合のid(存在しなければNULL)
使用例: CALL getParentId(166, @pID);
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getParentId//
CREATE PROCEDURE getParentId (IN cID VARCHAR(16), OUT pID VARCHAR(16))
BEGIN
  SELECT
    parents.id
  INTO
    pID
  FROM
    `sets` AS children LEFT JOIN
    `sets` AS parents ON
      children.lft > parents.lft AND
      children.lft < parents.rgt
  WHERE
    children.id = cID
    AND NOT EXISTS (
      SELECT id FROM `sets` AS middleParents
      WHERE
        middleParents.lft BETWEEN parents.lft AND parents.rgt
        AND children.lft BETWEEN middleParents.lft AND middleParents.rgt
        AND middleParents.id NOT IN (children.id, parents.id)
    );
END//
DELIMITER ;


/********************************
指定した親集合の直下に存在する、子集合の数を取得するストアドプロシージャ
第1引数(入力): pID: 基準となる集合のid
第2引数(出力): cnt: 子集合の数(存在しなければ0)
使用例: CALL getChildrenCount(166, @cnt);
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getChildrenCount//
CREATE PROCEDURE getChildrenCount (IN pID VARCHAR(16), OUT cnt INT)
BEGIN
  SELECT
    COUNT(Children.id)
  INTO
    cnt
  FROM
    `sets` AS Parents LEFT JOIN
    `sets` AS Children ON
      Children.lft > Parents.lft AND
      Children.lft < Parents.rgt
  WHERE
    Parents.id = pID
    AND NOT EXISTS (
      SELECT id FROM `sets` AS middleParents
      WHERE
        middleParents.lft BETWEEN Parents.lft AND Parents.rgt
        AND Children.lft BETWEEN middleParents.lft AND middleParents.rgt
        AND middleParents.id NOT IN (Children.id, Parents.id)
    );
END//
DELIMITER ;


/********************************
指定した集合が包含する子孫集合の数を取得するストアドプロシージャ
第1引数(入力): tID: 対象となる集合のid
第2引数(出力): cnt: 子孫集合の数(存在しなければ0)
使用例: CALL getProgeniesCount(166, @progeniesCount);
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getProgeniesCount//
CREATE PROCEDURE getProgeniesCount (IN tID VARCHAR(16), OUT cnt INT)
BEGIN
  SELECT
    COUNT(Progenies.id)
  INTO
    cnt
  FROM
    `sets` AS Node LEFT JOIN
    `sets` AS Progenies ON
      Node.lft < Progenies.lft AND
      Node.rgt > Progenies.lft
  WHERE
    Node.id = tID
  GROUP BY
    Node.id;
END//
DELIMITER ;



/********************************
指定した親集合の、直下かつ指定位置の子集合の、lftとrgtを取得するストアドプロシージャ
MEMO: 出力変数名をL, Rとしているのは、同名カラムとの混同を避けるため
第1引数(入力): pID: 親集合のid
第2引数(入力): idx: 対象となる子集合の、親集合内における位置(zero-Origin)
第3引数(出力):   L: 対象となる子集合の、lft(該当する集合が存在しない場合はNULL)
第4引数(出力):   R: 対象となる子集合の、rgt(該当する集合が存在しない場合はNULL)
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getChildPlace//
CREATE PROCEDURE getChildPlace (IN pID VARCHAR(16), IN idx INT, OUT L DECIMAL(40, 30), OUT R DECIMAL(40, 30))
BEGIN
  SELECT
    lft, rgt
  INTO
    L, R
  FROM
    `sets`
  WHERE
    id IN (
      SELECT
        Children.id
      FROM
        `sets` AS Parents LEFT JOIN
        `sets` AS Children ON
          Children.lft > Parents.lft AND
          Children.lft < Parents.rgt
      WHERE
        Parents.id = pID
        AND NOT EXISTS (
          SELECT id FROM `sets` AS middleParents
          WHERE
            middleParents.lft BETWEEN Parents.lft AND Parents.rgt
            AND Children.lft BETWEEN middleParents.lft AND middleParents.rgt
            AND middleParents.id NOT IN (Children.id, Parents.id)
        )
    )
  ORDER BY
    lft
  LIMIT
    idx, 1;
END//
DELIMITER ;


/********************************
親集合と位置を指定し、挿入できる空間を求めるストアドプロシージャ
MEMO: 出力変数名をL, Rとしているのは、同名カラムとの混同を避けるため
第1引数(入力): pID: 親集合のid
第2引数(入力): idx: 親集合の中の、何番目に挿入するか(0-origin。負の値を指定した場合は末尾に追加)
第4引数(出力):   L: 対象となる集合のlft(該当する集合が存在しない場合はNULL)
第5引数(出力):   R: 対象となる集合のrgt(該当する集合が存在しない場合はNULL)
依存関係: {
  StoredProcedure: [
    'getChildrenCount',
    'getChildPlace'
  ]
}
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getSpace//
CREATE PROCEDURE getSpace (IN pID VARCHAR(16), IN idx INT, OUT L DECIMAL(40, 30), OUT R DECIMAL(40, 30))
BEGIN
  -- 使用しない値用の変数
  DECLARE ____ DOUBLE;

  DECLARE tmpL DECIMAL(40, 30);
  DECLARE tmpR DECIMAL(40, 30);

  -- 指定された親集合の中に存在する、子集合の数を取得する
  CALL getChildrenCount(pID, @childrenCount);

  -- 指定されたidxが、負の数であるか、または、
  -- 子集合の数を上回るときは、子集合の数で置き換える
  IF idx < 0 OR @childrenCount < idx THEN
    SET idx = @childrenCount;
  END IF;

  -- 指定位置の左の集合のrgtと、指定位置の集合のlftを取得する
  CALL getChildPlace(pID, idx - 1, ____, tmpL);
  CALL getChildPlace(pID, idx,     tmpR, ____);

  -- 指定位置の左に集合が存在しない場合は、親のlftを代入する
  IF tmpL IS NULL THEN
    SELECT lft INTO tmpL FROM `sets` WHERE id = pID;
  END IF;

  -- 指定位置に集合が存在しない場合は、親のrgtを代入する
  IF tmpR IS NULL THEN
    SELECT rgt INTO tmpR FROM `sets` WHERE id = pID;
  END IF;

  -- 挿入可能な座標を算出する
  SET L = (tmpL * 2 + tmpR) / 3;
  SET R = (tmpL + tmpR * 2) / 3;
END//
DELIMITER ;


/********************************
集合(id = outsideId)の中に存在する、集合(id = insideID)の数を返すストアドプロシージャ
(引数のidが等しいときもカウントされる)
第1引数(入力):    outsideID: 外側にあたる集合のid
第2引数(入力):     insideID: 内側にあたる集合のid
第3引数(出力): includeCount: 0 | 1
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS getIncludeCount//
CREATE PROCEDURE getIncludeCount (IN outsideID VARCHAR(16), IN insideID VARCHAR(16), OUT includeCount INT)
BEGIN
  SELECT
    COUNT(*) INTO includeCount
  FROM
    `sets` Inside
  WHERE
    Inside.id = insideID
    AND Inside.lft >= ( SELECT lft FROM `sets` WHERE id = outsideID )
    AND Inside.rgt <= ( SELECT rgt FROM `sets` WHERE id = outsideID );
END//
DELIMITER ;



/********************************
集合(id = id)と、その祖先の更新日時を更新するストアドプロシージャ
第1引数(入力): id: 対象となる集合のid
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS updateAncestors//
CREATE PROCEDURE updateAncestors (IN tID VARCHAR(16))
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE vID VARCHAR(16);

  DECLARE cur CURSOR FOR (
    SELECT
      `id`
    FROM
      `sets`
    WHERE
      `lft` <= (SELECT B.`lft` FROM `sets` AS B WHERE B.`id` = tID) AND
      `rgt` >= (SELECT C.`rgt` FROM `sets` AS C WHERE C.`id` = tID)
  );

  -- 行が見つからなかった場合のハンドラ宣言
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- SQLの結果が変わらないように、集合の移動前にカーソルを開く必要がある
  OPEN cur;

  -- ループ処理を開始
  read_loop: LOOP
    FETCH cur INTO vID;
    IF done THEN
      LEAVE read_loop;
    END IF;
      UPDATE
        `sets`
      SET
        `updatedAt` = CURRENT_TIMESTAMP
      WHERE
        `id` = vID;
  END LOOP;

  -- カーソルありがとう
  CLOSE cur;
END//
DELIMITER ;



/********************************
# 親と位置を指定し、集合(子孫を含む)を移動させるストアドプロシージャ（v2）
# 第1引数: cID: 移動させる集合のid
# 第2引数: pID: 移動先となる集合のid
# 第3引数: idx: 移動先での位置(0-origin。負の値を指定した場合は末尾に追加)
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS moveSets//
CREATE PROCEDURE moveSets (IN cID VARCHAR(16), IN pID VARCHAR(16), IN idx INT, OUT result INT)
move: BEGIN
  -- 最小値比較用の定数（デフォでありそう）
  DECLARE MAX_VALUE DECIMAL(40, 30) DEFAULT 9999999;

  -- 兄弟の中での現在の位置
  DECLARE currentIdx INT DEFAULT -1;

  -- 影響範囲の調整用
  DECLARE alpha INT DEFAULT 0;

  -- 移動先の親の座標
  DECLARE pLft DECIMAL(40, 30);
  DECLARE pRgt DECIMAL(40, 30);

  -- 主体的に移動する集合の座標と移動距離
  DECLARE cLft      DECIMAL(40, 30);
  DECLARE cRgt      DECIMAL(40, 30);
  DECLARE cDistance DECIMAL(40, 30);

  -- 相対的に移動する集合の座標と移動距離
  DECLARE rLft      DECIMAL(40, 30);
  DECLARE rRgt      DECIMAL(40, 30);
  DECLARE rDistance DECIMAL(40, 30);

  -- 座標の一時保存用
  DECLARE tmpLft DECIMAL(40, 30);
  DECLARE tmpRgt DECIMAL(40, 30);

  -- 移動先の座標（点）
  DECLARE newAddress DECIMAL(40, 30);

  -- 集合(id = cID)の中に、集合(id = pID)が存在しない場合のみ更新する
  CALL getIncludeCount(cID, pID, @includeCount);

  IF 0 < @includeCount THEN
    SET result := 1;
    LEAVE move;
  END IF;

  -- id保存用の一時テーブルを作成
  -- DROP TABLE IF EXISTS TMP_TABLE;
  CREATE TEMPORARY TABLE TMP_TABLE (
    `id`   VARCHAR(16),
    `lft`  DECIMAL(40, 30),
    `rgt`  DECIMAL(40, 30),
    `num`  INT,
    `kind` INT
  );

  -- それぞれが何番目の子であるか(0-Origin)
  SET @rowNum := -1;

  -- 移動先の子集合の情報を取得する（複数回使うので一時テーブルに保存）
  INSERT INTO TMP_TABLE (`id`, `lft`, `rgt`, `num`, `kind`)
  SELECT `id`, `lft`, `rgt`, @rowNum := @rownum + 1, 0
  FROM (
    SELECT
      Children.id,
      Children.lft,
      Children.rgt
    FROM
      `sets` AS Parents LEFT JOIN
      `sets` AS Children ON
        Children.lft > Parents.lft AND
        Children.lft < Parents.rgt
    WHERE
      Parents.id = pID AND
      NOT EXISTS (
        SELECT id FROM `sets` AS middleParents
        WHERE
          middleParents.lft BETWEEN Parents.lft AND Parents.rgt
          AND Children.lft BETWEEN middleParents.lft AND middleParents.rgt
          AND middleParents.id NOT IN (Children.id, Parents.id)
      )
    ORDER BY Children.lft
  ) AS Foo;

  -- 挿入先に負の位置を指定された場合は末尾の座標に置き換える
  IF idx < 0 THEN
    SELECT COUNT(*) INTO idx FROM TMP_TABLE;
  END IF;

  -- 兄弟の中での現在の座標を求める
  SELECT IFNULL(`num`, -1) INTO currentIdx FROM TMP_TABLE WHERE `id` = cID LIMIT 0, 1;

  -- 同じ親の元で、順番だけが替わり、かつ右に移動する場合は、それを考慮して範囲を求めなければならない
  IF 0 <= currentIdx AND currentIdx < idx THEN
    SET alpha := 1;
  END IF;

  -- 移動対象・移動先となる集合の座標を取得する
  SELECT `lft`, `rgt` INTO cLft, cRgt FROM `sets` WHERE `id` = cID;
  SELECT `lft`, `rgt` INTO pLft, pRgt FROM `sets` WHERE `id` = pID;

  -- idx番目未満の子が持つ最大のrgt
  SELECT MAX(`rgt`) INTO tmpLft FROM TMP_TABLE WHERE `num` < (idx + alpha);

  -- idx番目以降の子が持つ最小のlft
  SELECT MIN(`lft`) INTO tmpRgt FROM TMP_TABLE WHERE `num` >= (idx + alpha);

  -- なければ親のlft, rgtを使う
  SET tmpLft := COALESCE(tmpLft, pLft);
  SET tmpRgt := COALESCE(tmpRgt, pRgt);

  -- 挿入先の座標（点）を計算する
  SET newAddress := (tmpLft + tmpRgt) / 2;

  -- 相対的に移動する必要のある座標の範囲を求める
  IF newAddress < cLft THEN
    SELECT `seq` INTO rLft FROM `view_seq` WHERE newAddress < `seq` AND `seq` < cLft ORDER BY `seq`  ASC LIMIT 0, 1;
    SELECT `seq` INTO rRgt FROM `view_seq` WHERE newAddress < `seq` AND `seq` < cLft ORDER BY `seq` DESC LIMIT 0, 1;
  ELSE
    SELECT `seq` INTO rLft FROM `view_seq` WHERE cRgt < `seq` AND `seq` < newAddress ORDER BY `seq`  ASC LIMIT 0, 1;
    SELECT `seq` INTO rRgt FROM `view_seq` WHERE cRgt < `seq` AND `seq` < newAddress ORDER BY `seq` DESC LIMIT 0, 1;
  END IF;

  -- それぞれの集合について、移動を必要とする距離を計算する
  IF newAddress < cLft THEN
    SET cDistance := rLft - cLft; -- 左に主体的に移動する集合
    SET rDistance := cRgt - rRgt; -- 右に相対的に移動する集合
  ELSE
    SET cDistance := rRgt - cRgt; -- 右に主体的に移動する集合
    SET rDistance := cLft - rLft; -- 左に相対的に移動する集合
  END IF;

  -- 移動対象（id = cID）及び包含される子孫要素のidを一時保存
  INSERT INTO TMP_TABLE (`id`, `kind`) SELECT `id`, 1 FROM `sets` WHERE lft BETWEEN cLft AND cRgt;

  -- 相対的に移動（rgtを更新）する対象のidを一時保存
  INSERT INTO TMP_TABLE (`id`, `kind`) SELECT `id`, 2 FROM `sets` WHERE rgt BETWEEN rLft AND rRgt;

  -- 相対的に移動（lftを更新）する対象のidを一時保存
  INSERT INTO TMP_TABLE (`id`, `kind`) SELECT `id`, 3 FROM `sets` WHERE lft BETWEEN rLft AND rRgt;

  -- 更新処理を開始
  UPDATE `sets` SET lft = lft + cDistance, rgt = rgt + cDistance
  WHERE `sets`.`id` IN (SELECT `id` FROM TMP_TABLE WHERE kind = 1);

  UPDATE `sets` SET rgt = rgt + rDistance
  WHERE `sets`.`id` IN (SELECT `id` FROM TMP_TABLE WHERE kind = 2);

  UPDATE `sets` SET lft = lft + rDistance
  WHERE `sets`.`id` IN (SELECT `id` FROM TMP_TABLE WHERE kind = 3);

  SET result := 0;
END//
DELIMITER ;


/********************************
# 全ての集合の間隔を１にするストアドプロシージャ
依存関係: {
  View: [
    'view_seq'
  ]
}
********************************/
DELIMITER //
  DROP PROCEDURE IF EXISTS sparseSets//
CREATE PROCEDURE sparseSets ()
BEGIN
  DECLARE floatCount INT;
  
  SET floatCount := (SELECT COUNT(*) FROM `view_seq` WHERE `seq` % 1 > 0);

  IF floatCount > 0 THEN
    --  1 最大値 = 最小値か、つまり root はひとつか
    SELECT
      ( SELECT b.id FROM `sets` b WHERE b.lft = ( select min(c.lft) from `sets` c ) ) minid,
      ( SELECT b.id FROM `sets` b WHERE b.rgt = ( select max(c.rgt) from `sets` c ) ) maxid;

    1b. root 検証その２  root つまり 親がいないノードは一つか
    SELECT `id` AS root FROM `sets` c WHERE
      NOT EXISTS ( SELECT * FROM `sets` p WHERE c.lft > p.lft AND c.rgt < p.rgt );

     2. 入れ子の検証
    SELECT
      parents.id AS pid,
      children.id AS cid,
      CASE
        WHEN parents.id IS NULL THEN 'root'
        WHEN children.id IS NULL THEN 'leaf'
        WHEN children.rgt < parents.rgt THEN 'ok'
        ELSE 'bad node'
      END AS validate
    FROM
      sets parents
      LEFT OUTER JOIN sets children ON parents.lft = (
        SELECT
          MAX(lft)
        FROM
          sets AS ancestor
        WHERE
          children.lft > ancestor.lft AND
          children.lft < ancestor.rgt
      )
    LIMIT 0, 2300;

     3 重複値チェック
     ※ 左右併せて一つの position = view_seq.seq は１行のみに出現し、id が複数出てきたりしないことを検証
    SELECT * FROM (SELECT seq, COUNT(*) AS cnt, MAX(id) AS maxid, MIN(id) AS minid FROM view_seq GROUP BY seq ORDER BY seq) AS foo WHERE cnt <> 1;

     実行前に 最大値、最小値、件数 をチェック
    SELECT COUNT(id) cnt, MIN(lft) AS min, MAX(rgt) AS max FROM sets;

    REPLACE INTO sets (id, txt, link, opened, isGroup, lft, rgt, createdAt, updatedAt)
    SELECT
      org.id,
      org.txt,
      org.link,
      org.opened,
      org.isGroup,
      MIN(ren) AS lft,
      MAX(ren) AS rgt,
      org.createdAt,
      org.updatedAt
    FROM
      (
        SELECT s1.seq, s1.id, count(s2.seq) ren FROM `view_seq` AS s1
          LEFT JOIN `view_seq` AS s2 ON s1.seq >= s2.seq
        GROUP BY s1.seq, s1.id
      ) AS temp
      LEFT JOIN sets AS org ON temp.id = org.id
    GROUP BY
      org.id;
  END IF;
END//
DELIMITER ;

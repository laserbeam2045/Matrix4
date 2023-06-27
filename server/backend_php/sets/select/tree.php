<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

// $sql = "
//   SELECT
//     Foo.id,
//     Foo.txt,
//     Foo.link,
//     Foo.opened,
//     Foo.parent,
//     Bar.progeniesCount
//   FROM
//     view_children AS Foo
//   JOIN (
//     SELECT
//       id, COUNT(progenyId) AS progeniesCount
//     FROM
//       view_ancestors
//     GROUP BY
//       id
//   ) AS Bar
//   WHERE
//     Foo.lft BETWEEN
//       (SELECT lft FROM sets WHERE id = :id1) AND
//       (SELECT rgt FROM sets WHERE id = :id2) AND
//     Foo.id = Bar.id;
// ";

$sql = "
  SELECT
    Node.id,
    Node.txt,
    Node.link,
    Node.opened,
    Node.isGroup,
    Node.lft,
    Node.rgt,
    Node.updatedType,
    Node.createdAt,
    Node.updatedAt,
    Parents.id AS parent,
    COUNT(DISTINCT Ancestors.id) AS level,
    COUNT(DISTINCT Progenies.id) AS progeniesCount
  FROM
    sets AS Node
    LEFT JOIN sets AS Parents ON
      Node.lft > Parents.lft AND Node.lft < Parents.rgt AND
      Parents.lft = (SELECT MAX(lft) FROM sets WHERE Node.lft > lft AND Node.lft < rgt)
    LEFT JOIN sets AS Progenies ON
      Node.lft < Progenies.lft AND Node.rgt > Progenies.lft
    LEFT JOIN sets AS Ancestors ON
      Node.lft > Ancestors.lft AND Node.lft < Ancestors.rgt
  WHERE
    Node.lft BETWEEN
      (SELECT lft FROM sets WHERE id = :id1) AND
      (SELECT rgt FROM sets WHERE id = :id2)
  GROUP BY
    id
  ORDER BY
    lft;
";

// $sql_1 = "
//   CALL get_place(:id, @L, @R);
// ";

// $sql_2 = "
//   SELECT
//     Node.id,
//     Node.txt,
//     Node.link,
//     Node.opened,
//     Node.lft,
//     Node.rgt,
//     Node.createdAt AS createdAt,
//     Node.updatedAt AS updatedAt,
//     Parents.id AS parent,
//     COUNT(Progenies.id) AS progeniesCount
//   FROM
//     `sets` AS Node
//     LEFT JOIN `sets` AS Parents ON
//       Parents.lft < Node.lft AND
//       Parents.lft = (SELECT MAX(lft) FROM sets WHERE Node.lft > lft AND Node.lft < rgt)
//     LEFT JOIN `sets` AS Progenies ON
//       Node.lft < Progenies.lft AND Node.rgt > Progenies.lft
//   WHERE
//     Node.lft BETWEEN @L AND @R
//   GROUP BY
//     id
//   ORDER BY
//     lft;
// ";

// $sql_1 = "
//   SELECT
//     `id`,
//     `lft`
//   FROM
//     `sets`
//   WHERE
//     `lft` BETWEEN
//       (SELECT lft FROM sets WHERE id = :id1) AND
//       (SELECT rgt FROM sets WHERE id = :id2)
//   ORDER BY
//     `lft`;
// ";

// $sql_2 = "
//   SET @tID = :id;
// ";

// $sql_3 = "
//   CALL get_parent(@tID, @parent);
// ";

// $sql_4 = "
//   CALL get_progenies_count(@tID, @progeniesCount);
// ";

// $sql_5 = "
//   SELECT
//     id,
//     txt,
//     link,
//     opened,
//     lft,
//     rgt,
//     createdAt AS createdAt,
//     updatedAt AS updatedAt,
//     @parent AS parent,
//     @progeniesCount AS progeniesCount
//   FROM
//     `sets`
//   WHERE
//     id = @tID;
// ";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindParam(':id1', $_GET['id']);
    $stmt_1->bindParam(':id2', $_GET['id']);
    $stmt_1->execute();

    http_response_code(200);
    echo json_encode(Array(result => $stmt_1->fetchAll(PDO::FETCH_ASSOC)));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
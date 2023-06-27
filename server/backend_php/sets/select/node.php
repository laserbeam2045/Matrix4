<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
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
      Node.lft > Parents.lft AND Node.lft < Parents.rgt
    LEFT JOIN sets AS Progenies ON
      Node.lft < Progenies.lft AND Node.rgt > Progenies.lft
    LEFT JOIN sets AS Ancestors ON
      Node.lft > Ancestors.lft AND Node.lft < Ancestors.rgt
  WHERE
    Node.id = :id
    AND NOT EXISTS (
      SELECT id FROM sets AS MiddleParents
      WHERE
        MiddleParents.lft BETWEEN Parents.lft AND Parents.rgt
        AND Node.lft BETWEEN MiddleParents.lft AND MiddleParents.rgt
        AND MiddleParents.id NOT IN (Node.id, Parents.id)
    )
  GROUP BY
    id
  ORDER BY
    lft;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindParam(':id', $_GET['id']);
    $stmt_1->execute();

    http_response_code(200);
    echo json_encode(Array(result => $stmt_1->fetchAll(PDO::FETCH_ASSOC)[0]));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
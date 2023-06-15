<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  SELECT
    Node.id,
    Node.txt,
    Parents.id AS parent,
    Parents.txt AS parentTxt
  FROM
    sets AS Node
    LEFT JOIN sets AS Parents ON
      Node.lft > Parents.lft AND Node.lft < Parents.rgt AND
      Parents.lft = (SELECT MAX(lft) FROM sets WHERE Node.lft > lft AND Node.lft < rgt)
  WHERE
    Node.txt LIKE :word
  GROUP BY
    Node.id
  ORDER BY
    Node.lft;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $word = '%' . $_GET['word'] . '%';
    $stmt_1->bindParam(':word', $word);
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
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  SELECT
    updatedAt
  FROM
    sets
  WHERE
    id = :id;
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
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../db.php');
include('../functions.php');

$sql = "
  UPDATE
    dictionary
  SET
    zzz = 1
  WHERE
    id = :id;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindValue(':id', $_GET['id'], PDO::PARAM_STR);
    $stmt_1->execute();
    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array(
      "status" => "ok",
      "id" => $_GET['id'],
    ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  UPDATE
    sets
  SET
    isGroup = :isGroup
  WHERE
    id = :idOne;
";

$sql_2 = "
  CALL updateAncestors(:idTwo, 7);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);
  $stmt_2 = $dbh->prepare($sql_2);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindValue(':idOne', $_GET['id']);
    $stmt_1->bindValue(':isGroup', $_GET['isGroup']);
    $stmt_1->execute();

    $stmt_2->bindValue(':idTwo', $_GET['id']);
    $stmt_2->execute();

    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( result => 0 ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
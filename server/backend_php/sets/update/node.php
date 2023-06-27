<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  UPDATE
    sets
  SET
    txt = :txt,
    link = :link,
    opened = :opened,
    isGroup = :isGroup
  WHERE
    id = :id;
";

$sql_2 = "
  CALL updateAncestors(:id, 4);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);
  $stmt_2 = $dbh->prepare($sql_2);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindValue(':id', $_GET['id']);
    $stmt_1->bindValue(':txt', $_GET['txt']);
    $stmt_1->bindValue(':link', $_GET['link']);
    $stmt_1->bindValue(':opened', $_GET['opened']);
    $stmt_1->bindValue(':isGroup', $_GET['isGroup']);
    $stmt_1->execute();

    $stmt_2->bindValue(':id', $_GET['id']);
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
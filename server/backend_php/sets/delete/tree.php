<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  CALL updateAncestors(:id);
";

$sql_2 = "
  DELETE FROM
    sets
  WHERE
    lft BETWEEN
      (SELECT tmp1.lft FROM (SELECT sets.lft FROM sets WHERE id = :idOne) as tmp1) AND
      (SELECT tmp2.rgt FROM (SELECT sets.rgt FROM sets WHERE id = :idTwo) as tmp2);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);
  $stmt_2 = $dbh->prepare($sql_2);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindParam(':id', $_GET['id']);
    $stmt_1->execute();

    $stmt_2->bindParam(':idOne', $_GET['id']);
    $stmt_2->bindParam(':idTwo', $_GET['id']);
    $stmt_2->execute();

    // コミット
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
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  CALL updateAncestors(:id);
";

$sql_2 = "
  CALL moveSets(:cID, :pID, :idx, @result);
";

$sql_3 = "
  CALL updateAncestors(:id);
";

$sql_4 = "
  SELECT @result;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);
  $stmt_2 = $dbh->prepare($sql_2);
  $stmt_3 = $dbh->prepare($sql_3);
  $stmt_4 = $dbh->prepare($sql_4);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindValue(':id', $_GET['cID']);
    $stmt_1->execute();

    $stmt_2->bindValue(':cID', $_GET['cID']);
    $stmt_2->bindValue(':pID', $_GET['pID']);
    $stmt_2->bindValue(':idx', $_GET['idx']);
    $stmt_2->execute();

    $stmt_3->bindValue(':id', $_GET['pID']);
    $stmt_3->execute();

    $stmt_4->execute();

    $result = $stmt_4->fetchAll(PDO::FETCH_ASSOC)[0]["@result"];

    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( result => $result ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  INSERT INTO set_ids
    (set_id)
  VALUES
    (:set_id);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindValue(':set_id', $_GET['id'], PDO::PARAM_STR);
    $stmt->execute();

    // コミット
    $dbh->commit();

    http_response_code(200);

  } catch(PDOException $e) {

    http_response_code(403);
    // ロールバック
    $dbh->rollback();
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  DELETE FROM set_ids WHERE set_id = :id;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  // $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':id', $_GET['id']);
    $stmt->execute();
    // コミット
    $dbh->commit();

    http_response_code(200);

  } catch(PDOException $e) {
    // ロールバック
    $dbh->rollback();
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
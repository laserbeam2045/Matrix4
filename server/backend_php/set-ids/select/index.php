<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  SELECT
    id,
    set_id AS setId,
    createdAt AS createdAt,
    updatedAt AS updatedAt
  FROM
    set_ids;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

  } catch(PDOException $e) {
    // ロールバック
    $dbh->rollback();
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
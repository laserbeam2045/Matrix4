<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  DELETE FROM
    quizzes
  WHERE
    id = :id;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 挿入先を取得
    $stmt_1->bindValue(':id', $_GET['id'], PDO::PARAM_INT);
    $stmt_1->execute();

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
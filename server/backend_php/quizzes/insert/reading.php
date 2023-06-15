<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  INSERT INTO readings
    (quiz_id, order_num, correct_char, wrong_char1, wrong_char2, wrong_char3)
  VALUES
    (:quiz_id, :order_num, :correct_char, :wrong_char1, :wrong_char2, :wrong_char3);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 挿入先を取得
    $stmt_1->bindValue(':quiz_id', $_GET['quiz_id'], PDO::PARAM_INT);
    $stmt_1->bindValue(':order_num', $_GET['order_num'], PDO::PARAM_INT);
    $stmt_1->bindValue(':correct_char', $_GET['correct_char'], PDO::PARAM_STR);
    $stmt_1->bindValue(':wrong_char1', $_GET['wrong_char1'], PDO::PARAM_STR);
    $stmt_1->bindValue(':wrong_char2', $_GET['wrong_char2'], PDO::PARAM_STR);
    $stmt_1->bindValue(':wrong_char3', $_GET['wrong_char3'], PDO::PARAM_STR);
    $stmt_1->execute();

    // コミット
    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( result => $_GET['id'] ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  INSERT INTO quizzes3
    (id, question, answer, reading, player_id, corrected_num, wronged_num, answered_num, like_num, is_history, created_at, updated_at)
  VALUES
    (:id, :question, :answer, :reading, :player_id, :corrected_num, :wronged_num, :answered_num, :like_num, :is_history, :created_at, :updated_at);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 挿入先を取得
    $stmt_1->bindValue(':id', $_GET['id'], PDO::PARAM_INT);
    $stmt_1->bindValue(':question', $_GET['question'], PDO::PARAM_STR);
    $stmt_1->bindValue(':answer', $_GET['answer'], PDO::PARAM_STR);
    $stmt_1->bindValue(':reading', $_GET['reading'], PDO::PARAM_STR);
    $stmt_1->bindValue(':player_id', $_GET['player_id'], PDO::PARAM_INT);
    $stmt_1->bindValue(':corrected_num', $_GET['corrected_num'], PDO::PARAM_INT);
    $stmt_1->bindValue(':wronged_num', $_GET['wronged_num'], PDO::PARAM_INT);
    $stmt_1->bindValue(':answered_num', $_GET['answered_num'], PDO::PARAM_INT);
    $stmt_1->bindValue(':like_num', $_GET['like_num'], PDO::PARAM_INT);
    $stmt_1->bindValue(':is_history', $_GET['is_history'], PDO::PARAM_INT);
    $stmt_1->bindValue(':created_at', $_GET['created_at'], PDO::PARAM_STR);
    $stmt_1->bindValue(':updated_at', $_GET['updated_at'], PDO::PARAM_STR);
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
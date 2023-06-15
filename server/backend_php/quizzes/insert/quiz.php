<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  INSERT INTO quizzes
    (question, answer1, answer2, correctAnswerRate)
  VALUES
    (:question, :answer1, :answer2, :correctAnswerRate);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 挿入先を取得
    $stmt_1->bindValue(':question', $_GET['question'], PDO::PARAM_STR);
    $stmt_1->bindValue(':answer1', $_GET['answer1'], PDO::PARAM_STR);
    $stmt_1->bindValue(':answer2', $_GET['answer2'], PDO::PARAM_STR);
    $stmt_1->bindValue(':correctAnswerRate', $_GET['correctAnswerRate'], PDO::PARAM_STR);
    $stmt_1->execute();

    $id = $dbh->lastInsertId();

    // コミット
    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( result => $id ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
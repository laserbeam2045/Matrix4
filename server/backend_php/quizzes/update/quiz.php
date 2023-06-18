<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  UPDATE
    quizzes
  SET
    question = :question,
    answer1 = :answer1,
    answer2 = :answer2,
    correctAnswerRate = :correctAnswerRate
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
    $stmt_1->bindValue(':question', $_GET['question'], PDO::PARAM_STR);
    $stmt_1->bindValue(':answer1', $_GET['answer1'], PDO::PARAM_STR);
    $stmt_1->bindValue(':answer2', $_GET['answer2'], PDO::PARAM_STR);
    $stmt_1->bindValue(':correctAnswerRate', $_GET['correctAnswerRate'], PDO::PARAM_STR);
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
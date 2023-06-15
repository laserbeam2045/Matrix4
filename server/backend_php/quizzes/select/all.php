<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  SELECT
    quizzes3.id AS quiz_id,
    question,
    answer,
    reading,
    corrected_num,
    wronged_num,
    answered_num,
    like_num,
    created_at,
    updated_at
  FROM
    quizzes3
  ORDER BY
    question;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->execute();

    $items = $stmt_1->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(Array(
      "status" => "ok",
      "total" => count($items),
      "items" => $items,
    ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
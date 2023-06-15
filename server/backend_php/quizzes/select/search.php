<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql1 = "
  SELECT
    quizzes3.id AS quiz_id,
    question,
    answer,
    reading,
    corrected_num,
    wronged_num,
    answered_num,
    like_num,
    push_point,
    order_num,
    correct_char,
    wrong_char1,
    wrong_char2,
    wrong_char3,
    created_at,
    updated_at
  FROM
    quizzes3
  LEFT JOIN
    readings ON quizzes3.id = readings.quiz_id
  WHERE
    quiz_id >= :minn AND
    quiz_id < :maxx AND (
      question LIKE :word1 OR
      answer LIKE :word2 OR
      reading LIKE :word3
    )
  ORDER BY
    quizzes3.id,
    question,
    order_num;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql1);

  $min = $_GET['min'];
  $max = $_GET['max'];
  $word1 = $_GET['word'] ? $_GET['word'] : '%';

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $word = $word1 ? ('%' . $word1 . '%') : '%';

    $stmt_1->bindValue(':minn', $min, PDO::PARAM_INT);
    $stmt_1->bindValue(':maxx', $max, PDO::PARAM_INT);
    $stmt_1->bindValue(':word1', $word, PDO::PARAM_STR);
    $stmt_1->bindValue(':word2', $word, PDO::PARAM_STR);
    $stmt_1->bindValue(':word3', $word, PDO::PARAM_STR);
    $stmt_1->execute();

    $result = $stmt_1->fetchAll(PDO::FETCH_ASSOC);
    $total = 0;
    $items = Array();
    $item_id = null;

    foreach ($result as $value) {
      if ($item_id != $value["quiz_id"]) {
        $item_id = $value["quiz_id"];
        $items[] = Array(
          "quiz_id" => $value["quiz_id"],
          "question" => $value["question"],
          "answer" => $value["answer"],
          "reading" => $value["reading"],
          "readings" => Array(),
          "corrected_num" => $value["corrected_num"],
          "wronged_num" => $value["wronged_num"],
          "answered_num" => $value["answered_num"],
          "question" => $value["question"],
          "like_num" => $value["like_num"],
          "push_point" => $value["push_point"],
          "created_at" => $value["created_at"],
          "updated_at" => $value["updated_at"],
        );
        $total++;
      }
      $items[$total - 1]["readings"][] = Array(
        "quiz_id" => $value["quiz_id"],
        "order_num" => $value["order_num"],
        "correct_char" => $value["correct_char"],
        "wrong_char1" => $value["wrong_char1"],
        "wrong_char2" => $value["wrong_char2"],
        "wrong_char3" => $value["wrong_char3"],
      );
    }

    http_response_code(200);
    echo json_encode(Array(
      "status" => "ok",
      "total" => $total,
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
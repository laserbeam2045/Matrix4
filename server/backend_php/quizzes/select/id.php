<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  SELECT
    id AS quiz_id
  FROM
    quizzes3;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql);

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt_1->bindParam(':quiz_id', $_GET["quiz_id"]);
    $stmt_1->execute();

    $result = $stmt_1->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(Array(
      "ids" => $result,
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
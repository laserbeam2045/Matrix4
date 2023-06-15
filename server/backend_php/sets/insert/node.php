<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql_1 = "
  CALL getSpace(:pID, -1, @L, @R);
";

$sql_2 = "
  INSERT INTO sets
    (id, txt, link, lft, rgt, opened)
  VALUES
    (:id, :txt, :link, @L, @R, 1);
";

$sql_3 = "
  CALL updateAncestors(:id);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt_1 = $dbh->prepare($sql_1);
  $stmt_2 = $dbh->prepare($sql_2);
  $stmt_3 = $dbh->prepare($sql_3);

  // 主キーとなるidをランダムに生成
  $id = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 挿入先を取得
    $stmt_1->bindValue(':pID', $_GET['pID'], PDO::PARAM_STR);
    $stmt_1->execute();

    // データを挿入
    $stmt_2->bindValue(':id',   $id,           PDO::PARAM_STR);
    $stmt_2->bindValue(':txt',  $_GET['txt'],  PDO::PARAM_STR);
    $stmt_2->bindValue(':link', $_GET['link'], PDO::PARAM_STR);
    $stmt_2->execute();

    // 祖先の更新日時をUPDATE
    $stmt_3->bindValue(':id', $id, PDO::PARAM_STR);
    $stmt_3->execute();

    // コミット
    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( id => $id ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
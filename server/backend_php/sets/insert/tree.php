<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

// ルートのid, lft, rgtを取得
$sql1 = "
  SELECT
    id,
    lft,
    rgt
  INTO
    @rootID,
    @rootLft,
    @rootRgt
  FROM
    sets
  WHERE
    rgt = (SELECT MAX(rgt) FROM sets);
";

// コピー対象のノード(頂点)のlft, rgtを取得
$sql2 = "
  SELECT
    id,
    lft,
    rgt,
    rgt - lft + 1,
    rgt - lft + 1 + @rootRgt,
    rgt - lft + 1 + @rootRgt - rgt - 1
  INTO
    @targetID,
    @targetLft,
    @targetRgt,
    @targetWidth,
    @newRootRgt,
    @difference
  FROM
    sets
  WHERE
    id = :pID;
";

// コピー対象（子孫含む）の情報を取得
$sql3 = "
  SELECT
    id,
    rgt
  FROM
    sets
  WHERE
    rgt BETWEEN
      (SELECT lft FROM sets WHERE id = @targetID) AND
      (SELECT rgt FROM sets WHERE id = @targetID)
  ORDER BY
    rgt DESC
";

// ルートのrgtを拡張する
$sql4 = "
  UPDATE
    sets
  SET
    rgt = @newRootRgt
  WHERE
    id = @rootID;
";

// コピー対象のノードの情報を取得
$sql5 = "
  SELECT
    txt,
    opened,
    lft,
    rgt
  INTO
    @targetName,
    @targetOpen,
    @targetLft,
    @targetRgt
  FROM
    sets
  WHERE
    id = :id;
";

// ノードのコピーを作成
$sql6 = "
  INSERT INTO sets
  (id, txt, opened, lft, rgt) VALUES
  (
    :id,
    @targetName,
    @targetOpen,
    @targetLft + @difference,
    @targetRgt + @difference
  )
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt1 = $dbh->prepare($sql1);
  $stmt2 = $dbh->prepare($sql2);
  $stmt3 = $dbh->prepare($sql3);
  $stmt4 = $dbh->prepare($sql4);
  $stmt5 = $dbh->prepare($sql5);
  $stmt6 = $dbh->prepare($sql6);

  // コピー対象のノード(頂点)のid
  $pID = $_GET['id'];

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // ルートのid, lft, rgtを取得
    $stmt1->execute();

    // コピー対象のノード(頂点)のlft, rgtを取得
    $stmt2->bindValue(':pID', $pID, PDO::PARAM_STR);
    $stmt2->execute();

    // コピー対象（子孫含む）の情報を取得
    $stmt3->execute();
    $targets = $stmt3->fetchAll(PDO::FETCH_ASSOC);

    // ルートのrgtを拡張する
    $stmt4->execute();

    // コピー先のトップのid（上書きされないように保存している）
    $newId1 = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
    $newId2 = $newId1;

    // 順次コピーする
    foreach($targets as $node) {
      $stmt5->bindValue(':id', $node["id"], PDO::PARAM_STR);
      $stmt5->execute();
      $stmt6->bindValue(':id', $newId2, PDO::PARAM_STR);
      $stmt6->execute();

      // 次のid
      $newId2 = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
    }

    $dbh->commit();

    http_response_code(200);
    echo json_encode(Array( id => $newId1 ));

  } catch(PDOException $e) {
    $dbh->rollback();
    http_response_code(403);
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;
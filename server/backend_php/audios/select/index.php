<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include('../../db.php');
include('../../functions.php');

$sql = "
  SELECT
    Paths.path,
    Audios.file_name AS fileName,
    Audios.extension,
    Audios.volume,
    Audios.label
    FROM
      `audios` Audios LEFT JOIN
      `paths` Paths ON Audios.path_id = Paths.id
    WHERE %s;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);

  $labels = $_GET['audioLabels'];
  $labels = isset($labels) ? explode(',', $labels) : NULL;

  $inClause = 'label' . getInClause($labels);

  $_sql = sprintf($sql, $inClause);
  $stmt = $dbh->prepare($_sql);
  $stmt->execute($labels);

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  http_response_code(200);

  echo json_encode($result);

} catch(PDOException $e) {
  $dbh->rollback();
  http_response_code(403);
  throw $e;
}

$dbh = null;

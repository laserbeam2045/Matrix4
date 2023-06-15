<?php

header("Access-Control-Allow-Origin: *");

// ファイルのパス
$filepath = 'model_json';
 
// リネーム後のファイル名
$filename = 'model.json';
 
header('Content-Type: application/force-download');
header('Content-Length: ' . filesize($filepath));
header('Content-Disposition: attachment; filename="' . $filename . '"');
 
// ファイルを読み込みダウンロードを実行
readfile($filepath);

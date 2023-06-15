<?php

// PDOを作成する関数
function getPDO($dsn, $usr, $pas, $option) {
  $pdo = new PDO($dsn, $usr, $pas, $option);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->query("SET NAMES utf8;");
  return $pdo;
}

// Int型に変換するだけの関数
function str2Int($str) {
  return (int)$str;
}

// 不要なキーを削除する関数
function filtering(&$arr) {
  foreach($arr as &$node) {
    unset($node['lft']);
    unset($node['parent']);
    unset($node['childrenCnt']);
  }
}

// csv文字列を配列として取得する関数
function csv2Array($data, $prop = null) {
  if (is_string($data))
    return explode(',', $data);
  else
  if (is_array($data) && isset($data[$prop]))
    return explode(',', $data[$prop]);
}

// SQLのIN句を生成する関数
function getInClause($data) {
  if (is_array($data))
    return ' IN (' . substr(str_repeat(',?', count($data)), 1) . ')';
  else
    return ' IN (' . $data . ')';
}

// SQLを実行してデータを取得する関数
function getData($stmt, $params = null) {
  if (is_null($params)) {
    $stmt->execute();
  } else {
    $stmt->execute($params);
  }
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// SQLで取得されたデータを木構造に起こす関数
function assemble(&$parentNode, &$arr, $idx = 1) {
  if (array_key_exists('children', $parentNode)) {
    return;
  }
  $parentNode['children'] = [];

  while (count($parentNode['children']) < $parentNode['childrenCnt']) {
    $node =& $arr[$idx];

    if ($node['parent'] === $parentNode['id']) {
      $parentNode['children'][] =& $node;
    }
    $idx++;
    assemble($node, $arr, $idx);
  }
}

/**
 * 指定された桁数のランダム文字列を生成する
 * （古い環境では暗号学的な強さにならない場合もあるが、ほとんどの環境は問題ない）
 * 
 * @param int $length 求める文字列の長さ（桁数）
 * @param string $chars ランダム文字列に使用したい文字一覧
 */
function randomstr($length, $chars)
{
    $retstr = '';
    $data = openssl_random_pseudo_bytes($length);
    $num_chars = strlen($chars);
    for ($i = 0; $i < $length; $i++)
    {
        $retstr .= substr($chars, ord(substr($data, $i, 1)) % $num_chars, 1);
    }
    return $retstr;
}

// // 16進数の範囲で16桁の文字列を生成する場合
// $rand1 = randomstr(16, '0123456789ABCDEF');
// // 32進数（Ｂａｓｅ３２）の範囲で16桁の文字列を生成する場合
// $rand2 = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
// // 英数大小文字の範囲で16桁の文字列を生成する場合
// $rand3 = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
// // 英数大小文字（+ /）の範囲で16桁の文字列を生成する場合
// $rand3 = randomstr(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

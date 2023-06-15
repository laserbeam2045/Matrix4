<?php

define('TEST_MODE', false);

if (TEST_MODE):
  define('DSN', 'mysql:dbname=problems;host=localhost');
  define('USERNAME', 'root');
  define('PASSWORD', '');
  define('PDO_OPTION', [
    // エラー発生時に例外を投げる
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    // エミュレートモードをOFFにする(数値型を文字列型にさせないため)
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
else:
  define('DSN', 'mysql:host=mysql101.phy.lolipop.lan;dbname=LAA0723421-database;');
  define('USERNAME', 'LAA0723421');
  define('PASSWORD', 'hide2631');
  define('PDO_OPTION', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
endif;
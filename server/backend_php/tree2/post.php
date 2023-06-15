<?php

	mb_language("japanese");
	mb_internal_encoding("utf-8");

	// $name = $postData['name'];
	// $main = 'main';

	$name = $_POST[0]['name'];
	$main = $_POST[0]['main'];

	// $main .= "\n\n\n".$_POST['date'];
	// $main .= "\n\n".$_POST['userAgent'];
	// $main .= "\n\nブラウザ：".$_POST['appName'];
	// $main .= "\nバージョン：".$_POST['appVersion'];
	// $main .= "\nコードネーム：".$_POST['appCodeName'];
	// $main .= "\nプラットフォーム：".$_POST['platform'];
	// $main .= "\n横幅 {$_POST['innerWidth']}   高さ {$_POST['innerHeight']}";

	// $main .= "\n\nIPアドレス：".$_SERVER['REMOTE_ADDR'];
	// $main .= "\nホスト：".gethostbyaddr($_SERVER['REMOTE_ADDR']);

	if (!$name) $name = "名無しさん";

	var_dump($_POST);
	var_dump($name);

	$success = mb_send_mail( "334558612@i.softbank.jp", $name, $main );
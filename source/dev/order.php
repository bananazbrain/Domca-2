<?php
if (isset($_POST['name'])) {
	$name = $_POST['name'];
}
if (isset($_POST['tel'])) {
	$tel = $_POST['tel'];
}

$message;

if ($name) {
	$message .= "\nИмя: $name";
}

if ($tel) {
	$message .= "\nТелефон: $tel";
}

$to = "jv@bananazbrain.ru";
$headers = "Content-type: text/plain; charset = UTF-8";
$subject = "Новый заказ с сайта";
$send = mail($to, $subject, $message, $headers);

if ($send) {
	echo 1;
}
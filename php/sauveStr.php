<?php
/**
 * sauveStr.php
 */
session_name("cirrus");
session_start();

$reponse["success"] = isset($_SESSION['login'], $_SESSION['pass']);

if($reponse["success"]) {
	$reponse["success"] = (file_put_contents( "../Disk/.data.txt", utf8_encode($_POST['str']) ) !== false);
}

header('Content-type: application/json');
echo htmlspecialchars_decode(json_encode($reponse), ENT_QUOTES);
?>
<?php
session_name("cirrus");
session_start();

$homeDir = isset( $_SESSION['home'] ) ? $_SESSION['home'] : "";

$rootDir = "../Disk";
chdir( $rootDir );

$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
$path = str_replace('~', "./Users$homeDir", $path);
$dest = explode('/', $path);
array_pop($dest);
$dest[] = $_POST['dest'];
$destination = implode('/', $dest);

$succes = rename( $path, $destination );

$reponse = array(
	"success" => $succes,
//	"action" => "rename( $path, $destination )",
	"tabDest" => $dest,
	"dest" => $destination
	);
// return response to client
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $reponse ), ENT_QUOTES );
?>
<?php
session_name("cirrus");
session_start();

$homeDir = isset( $_SESSION['home'] ) ? $_SESSION['home'] : "";

$rootDir = "../Disk";
chdir( $rootDir );

$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
$path = str_replace('~', "./Users$homeDir", $path);
$dest = $_POST['dest'] . '/'. array_pop( explode( '/', $path ) );

$succes = rename( $path, $dest );

$reponse = array(
	"success" => $succes,
	"action" => "rename( $path, $dest )",
	"dest" => $dest
	);
// return response to client
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( $reponse ), ENT_QUOTES );
?>
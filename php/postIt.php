<?php
/**
 * postIt.php
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date      26/02/1012
 * @version    0.1
 * @revision   $0$
 *
 * @date   revision   marc laville  29/02/2012 : test du get_magic_quotes_gpc()
 *
 * Enregistrement et chargement des post-it
 *
 */
session_name("cirrus");
session_start();

$reponse["success"] = isset($_SESSION['login'], $_SESSION['pass'], $_SESSION['home']);

$homeDir = isset( $_SESSION['home'] ) ? $_SESSION['home'] : "";

if($reponse["success"]) {
	$pathPostit = "../Disk/Users/$homeDir/.postIt.txt";
	if( isset( $_POST['str'] ) ){
		$postIt = ( get_magic_quotes_gpc() == 1 ) ? $_POST['str'] : addslashes( $_POST['str'] );
		$reponse["success"] = ( file_put_contents( $pathPostit, $postIt ) !== false );
	} else {
		$strJson = @file_get_contents( $pathPostit );
		if($strJson !== false) {
			$reponse["postit"] = ( ( strlen($strJson) ) ? json_decode( stripslashes($strJson), true) : array() );
		} else {
			$reponse["success"] = false;
		}
	}
	$reponse["pathPostit"] = "../Disk/Users/$homeDir/.postIt.txt";
}

header('Content-type: application/json');
echo htmlspecialchars_decode(json_encode($reponse), ENT_QUOTES);
?>
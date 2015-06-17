<?php
/**
 * login.php
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       20/02/1012
 * @version    0.2
 * @revision   $1$
 *
 * @date   revision   marc laville  21/02/2012 : scrute le fichier  passwd
 */
/*
 * Gestion du login utilisateur
 */
session_name("cirrus");
session_start();

$reponse["_POST"] = $_POST;
$reponse["success"] = false;
if( isset($_POST['username'], $_POST['password']) ) {
	$homeDir = null;
	
	chdir('../sys');
	$arrPWD = file('passwd', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	foreach($arrPWD as $ligne){
		list($user, $pass, $uid, $gid, $gecos, $home, $shell) = explode(":", $ligne);
		if( $_POST['username'] == $user and md5($_POST['password']) == $pass )
			$homeDir = $home;
	}

	$reponse["success"] = ($homeDir != null);
	$reponse["homeDir"] = $homeDir;
} else {
	$reponse["msg"] = "Vous devez saisir un Nom d'utilisateur et un mot de passe !";
}

if($reponse["success"]) {
    $_SESSION['login'] = $_POST['username'];
    $_SESSION['pass'] = $_POST['password'];
    $_SESSION['home'] =  $homeDir;
}
	$reponse["session"] = $_SESSION;

header('Content-type: application/json');
echo htmlspecialchars_decode(json_encode($reponse), ENT_QUOTES);
?>
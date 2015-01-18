<?php
/**
 * deskUpload.php
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       02/04/1012
 * @version    0.1
 * @revision   $1$
 *
 * A faire : 
 * - tester les droits sur les dossiers
 */
/*
 * Gestion des Uploads
 */
session_name("cirrus");
session_start();

include 'upload.php';

$homeDir = isset( $_SESSION['home'] ) ? $_SESSION['home'] : "";
$path = str_replace('~', $homeDir, "../Disk/Users/~/-bureau/");

// list of valid extensions, ex. array("jpeg", "xml", "bmp")
$allowedExtensions = array();
// max file size in bytes
$sizeLimit = 10 * 1024 * 1024;
$uploader = new qqFileUploader($allowedExtensions, $sizeLimit);
$result = $uploader->handleUpload($path);
// to pass data through iframe you will need to encode all html tags
//$result["rep"] = $path;
echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);

?>
<?php
/**
 * api.php
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       27/01/2015
 * @version    0.1
 * @revision   $0$
 *
 *
 * REST api de gestion des fichiers cirrus (edit)
 *
 * @date   revision   marc laville  10/02/2015 Gestion des retour à la ligne (\n)
 * @date   revision   marc laville  13/05/2015 Gestion opération disque  : mkdir ; rename
 *
 * A Faire :
 * - gestion du parametre $repHome
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
session_name("cirrus");
session_start();

require_once("Rest.inc.php");

define('SYS_ROOT_DIR', '../Disk/');


class API extends REST {

	private $path_root = SYS_ROOT_DIR;
	private $homeDir = '';

	public function __construct( $repHome ){
		parent::__construct();				// Init parent contructor
		
		$homeDir = $repHome;
	}
	
	/*
	 * Dynmically call the method based on the query string
	 */
	public function processApi(){
		$func = strtolower( trim( str_replace("/", "", $_REQUEST['x']) ) );

		if( (int)method_exists($this, $func) > 0 )
			$this->$func();
		else
			$this->response('',404); // If the method not exist with in this class "Page not found".
	}
	/**
	  * Enregistrement d'un fichier texte
	  */
	private function saveFile() {
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		$txt = preg_replace("/\<br\s*\/?\>/i", "\n", $_POST['str']);

		if( file_put_contents( $this->path_root . ltrim( $_POST['path'], '/' ), $txt ) ) {
			$rep = array( 'success' => true );
		} else {
			$rep = array( 'success' => false );
		};
 		$this->response( json_encode($rep), 200 );
	}
	private function loadFile() {
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}
		$path = $this->path_root . ltrim ( $_GET['path'], '/' );
		$lignes=file( $path, FILE_IGNORE_NEW_LINES );
		$this->_content_type = "text/plain;charset=UTF-8";

// 		$this->response( implode( '<br />', $lignes ), 200 );
 		$this->response( implode( "\n", $lignes ), 200 );
   }
	private function makeDir() {
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		chdir( SYS_ROOT_DIR );
	
		$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
		$path = ltrim( str_replace('~', "./Users" . $this->homeDir, $path), '/');
		
		$path = $path . '/NouveauDossier';

		/**
		 * A faire : 
		 * - controler les erreurs
		 * - tester l'existence du fichier renommé
		 * - contrôler l'ecrasement des fichier destination
		 */
		$succes = mkdir($path); //( $path, $dest );

		$reponse = array(
			"success" => $succes,
			"dest" => $path
			);
			
		$this->_content_type = "application/json";
 		$this->response( json_encode($reponse), 200 );
   }
   
	private function renameFile() {
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		chdir( SYS_ROOT_DIR );

		$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
		$path = ltrim( str_replace('~', "./Users" . $_SESSION['home'], $path), '/');

		$dest = explode('/', $path);
		array_pop($dest);
		$dest[] = $_POST['dest'];
		$destination = implode('/', $dest);

		$succes = rename( $path, $destination );
		/**
		 * A faire : 
		 * - controler les erreurs
		 * - tester l'existence du fichier renommé
		 * - contrôler l'ecrasement des fichier destination
		 */
		$reponse = array(
			"success" => $succes,
			"homeDir" => $this->homeDir,
			"action" => "rename( $path, $destination )",
			"dest" => $destination
			);
		$this->_content_type = "application/json";
 		$this->response( json_encode($reponse), 200 );
   }
   
	private function moveFile() {
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		chdir( SYS_ROOT_DIR );

		$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
//		$path = ltrim( str_replace('~', "./Users" . $this->homeDir, $path), '/');
		$path = ltrim( str_replace('~', "./Users" . $_SESSION['home'], $path), '/');
		
		$dest = explode('/', $path);
		$dest = $_POST['dest'] . '/'. array_pop( $dest );

		$succes = rename( $path, $dest );

		$reponse = array(
			"success" => $succes,
			"dest" => $dest
			);
		
 		$this->_content_type = "application/json";
 		$this->response( json_encode($reponse), 200 );
  }
}

// Initiiate Library
$api = new API( isset( $_SESSION['home'] ) ? $_SESSION['home'] : "" );
$api->processApi();

?>
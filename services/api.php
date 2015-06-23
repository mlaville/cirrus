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
 * @date   revision   marc laville  22/06/2015 Révision saveFile pour gèrer le cas où le texte passé en post contient le caractère &
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

	public function parse_query_string($url, $nbParam=null, $qmark=true) {
	
		if ($qmark) {
			$pos = strpos($url, "?");
			if ($pos !== false) {
				$url = substr($url, $pos + 1);
			}
		}
		
		if (empty($url))
			return false;
			
		$tokens = is_null($nbParam) ? explode("&", $url) : explode("&", $url, $nbParam);
		$urlVars = array();
		foreach ($tokens as $token) {
			$tab = explode("=", $token, 2);
			$urlVars[urldecode($tab[0])] = $tab[1];
		}
		return $urlVars;
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
		
		$roughHTTPPOST = file_get_contents("php://input");
		$rep = array( 'roughHTTPPOST' => strlen( $roughHTTPPOST ) );
		//parse it into vars
		$post = $this->parse_query_string($roughHTTPPOST, 2, false); // on attend 2 paramètres
		$str = $post['str'];
	
		$rep['taille-entree'] = strlen( $str );
		$rep['taille-sortie'] = file_put_contents( $this->path_root . ltrim( $post['path'], '/' ), $str );
		
		$rep['success'] = ( $rep['taille-sortie'] !== false );

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
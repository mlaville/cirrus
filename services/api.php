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
 * REST api de gestion des fichiers cirrus
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
require_once("Rest.inc.php");
 
class API extends REST {

	private $path_root = '../Disk/';
	
	public function __construct(){
		parent::__construct();				// Init parent contructor
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
	private function loadFile() {
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}

		$str=file_get_contents( $this->path_root . ltrim ( $_GET['path'], '/' ) );
		$this->_content_type = "text/plain;charset=UTF-8";

 		$this->response( nl2br($str), 200 );
   }
}

// Initiiate Library
$api = new API;
$api->processApi();

?>
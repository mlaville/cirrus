<?php
/**
 * api.php.js
 * 
 * @auteur     marc laville
 * @Copyleft 2015
 * @date       10/01/2014
 * @version    0.1
 * @revision   $0$
 *
 *
 * REST api de gestion de la galerie
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 require_once 'config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
 require_once("Rest.inc.php");
	
class API extends REST {

//	public $data = "";
	private $db = NULL;
	
	public function __construct(){
		parent::__construct();				// Init parent contructor
		$this->dbConnect();					// Initiate Database connection
	}
	
	/*
	 *  Connect to Database
	*/
	private function dbConnect(){
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';

        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            $response["data"] = null;
            //echoResponse(200, $response);
            exit;
        }
		
		$this->db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		$this->db->exec("SET NAMES 'utf8'");
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
			
	private function loadExposition(){
		$query = "SELECT idToile, path, titre, path_thumb, hauteur, largeur, tx_vibratoire, prix, mur, date_creation"
				. " FROM t_toile"
				. " ORDER BY mur, idToile";
		
       try {
          $stmt = $this->db->prepare($query);
          $stmt->execute( array() );
          $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
          if( count($rows) > 0 ){
            $response["status"] = "success";
            $response["message"] = "Data selected from database";
         } else {
            $response["status"] = "warning";
            $response["message"] = "No data found.";
         }
          $response["result"] = $rows;
        } catch(PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' . $e->getMessage();
            $response["result"] = null;
        }

		return $response;
	}
			
	private function listToiles(){
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}

 		$this->response( json_encode($this->loadExposition()), 200 );
   }
   
	private function sauveExposition(){
		$listToiles = $this->loadExposition();
		$result = array();
		
		foreach( $listToiles["result"] as $toile ) {
			$mur = $toile['mur'];
			if( !isset( $result[$mur] ) ) {
				$result[$mur] = array( "libelle" => $mur, "toiles" => array() );
			}
			$result[$mur]["toiles"][] = $toile;
		}
//		$this->response( json_encode( array( "walls" => array_values($result) ) ), 200 );
		file_put_contents( "../../data/galerie.json", json_encode( array( "walls" => array_values($result) ) ) . PHP_EOL);
   }
   
	private function toile(){
		if($this->get_request_method() != "GET"){
			$this->response('',406);
		}
		$id = $_GET['id'];
		if($id > 0){
			$query="SELECT idToile, path, titre, path_thumb, hauteur, largeur, tx_vibratoire, prix, date_creation"
				. " FROM t_toile"
				. " WHERE idToile = ?";
			try {
			  $stmt = $this->db->prepare($query);
			  $stmt->execute( array( $id ) );
			  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
			  if( count($rows) > 0 ){
				$response["status"] = "success";
				$response["message"] = "Data selected from database";
			 } else {
				$response["status"] = "warning";
				$response["message"] = "No data found.";
			 }
			  $response["result"] = $rows;
			} catch(PDOException $e) {
				$response["status"] = "error";
				$response["message"] = 'Select Failed: ' . $e->getMessage();
				$response["result"] = null;
			}
			
			$this->response( json_encode($response), 200 );
		
		}
		
		$this->response('',204);	// If no records "No Content" status
	}
	
	private function updateToile(){
		if($this->get_request_method() != "POST"){
			$this->response('',406);
		}
		$param = json_decode(file_get_contents("php://input"),true);
		$id = (int)$param['id'];
		$toile = $param['toile'];
		$query = "UPDATE t_toile "
				. " SET titre = ?, hauteur = ?, largeur = ?, prix = ?, tx_vibratoire = ?"
				. " WHERE idToile = ?";
		try {
		  $stmt = $this->db->prepare($query);
		  $response["result"] = $stmt->execute( array( $toile['titre'], $toile['hauteur'], $toile['largeur'], $toile['prix'], $toile['tx_vibratoire'], $id ) );

		  if( $response["result"] ){
			$response["status"] = "success";
			$response["message"] = "Données Modifiées";
		 } else {
			$response["status"] = "warning";
			$response["message"] = "No data found.";
		 }

		 } catch(PDOException $e) {
			$response["status"] = "error";
			$response["message"] = 'Select Failed: ' . $e->getMessage();
			$response["result"] = null;
		}
		$this->sauveExposition();
		$this->response( json_encode($response), 200 );
	}
}

// Initiiate Library
$api = new API;
$api->processApi();

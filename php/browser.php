<?php
session_name("cirrus");
session_start();

$reponse["success"] = isset($_SESSION['login'], $_SESSION['pass'], $_SESSION['home']);

function getDirectory( $path = '.', $level = 0, $pathComplet = '.'){

    // Directories to ignore when listing output. Many hosts
    // will deny PHP access to the cgi-bin.
    $ignore = array( 'cgi-bin', '.', '..' );

     // Open the directory to the handle $dh
   $dh = @opendir( $path );
    
	// 
	$arrPath = explode( '/', $pathComplet);

	$arbreRep = array();
    while( false !== ( $file = readdir( $dh ) ) ){
    // Loop through the directory
		
        if( !in_array( $file, $ignore ) ){
        // Check that this file is not to be ignored
            $branche = array(
						"nom"=>$file,
						"isDir"=>( is_dir( "$path/$file" ) ),
						"rep"=>null
							);
            
            if( $branche["isDir"] == true ){
            // Its a directory, so we need to keep reading down...
				if( $level < count( $arrPath ) ) {
					if( $file == $arrPath[$level] ) {
						 // Re-call this same function but on a new directory.
						// this is what makes function recursive.
						$branche["rep"] = getDirectory( "$path/$file", ($level+1), $pathComplet );
						$level++;
					}
				}
            }
			
			$arbreRep[] = $branche;
        }
    
    }
    
    closedir( $dh );
    // Close the directory handle
	return $arbreRep;
}

$homeDir = isset( $_SESSION['home'] ) ? $_SESSION['home'] : "";

$rootDir = "../Disk";
chdir( $rootDir );

$path = isset( $_REQUEST["path"] ) ? $_REQUEST["path"] : "~";
$path = str_replace('~', "Users$homeDir", $path);
$path = ltrim ($path, '/');

$arbrePath = getDirectory( isset( $_REQUEST["root"] ) ? '.' : $path, 0, $path );
//$arbrePath = getDirectory( $path, 0, $path );

// return response to client
header("Content-Type: application/json");
echo htmlspecialchars_decode( json_encode( array("result" => $arbrePath, "path" => $_REQUEST["path"] . " -> " . $path) ), ENT_QUOTES );
// eof
?>

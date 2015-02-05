/**
 * wp.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012
 * @date       23/01/1012
 * @version    0.1
 * @revision   $2$
 *
 * @date   revision   marc laville  21/02/2012 : secoue le panneau en cas d'erreur d'authentification (class "secoue")
 * @date   revision   marc laville  22/02/2012 : horloge
 * @date   revision   marc laville  18/01/2015 : Formalisation du codage
 *
 * A faire
 * - extraire le login utilisateur
 */
 
/*
 * Gestion du login utilisateur
 */
function connecte(e) {
	var formElement = document.getElementById("form_log"),
		ctrlLogin = function(unForm) { return $(unForm).serialize(); },
		data = ctrlLogin( formElement ),
		tabState = ["non initialisé", "connexion établie", "requête reçue", "réponse en cours", "terminé" ];
	
	if( data != null ){
		var oXHR = new XMLHttpRequest(),
			p_msg = document.getElementById("p_msgConnexion");
		
		formElement.parentNode.classList.remove("secoue");  
		oXHR.onreadystatechange=function() {
		
			p_msg.innerHTML = tabState[oXHR.readyState] + " : " + oXHR.status;
			
			if( oXHR.readyState == 4 && oXHR.status == 200 ) {
				var resp = JSON.parse(oXHR.responseText);
				
				p_msg.innerHTML = "";
				if(resp.success) {
					formElement.parentNode.style.display = "none";
					document.getElementById("workSpace").style.display = "block";
					initApp() 
				} else {
					// erreur d'authentification
					formElement.parentNode.classList.add("secoue");  
					document.getElementById("div_erreur").style.display = "block";
					formElement.style.visibility = "hidden";
				}
			}
			
			return false;
		}
		oXHR.open("POST", "./php/login.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send( data );
	}
	
	return false;
}

function deconnecte() {
	var formElement = document.getElementById("form_log");
	
	formElement.parentNode.style.display = "block";
	document.getElementById("workSpace").style.display = "none";
	
	return false;
}

function initApp () {
	var ulDock = document.getElementById('dock').getElementsByTagName('ul')[0],
		icons = $("#dock ul li");
	
	icons.dblclick(function(){
		lanceApp(this.id);
	});
	
	/* Affichage du menu cirrus */
//	document.getElementById("workSpace").appendChild( app_cirrus.construitMenu() );

	app_postit.init( ulDock );
	app_edit.init( ulDock );
	app_cirrus.init( ulDock );

	horloge();
	
//	app_cirrus.listFicBureau("");
	
//	document.getElementById("workSpace").appendChild( app_cirrus.construitBrowser() );
	
	window.onbeforeunload = function() {

		if( document.getElementById("workSpace").style.display != "none" ) {
			app_postit.sauvListPostIt();
		}
	};
	return;
}

document.onreadystatechange = function() {
	if (document.readyState == "complete") {
	
		var ulListLog = document.getElementById("ul_listLog"),
			listLog = ulListLog.querySelectorAll("li a"),
			formLog = document.forms['form_log'];
			
		for (var i = listLog.length - 1 ; i >= 0 ; i--) {

			listLog[i].addEventListener("click", function(){
				
				formLog.input_user.value = this.querySelector("output").value;
				document.getElementById("img_log").src = this.querySelector("img").src;
				
				ulListLog.style.display = 'none';
				formLog.style.display = 'block';
				formLog.password.focus();
			}, false);
		}
				
		document.getElementById("btn_connect").addEventListener("click", connecte, false);
		document.getElementById("btn_connect_win").addEventListener("click", connecte, false);
		
		document.getElementById("btn_annule").addEventListener("click", 
			function(){
				formLog.style.display = 'none';
				ulListLog.style.display = 'block';
			},
			false);
		
		document.getElementById("btn_ok").addEventListener("click", 
			function(){
				document.getElementById("div_erreur").style.display = "none";
				ulListLog.style.display = 'block';
				formLog.style.display = 'none';
			},
			false);
	}
	
	return;
}
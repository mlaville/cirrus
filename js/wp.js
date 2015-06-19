/**
 * wp.js
 * 
 * @auteur     marc laville
 * @Copyleft 2012-2015
 * @date       23/01/1012
 * @version    0.2
 * @revision   $5$
 *
 * @date   revision   marc laville  21/02/2012 : secoue le panneau en cas d'erreur d'authentification (class "secoue")
 * @date   revision   marc laville  22/02/2012 : horloge
 * @date   revision   marc laville  18/01/2015 : Formalisation du codage
 * @date   revision   marc laville  14/05/2015 : Réécrire suivant le module pattern
 * @date   revision   marc laville  16/05/2015 : Chargement dynamique de la liste des utilisateurs
 *
 * A faire
 * - extraire le login utilisateur
 */
 
/*
 * Gestion du login utilisateur
 */
function initApp () {
	var ulDock = document.getElementById('dock').getElementsByTagName('ul')[0],
		icons = $("#dock ul li");
	
	icons.dblclick(function(){
		app_cirrus.lanceApp(this.id);
	});
	
	/* Affichage du menu cirrus */

	app_postit.init( ulDock );
	app_edit.init( ulDock );
	app_cirrus.init( ulDock );

	horloge();

	window.onbeforeunload = function() {

		if( document.getElementById("workSpace").style.display != "none" ) {
			app_postit.sauvListPostIt();
		}
	};
	return;
}

var loginManager = ( function ( formLogin, ulListLog, funcInit ) {
	var	tabState = ["non initialisé", "connexion établie", "requête reçue", "réponse en cours", "terminé" ],
		usersXHR = new XMLHttpRequest(),
		templateUser = '<li>'
					+ '<a href="#">'
					+ '<figure><img src="{{img}}" alt=""></figure>'
					+ '<output>{{user}}</output>'
					+ '</a>'
					+ '</li>',
		connecte = function(e) {
			var data = new FormData(formLogin);
		
			if( data != null ) {
				var oXHR = new XMLHttpRequest(),
					p_msg = document.getElementById("p_msgConnexion");
				
				formLogin.parentNode.classList.remove("secoue");  
				oXHR.onreadystatechange=function() {
				
					p_msg.innerHTML = tabState[oXHR.readyState] + " : " + oXHR.status;
					
					if( oXHR.readyState == 4 && oXHR.status == 200 ) {
						var resp = JSON.parse(oXHR.responseText);
						
						p_msg.innerHTML = "";
						if(resp.success) {
							formLogin.parentNode.style.display = "none";
							document.getElementById("workSpace").style.display = "block";
							funcInit();
						} else {
							// erreur d'authentification
							formLogin.parentNode.classList.add("secoue");  
							formLogin.btn_ok.parentNode.style.display = "block";
						}
					}
					
					return false;
				}
				oXHR.open("POST", "./php/login.php");  
				oXHR.send( data );
			}
			
			return false;
		},
		deconnecte = function(e) {
		
			formLogin.parentNode.style.display = "block";
			document.getElementById("workSpace").style.display = "none";
			
			return false;
		},
		liUser = function( user ) {
			var liUser = templateUser.render(user).toElement();
			
			liUser.firstElementChild.addEventListener("click", function(){
				
				formLogin.input_user.value = this.querySelector("output").value;
				document.getElementById("img_log").src = this.querySelector("img").src;
				
				ulListLog.style.display = 'none';
				formLogin.style.display = 'block';
				formLogin.password.focus();
			}, false);

			return ulListLog.appendChild( liUser );
		},
		afficheListUser = function( data ) {
			return data.users.forEach(liUser);
		}
		
	/**
	  * Chargement dynamique des utilisateurs
	  */
	usersXHR.onreadystatechange = function() {
		if( usersXHR.readyState == 4 && usersXHR.status == 200 ) {
			afficheListUser( JSON.parse(usersXHR.responseText) );
		}
		
		return false;
	};
	usersXHR.open("GET", "./Disk/users.json");
	usersXHR.send( null );

	formLogin.btn_connect.addEventListener("click", connecte, false);
	formLogin.btn_connect_win.addEventListener("click", connecte, false);
	

	formLogin.password.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			formLogin.btn_connect_win.click();
		}
		return;
	});
	
	formLogin.btn_annule.addEventListener("click", 
		function(){
			formLogin.style.display = 'none';
			ulListLog.style.display = 'block';
		},
		false);
	
	formLogin.btn_ok.addEventListener("click", 
		function(){
			formLogin.parentNode.classList.remove("secoue");  
			formLogin.btn_ok.parentNode.style.display = "none";
			
			return formLogin.password.focus();
		},
		false);

	return {
		deconnecte: deconnecte
	};
}( document.getElementById("form_log"), document.getElementById("ul_listLog"), initApp ) );

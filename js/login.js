function ctrlLogin(unForm) {

	return "userName=toto";
}

function connecte() {

	alert("connect");
	
	var formElement = document.getElementById("form_log");  
//	var data = new FormData(formElement);
	var data = ctrlLogin(formElement);
	if( data != null ){
		var oXHR = new XMLHttpRequest();
		
		oXHR.onreadystatechange=function() {
			if (oXHR.readyState==4 && oXHR.status==200) {
	//			document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
				alert(oXHR.responseText);
			}
		}
		oXHR.open("POST", "./php/login.php");  
		oXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
		oXHR.send("userName=toto");
	}
	return false;
}

function initApp () {
	document.getElementById("form_log").addEventListener("submit", connecte, false);
	
	return;
}

document.onreadystatechange = function() {
	if (document.readyState == "complete") {
		initApp() 
	}
	
	return;
}

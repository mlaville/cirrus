<?php
// laissons le salt initialis� par PHP
$password = crypt('amandine');

/*
  Il vaut mieux passer le r�sultat complet de crypt() comme salt n�cessaire
  pour le chiffrement du mot de passe, pour �viter les probl�mes entre les
  algorithmes utilis�s (comme nous le disons ci-dessus, le chiffrement
  standard DES utilise un salt de 2 caract�res, mais un chiffrement
  MD5 utilise un salt de 12).
  
if (crypt($user_input, $password) == $password) {
   echo "Mot de passe correct !";
}
*/

echo $password;
?>

<?php
// laissons le salt initialisé par PHP
$password = crypt('amandine');

/*
  Il vaut mieux passer le résultat complet de crypt() comme salt nécessaire
  pour le chiffrement du mot de passe, pour éviter les problèmes entre les
  algorithmes utilisés (comme nous le disons ci-dessus, le chiffrement
  standard DES utilise un salt de 2 caractères, mais un chiffrement
  MD5 utilise un salt de 12).
  
if (crypt($user_input, $password) == $password) {
   echo "Mot de passe correct !";
}
*/

echo $password;
?>

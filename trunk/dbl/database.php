<?php

	$con = mysql_connect(DB_HOST,DB_USER,DB_PASSWORD); 
	
	if (!$con) { 
		die('Could not connect to MySQL: ' . mysql_error()); 
	} 

	mysql_select_db(DB_NAME, $con);
			


?>
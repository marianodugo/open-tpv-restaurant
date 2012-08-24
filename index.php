<?php
require_once 'header.php';
?>

	<body>
		<div id="info"></div>
		<div id="main" style="">
			<?php
			require_once 'main.php';
			?>
		</div><!-- main -->			
		<div id="admin" style="display:none;">
			<?php
			require_once 'admin.php';
			?>
		</div><!-- admin -->			

<?php
require_once 'bottom.php';
?>
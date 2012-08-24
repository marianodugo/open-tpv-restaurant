<?php
	require_once('config.php');
	require_once(ABSPATH . 'dbl/database.php');
	
	 $function = $_GET['function'];

	switch ($function) {
		case 'getCategories':
			getCategories();
			break;
		case 'getCategory':
			getCategory($_GET['idcat']);
			break;
		case "getItemsByCat":
			$idcat = $_GET['idcat'];
			$orderby = $_GET['orderby'];
			getItemsByCat($idcat, $orderby);
			break;
		default:
			
			break;
	}

	function getCategories() {
		require_once(ABSPATH . 'dbl/categories.php');
		$cats = new Categories;
		$cats->get_Categories();
	}

	function getCategory($idcat) {
		require_once(ABSPATH . 'dbl/categories.php');
		$cat = new Categories;
		$cat->get_Category($idcat);
	}
	function getItemsByCat($idcat, $orderby) {
		require_once(ABSPATH . 'dbl/products.php');
		$items = new Products;
		$items->get_ProductsByCategory($idcat,$orderby);
	}

?>
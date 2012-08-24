<?php

/**
 * Definimos las clases de datos
 */

class Product {
		
	var $idproduct=0;
	var $name='';
	var $image='';
	var $btncolor='';
	var $purchaseprice=0; 
	var $sellingprice=0;
	
	public function loadByRowData($row) {
		$this->idproduct=$row['idproduct'];
		$this->name=$row['name'];
		$this->image=$row['image'];
		$this->btncolor=$row['btncolor'];
		$this->purchaseprice=$row['purchaseprice'];
		$this->sellingprice=$row['sellingprice'];
	}
	
}

class CatProduct extends Product {
		
	var $idcatproduct=0;
	var $idcat=0;
	var $position=0;
	
	public function loadByRowData($row) {
		$this->idcatproduct=$row['idcatproduct'];
		$this->idproduct=$row['idproduct'];
		$this->name=$row['name'];
		$this->image=$row['image'];
		$this->btncolor=$row['btncolor'];
		$this->purchaseprice=$row['purchaseprice'];
		$this->sellingprice=$row['sellingprice'];
		
	}
}

/**
 * 
 */
class Products {
	
	/**
	 * Obtiene todas los items
	 *
	 * @return array
	 * @author  
	 */
	public function get_Products() {

		$allitems = array();
		$result = mysql_query("SELECT * FROM " . TABLE_PREFIX . "products order by name");
		
		while($row = mysql_fetch_array($result))
		{
			$tmp = new Product;
			$tmp->loadByRowData($row);
		
			$allitems[$tmp->idproduct]=$tmp;
		}
		
		echo json_encode($allitems);

	}

	/**
	 * Obtiene todas los items de una categoria
	 *
	 * @return array
	 * @author  
	 */
	public function get_ProductsByCategory($cat,$orderby) {

		$allitems = array();
		$sql = 'select *'
        . ' from ' . TABLE_PREFIX . 'products p'
        . ' inner join ' . TABLE_PREFIX . 'cat_products cp'
        . ' on p.idproduct=cp.idproduct'
        . ' where idcat=' . $cat
		. ' order by ' . $orderby;
        
		$result = mysql_query($sql);
		
		while($row = mysql_fetch_array($result))
		{
			$tmp = new CatProduct;
			$tmp->loadByRowData($row);
			
			$allitems[$tmp->idcatproduct]=$tmp;
		}
		
		echo json_encode($allitems);

	}
		
}
?>
<?php


/**
 * 
 */
class Category {
		
	var $idcat=0;
	var $name='';
	var $image='';
	var $btncolor='';
	var $orderby='';
	var $position=0;
	
	public function loadByRowData($row) {
		$this->idcat=$row['idcat'];
		$this->name=$row['name'];
		$this->image=$row['image'];
		$this->btncolor=$row['btncolor'];
		$this->orderby=$row['orderby'];
		$this->position=$row['position'];
	}
	
	public function loadJSONData($data) {
		$temp=json_decode($data);
		$this->idcat=$temp->idcat;
		$this->name=$temp->name;
		$this->image=$temp->image;
		$this->btncolor=$temp->btncolor;
		$this->orderby=$temp->orderby;
		$this->position=$temp->position;
	}
}


/**
 * 
 *  @author  Oscar Badiola
 *  */
class Categories {
	
	/**
	 * Obtiene todas las categorias
	 *
	 * @return array
	 * @author  Oscar Badiola
	 */
	public function get_Categories() {

		$allcat = array();
		$result = mysql_query("SELECT * FROM " . TABLE_PREFIX . "categories order by position");
		
		while($row = mysql_fetch_array($result))
		{
			$tmp = new Category;
			$tmp->loadByRowData($row);
			
			$allcat[$tmp->idcat]=$tmp;
		}
		
		echo json_encode($allcat);

	}
	
		/**
	 * Obtiene todas las categorias
	 *
	 * @return array
	 * @author  
	 */
	public function get_Category($idcat) {
		$tmp = new Category;
		$result = mysql_query("SELECT * FROM " . TABLE_PREFIX . "categories where idcat=". $idcat ." order by position");
		
		while($row = mysql_fetch_array($result))
		{
			$tmp->loadByRowData($row);
		}
		
		echo json_encode($tmp);

	}

}
?>
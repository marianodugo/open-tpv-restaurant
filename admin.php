<?php
require_once 'header.php';
?>

	<body>
			<div id="admin_categories">
				<div id="list_categories" class="well list" style="margin:10px;">
					<ul  class="">
						<li><a class="btn btn-inverse btn-small" href="#" onclick="editCategory(1);">Editar</a> Refrescos</li>
					</ul>
				</div><!-- list_categories -->
				
				<div id="edit_category"  class="modal hide" >
					<form id="form_edit_category" class="well form-horizontal" style="margin:10px;">
						<fieldset>
							<input type="hidden" id="idcat"/>
							<div class="control-group">
			 					<label  class="control-label" for="name">Nombre:</label>
			 					<div class="controls">
									<input id="name" type="input" class="input-xlarge" placeholder="Escribir nombre de la categoria…">
								</div>
							</div>
							<div class="control-group">
			 					<label  class="control-label" for="name">Imagen:</label>
			 					<div class="controls">
									<input id="image" type="hidden">
									<a href="#" onclick="$('#images').modal();"><img id="image_img"></a>
								</div>
							</div>
							<div class="control-group">
			 					<label  class="control-label" for="name">Color del bot&oacute;n:</label>
			 					<div class="controls">
									<input id="btncolor" type="input" class="input-xlarge color {hash:true}" placeholder="Pulsa para seleccionar el color">
								</div>
							</div>
							<div class="control-group">
								<label for="orderby" class="control-label">Ordernar por:</label>
					            <div class="controls">
									<select id="orderby">
										<option>name</option>
										<option>position</option>
									</select>
					            </div>
							</div>         
						</fieldset>
					</form>
				</div><!-- edit_category -->
			</div><!-- admin_categories -->
	<div id="images" class="modal hide">
		<?php 
			$dirname = "img/prods"; 
			$images = scandir($dirname); 
			foreach($images as $curimg){ 
  				echo "<a href='#' onclick='selectedImage(\"$curimg\")'><img style='width: 150px;height:80px;' src='img/prods/$curimg'></a>\n"; 
			}; 
?> 
	</div>
<?php
require_once 'bottom.php';
?>


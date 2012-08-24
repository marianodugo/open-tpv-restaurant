
//=============================Global ===================================

	function showInfo(text) {
		div="";
		div+="<div class=\"alert alert-success\" style=\"width:300px; margin-left:auto; margin-right:auto;\">";
		div+=text + "</div>";
		$("#info").html(div);
		$("#info").slideDown().animate({opacity: 1.0},2000).slideUp();
	}

	function showError(text) {
		div="";
		div+="<div class=\"alert alert-error\" style=\"width:300px; margin-left:auto; margin-right:auto;\">";
		div+=text + "</div>";
		$("#info").html(div);
		$("#info").slideDown().animate({opacity: 1.0},2000).slideUp();
	}

	_categories="";

	function loadCategories() {
		$.ajax ({
			data: "function=getCategories", 
			type: "GET", 
			dataType: "json", 
			url: "json.php", 
			success: function(data){ 
				_categories=data;
				updateMainCategories(data);
				updateListCategories(data);
			}
		});
		
	}
	
		function test() {
		$.ajax ({
			data: "function=test", 
			type: "GET", 
			dataType: "json", 
			url: "json.php", 
			success: function(data){ 
				_test=data;
			}
		});
		
	}
//============================= Main Page =================================

	function showProduct(idcat) {
		$(".div_prod:visible").hide();
		$("#div_cat_"+idcat).show();
	}

	//obtenemos las categorias existentes para la pantalla principal
	function updateMainCategories (data) {
	  
				$("#tab_cat").html("");
				$.each(data,function(index,value) {
					div="";
					div+="<a href=\"#\" onclick=\"showProduct(" + value.idcat + ")\"><div class=\"btn_main btn_cat\"";
					if (value.btncolor!="") { div+=" style=\"background-color:" + value.btncolor +";\""; }
					div+="><img src=\"img/prods/";
					if (value.image!="") {
						 div+= value.image 
					} else {
						div+= "pix.png";
					}
					div+="\">";
					div+= value.name
					div+= "</div></a>";
					$("#tab_cat").append(div);
					
					div="";
					div+="<div id=\"div_cat_" + value.idcat + "\" style=\"display:none\" class=\"div_prod\">"
					updateMainItemsByCategories(value.idcat, value.orderby);
					div+="</div>";
					$("#content_cat").append(div);
				 });
	}

	//obtenemos items de las categorias para la pantalla principal
	function updateMainItemsByCategories (cat, orderby) {
	  
		$.ajax ({
			data: "function=getItemsByCat&idcat=" + cat +"&orderby=" + orderby, 
			type: "GET", 
			dataType: "json", 
			url: "json.php", 
			success: function(data){ 
				$("#div_cat_" + cat).html("");
				$.each(data,function(index,value) {
					div="";
					div+="<a href=\"#\" onclick=\"\"><div class=\"btn_main btn_prod\""
					if (value.btncolor!="") { div+=" style=\"background-color:" + value.btncolor +";\"" }
					div+="><img src=\"img/prods/";
					if (value.image!="") {
						 div+= value.image 
					} else {
						div+= "pix.png";
					}
					div+="\">";
					div+=value.idcatproduct +"- " + value.name + "</div></a>"
					$("#div_cat_" + cat).append(div);
				 });
				  	
			}
		});
	  
	}



//======================================Admin page ==============================
//===============================================================================

	function updateListCategories (data) {
				$("#list_categories ul").html("");
				//$("#list_categories ul").html("<li class=\"\">Categorias</li>");
				$.each(data,function(index,value) {
					div="";
					div+="<li><a class=\"btn btn-inverse btn-small\" href=\"#\" onclick=\"editCategory(" + value.idcat + ");\">Editar</a>"
					div+= value.name + "</li>";
					$("#list_categories ul").append(div);

				 });
				 //$("#list_categories ul").append("<li class=\"divider\"></li>");
				 $("#list_categories ul").append("<li><a href=\"#\" onclick=\"editCategory(0)\">Añadir nueva...</a></li>");
	}

	function editCategory(idcat) {
//		$("#form_edit_category").formParams(_categories[idcat]);
				$("#edit_category #idcat").val(_categories[idcat].idcat);
				$("#edit_category #name").val(_categories[idcat].name);
				$("#edit_category #image").val(_categories[idcat].image);
				if(_categories[idcat].image!="") {
					$("#edit_category #image_img").attr("src","img/prods/" + _categories[idcat].image );
				}else {
					$("#edit_category #image_img").attr("src","img/prods/none.jpg");
				}
				$("#edit_category #btncolor").val(_categories[idcat].btncolor);
				$("#edit_category #btncolor").css("background-color",_categories[idcat].btncolor);
				$("#edit_category #orderby").val(_categories[idcat].orderby);
		
		
/*		$.ajax ({
			data: "function=getCategory&idcat=" + idcat, 
			type: "GET", 
			dataType: "json", 
			url: "json.php", 
			success: function(data){ 
				$("#edit_category #name").val(data.name);
				$("#edit_category #orderby").val(data.orderby);
				$('#edit_category').modal();				  	
			}
		});
*/		
				$('#edit_category').modal();	
				$('#edit_category').on('hidden', function () { document.getElementById('btncolor').color.hidePicker();	});	  	
	}

	function selectedImage(path) {
		$("#edit_category #image").val(path);
		$("#edit_category #image_img").attr("src","img/prods/" + path )
		$("#images").modal('hide')
	}
	
	
$(document).ready(function() {

	loadCategories();
	
});

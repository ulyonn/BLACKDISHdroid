//Este es el archivo principal de ejecuciones de javaScript cada script debe de ir en el orden en el que se cargan las pantallas de la aplicación
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Este es el puto primer metodo de todo, nada puede ni debe ir antes
//Esta funcion valida que si el usuario no esta logeado, no se pueda acceder al resto de las paginas
function validaLogin(){
  if (localStorage.getItem("token")==null || localStorage.getItem("token")=='undefined') {
    window.location="index.html";
  }
}

/*function dropCar(){
  localStorage.removeItem('cart');
}*/

function validaNot(){
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type: 'POST',
    data:{accion:'validaNot',
          id:localStorage.getItem("token")
    },
    success:function(resp){
      var Notf = JSON.parse(resp);
      for(var i in Notf){
        $("#notfContainer").append("<a class='black-text' href='share.html'><i class='material-icons black-text'>share</i>Compartir puntos<span class='new badge'>"+Notf[i].cont+"</span></a>");
      }
    },
    error:function(err){
      console.log(err);
    },
  });
}

function loadMensajes() {
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type: 'POST',
    data:{accion:'loadMensajes',
          id:localStorage.getItem("token")
    },
    success:function(resp){
      var Bandeja = JSON.parse(resp);
      for(var i in Bandeja){
        $("#bandejaContainer").append("<li class='collection-item avatar' id='"+Bandeja[i].idMensaje+"' onclick='leer("+Bandeja[i].idMensaje+");'><span class='title'>"+Bandeja[i].nombre+"</span><p>"+Bandeja[i].mensaje+"</p><a href='#!' class='secondary-content'><i class='material-icons'>grade</i></a></li>");
      }
    },
    error:function(err){
      console.log(err);
    },
  });
}

function leer(idMensaje){
  sessionStorage.setItem("id",idMensaje);
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type: 'POST',
    data:{accion:'leer',
          id:localStorage.getItem("token"),
          mensaje:idMensaje
    },
    success:function(resp){
      console.log(resp);
      if (resp == "true") {
        $("#2").fadeOut(600);
      }
    },
    error:function(err){
      console.log(err);
    },
  });
}

//Esta funcion carga los restaurantes
function loadRestaurantes(){
    $("#restaurantContainer").empty();
    $("#restaurantContainer").removeClass("hidden");
    $("#pillFooter").empty();
    $("#promosContainer").addClass("hidden");
    $("#topContainer").addClass("hidden");
    $("#categoriasContainer").addClass("hidden");
    $("#pillFooter").append("<div class='pill-nav' align='center'><a class='active' href='#!' onclick='loadRestaurantes();'><i class='material-icons'>restaurant</i></a><a href='#!' onclick='loadTop();'><i class='material-icons'>stars</i></a><a href='#!' onclick='loadPromos();'><i class='material-icons'>local_offer</i></a><a href='#!' onclick='loadCategorias();'><i class='material-icons'>border_all</i></a></div>");
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/RestaurantController.php',
    type: 'POST',
    data:{accion:'cargar'},
    success:function(resp){
      var Restaurantes = JSON.parse(resp);
      for(var i in Restaurantes){
        $("#restaurantContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><h5>"+Restaurantes[i].nombre+"</h5><div class='card rest'><div class='card-image waves-effect waves-block waves-light'><a href='#!' id='launcher' onclick='assignRestaurant("+Restaurantes[i].idRestaurante+");'><img src='img/imgTaqueriaPlayaTropical.png'></a></div><div class='card-tabs'><ul class='tabs tabs-fixed-width' ><li class='tab'><a href='tel:"+Restaurantes[i].telefono+"'><i class='small material-icons green-text' style='margin-top: 10px'>local_phone</i></a></li><li class='tab'><a href="+Restaurantes[i].coordenadas+"><i class='small material-icons red-text' style='margin-top: 10px'>location_on</i></a></li><li class='tab'><a href='#'><i class='small material-icons black-text' style='margin-top: 10px'>delete</i></a></li></ul></div></div></div>");
      }
    },
    error:function(err){
      console.log(err);
    },
  });

}
//Esta funcion carga los mejores 10 platillos y los ordena por calificacion
function loadTop(){
  $("#topContainer").empty();
  $("#pillFooter").empty();
  $("#restaurantContainer").addClass("hidden");
  $("#promosContainer").addClass("hidden");
  $("#categoriasContainer").addClass("hidden");
  $("#topContainer").removeClass("hidden");
  $("#pillFooter").append("<div class='pill-nav' align='center'><a href='#!' onclick='loadRestaurantes();'><i class='material-icons'>restaurant</i></a><a class='active' href='#!' onclick='loadTop();'><i class='material-icons'>stars</i></a><a href='#!' onclick='loadPromos();'><i class='material-icons'>local_offer</i></a><a href='#!' onclick='loadCategorias();'><i class='material-icons'>border_all</i></a></div>");
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/TopController.php',
    type:'POST',
    data:{accion:'cargarTop'},
    success:function(resp){
      var Tops = JSON.parse(resp);
      for(var i in Tops){
        $("#topContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><ul class='collection'><li class='collection-item avatar' id='launcher' onclick='assignRestaurant("+Tops[i].idRestaurante+");'><img src='"+Tops[i].imagen+"' alt='' class='circle'><span class='title'><b>"+Tops[i].platillo+"</b></span><p>Prepared by "+Tops[i].restaurant+"<br><br></p><p> <i class='tiny material-icons cardbtn'>grade</i>"+Tops[i].calificacion+" ("+Tops[i].votos+")</p><a href='#modal1' class='secondary-content modal-trigger'>$"+Tops[i].precio+"</a></li></ul></div>");
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}
//Esta funcion carga todas las promociones que los restaurantes suban
function loadPromos(){
  $("#promosContainer").empty();
  $("#pillFooter").empty();
  $("#restaurantContainer").addClass("hidden");
  $("#topContainer").addClass("hidden");
  $("#categoriasContainer").addClass("hidden");
  $("#promosContainer").removeClass("hidden");
  $("#pillFooter").append("<div class='pill-nav' align='center'><a href='#!' onclick='loadRestaurantes();'><i class='material-icons'>restaurant</i></a><a href='#!' onclick='loadTop();'><i class='material-icons'>stars</i></a><a class='active' href='#!' onclick='loadPromos();'><i class='material-icons'>local_offer</i></a><a href='#!' onclick='loadCategorias();'><i class='material-icons'>border_all</i></a></div>");
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PromocionesController.php',
    type:'POST',
    data:{accion:'cargarPromociones'},
    success:function(resp){
      var Promos = JSON.parse(resp);
      var promoClass = "";
      var onclick ="";
      for(var i in Promos){
        if(i>0){
          if (Promos[i].idRestaurante == Promos[i-1].idRestaurante) {
            if (parseInt(Promos[i].costo)>parseInt(localStorage.getItem("puntosUser"))) {
               promoClass="blurImg";
               onclick="";
            }
            else {
              promoClass="";
              onclick="onclick";
            }
            $("#rest"+Promos[i].idRestaurante).append("<li class='promo'><div class='' href='#!' "+onclick+"='modalPromocion("+Promos[i].idPromocion+");'><img src='"+Promos[i].imagen+"' id='promo-pic' class='"+promoClass+"'><div class='innerNumber'><p class='costoPromocion'>"+Promos[i].costo+"</p></div></div></li>");
          }
          else {
            if (parseInt(Promos[i].costo)>parseInt(localStorage.getItem("puntosUser"))) {
               promoClass="blurImg";
               onclick="";
            }
            else {
              promoClass="";
              onclick="onclick";
            }
            $("#promosContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><div class='card horizontal'><div class='card-stacked'><div class='card-content'><h4>"+Promos[i].restaurant+"</h4></div></div></div></div>");
            $("#promosContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><ul class='hs' id='rest"+Promos[i].idRestaurante+"'><li class='promo'><div class='' href='#!' "+onclick+"='modalPromocion("+Promos[i].idPromocion+");'><img src='"+Promos[i].imagen+"' id='promo-pic' class='"+promoClass+"'><div class='innerNumber'><p class='costoPromocion'>"+Promos[i].costo+"</p></div></div></li></ul></div>");
          }
        }
        else {
          if (parseInt(Promos[i].costo)>parseInt(localStorage.getItem("puntosUser"))) {
             promoClass="blurImg";
             onclick="";
          }
          else {
            promoClass="";
            onclick="onclick";
          }
          $("#promosContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><div class='card horizontal'><div class='card-stacked'><div class='card-content'><h4>"+Promos[i].restaurant+"</h4></div></div></div></div>");
          $("#promosContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><ul class='hs' id='rest"+Promos[i].idRestaurante+"'><li class='promo'><div class='' href='#!' "+onclick+"='modalPromocion("+Promos[i].idPromocion+");'><img src='"+Promos[i].imagen+"' id='promo-pic' class='"+promoClass+"'><div class='innerNumber'><p class='costoPromocion'>"+Promos[i].costo+"</p></div></div></li></ul></div>");
        }
      }
    },
      error:function(err){
          console.log(err);
        }
  });
}
//Esta funcion pertenece a la pantalla de promociones y lo que hace es crear el modal de confirmacion
function modalPromocion(id){
  $("#promoContainer").empty();
  $("#promFooter").empty();
  $('#modalPromocion').modal('open');
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PromocionesController.php',
    type:'POST',
    data:{accion:'cargarDescripcionPromociones'},
    success:function(resp){
      // console.log(resp);
      var Descripciones = JSON.parse(resp);
      for(var i in Descripciones){
        if(Descripciones[i].idPromocion == id){
          $("#promoContainer").append("<div class='container'><table class='striped'><tr><td><h3>"+Descripciones[i].promocion+"</h3></td></tr><tr><td><p>"+Descripciones[i].descripcion+"</p></td></tr><tr><td><img style='border-radius: 20px' src='"+Descripciones[i].imagen+"' width='100%' alt=''></td></tr><tr><td><p>Prepared By "+Descripciones[i].restaurant+"</p></td></tr><tr><td><p id='points'>-"+Descripciones[i].costo+"</p></td></tr></table><div class='input-field'><input value='"+Descripciones[i].costo+"' id='costoPromocion' type='text' class='hidden'><input value='"+Descripciones[i].idPromocion+"' id='idPromocion' type='text' class='hidden'></div></div>")
          $("#promFooter").append("<div class='pill-modal' align='center'><a href='#!' onclick='canjearPromo(\""+Descripciones[i].idPromocion+"\");' class='modal-close waves-effect waves-green white-text'>Make Order</a></div>")
        }
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

function canjearPromo(id) {
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PromocionesController.php',
    type:'POST',
    data:{accion:'canjearPromo',
    id:localStorage.getItem("token"),
    costoPromocion:$('#costoPromocion').val()
  },
    success:function(resp){
      console.log(resp);
      if (resp == "true") {
        M.toast({html: 'Has canjeado la promocion', classes: 'rounded'});
        crearOrdenPromo(id);
        setTimeout(function(){
          location.reload();
        },2000);
      }
      else {
        M.toast({html: 'Ocurrio un error', classes: 'rounded'});
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

function crearOrdenPromo(id) {
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PromocionesController.php',
    type:'POST',
    data:{accion:'crearOrdenPromo',
    costoPromocion:$('#costoPromocion').val(),
    idCliente:localStorage.getItem("token"),
    idPromocion:id
  },
    success:function(resp){
      console.log(resp);
    },
    error:function(err){
      console.log(err);
    }
  });
}

/*function validaPromo(){
  var costo = document.getElementById("costoPromocion").value;
  sessionStorage.setItem("cp",costo);
  console.log("Puntos que tiene el usuario:", localStorage.getItem("puntosUser"));
  console.log("Puntos que vale la promocion:", sessionStorage.getItem("cp"));
  if (sessionStorage.getItem("cp")<localStorage.getItem("puntosUser")) {
    M.toast({html: 'Has canjeado esta promocion', classes: 'rounded'});
  }
  else {
    M.toast({html: 'No tienes suficientes puntos', classes: 'rounded'});
  }
}
*/


//Esta funcion carga todas las categorias que hay en la aplicacion
function loadCategorias(){
  $("#categoriasContainer").empty();
  $("#pillFooter").empty();
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CategoriasController.php',
    type:'POST',
    data:{accion:'cargarCategorias'},
    success:function(resp){
      $("#restaurantContainer").addClass("hidden");
      $("#topContainer").addClass("hidden");
      $("#promosContainer").addClass("hidden");
      $("#categoriasContainer").removeClass("hidden");
      $("#pillFooter").append("<div class='pill-nav' align='center'><a href='#!' onclick='loadRestaurantes();'><i class='material-icons'>restaurant</i></a><a href='#!' onclick='loadTop();'><i class='material-icons'>stars</i></a><a href='#!'onclick='loadPromos();' ><i class='material-icons'>local_offer</i></a><a class='active' href='#!' onclick='loadCategorias();'><i class='material-icons'>border_all</i></a></div>");
      var Categorias = JSON.parse(resp);
      for(var i in Categorias){
        $("#categoriasContainer").append("<div class='col l4 s6 m4'><div class='card' onclick=\"loadCategory(\'"+Categorias[i].idCategoria+"\',\'"+Categorias[i].nombre+"\',\'"+Categorias[i].imagen+"\');\"><div class='card-image waves-effect waves-block waves-light'><a class='brand-logo' href='#'><img src='img/categorias/"+Categorias[i].imagen+"'><span class='card-title'><h4>"+Categorias[i].nombre+"</h4></span></a></div></div></div>");
      }
    },
    error:function(err){
      console.log(err);
    }
  });

}
//Este metodo sirve para hacer grande la card y mostrarla como una seccion
function loadCategory(id,nombre,imagen){
  console.log(id);
  $("#fullscreenbanner").empty();
  $("#fullscreenbanner").append("<div class='card'><div class='card-image'><img src='img/categorias/"+imagen+"' class='banner'><span class='card-title fullscreentext'><b>"+nombre+"</b></span></div></div>");
  $("#fullscreenbanner").removeClass("hidden");
  $("#categoriasContainer").addClass("hidden");
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CategoriasController.php',
    type:'POST',
    data:{accion:'cargarRestaurantes',categoria:id},
    success:function(resp){
      console.log(resp);
      $("#resultContainer").empty();
      var Restaurantes = JSON.parse(resp);
      for(var i in Restaurantes){
        $("#resultContainer").append("<div class='col l6 offset-l3 s12 m8 offset-m2'><ul class='collection with-header'><li class='collection-header'><h5 class='tittle-prom'>"+Restaurantes[i].nombre+"</h5></li><li class='collection-item avatar' id='launcher' onclick='assignRestaurant("+Restaurantes[i].idRestaurante+");'><img src='img/imgPizza.jpg' class='circle'><p>Telefono: "+Restaurantes[i].telefono+"</p><p>Direccion: "+Restaurantes[i].direccion+"</p></li></ul></div>")
      }
      $("#resultContainer").removeClass("hidden");
      $("#backbutton").removeClass("hidden");
    },
    error:function(err){
      console.log(err);
    }
  });
}
//Este metodo permite regresar a la seccion de categorias
function backCategory(){
  $("#fullscreenbanner").addClass("hidden");
  $("#resultContainer").addClass("hidden");
  $("#categoriasContainer").removeClass("hidden");
  $("#backbutton").addClass("hidden");
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Seccion de carga de datos de perfil
//Esta funcion carga los datos del perfil de usuario
function loadPerfil(){
  $("#profileContainer").empty();
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/ProfileController.php',
    type:'POST',
    data:{
      accion:'cargarPerfil',
      token:localStorage.getItem("token")
    },
    success:function(resp){
      var Perfiles = JSON.parse(resp);
      for(var i in Perfiles){
        $("#profileContainer").append("<div class='row'><div class='col s12'><div class='card horizontal'><div class='card-image'><img src='img/"+Perfiles[i].profilepic+"' id='profile-pic'></div><div class='card-stacked'><div class='card-content'><h4>"+Perfiles[i].nombre+" "+Perfiles[i].apellidos+"</h4></div></div></div></div><div class='col s12'><table class='striped'><tr><td>Correo:</td><td>"+Perfiles[i].correo+"</td><td><button class='waves-effect waves-light btn-small green modal-trigger' onclick='modalEditar(id);'>Editar<i class='material-icons right'>edit</i></button></td></tr><tr><td>Telefono:</td><td>"+Perfiles[i].telefono+"</td><td></td></tr><tr><td>Direccion:</td><td>"+Perfiles[i].direccion+"</td><td></td></tr></table></div></div>");
        $("#puntosContainer").append("<li><a class='black-text' href='car.html'><i class='material-icons black-text'>shopping_cart</i></a></li><li><a class='flow-text black-text' href='#!'>"+Perfiles[i].puntosObtenidos+"</a></li>");
        localStorage.setItem("puntosUser",Perfiles[i].puntosObtenidos);
        $("#bienvenidoContainer").append("<a class='black-text' href='#!'><i class='material-icons black-text'>person</i>Bienvenido "+Perfiles[i].nombre+"</a>");
        $("#editarContainer").append("<div class='row'><h4>Editar datos usuario</h4><table class='striped'><tr><td><input value='"+Perfiles[i].correo+"' id='email' type='text'></td></tr><tr><td><input value='"+Perfiles[i].telefono+"' id='telefono' type='text'></td></tr><tr><td><input value='"+Perfiles[i].direccion+"' id='direccion' type='text'></td></tr><tr><td><input type='file' id='imagendeperfil' name=''></td><td></td></tr></table></div>");
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}
//Abre el modal para editar los Datos
function modalEditar(){
  $('#modalEditar').modal('open');
}
//Edita los datos del usuario
function editar(){
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/EditarController.php',
    type:'POST',
    data:{
      accion:'Editar',
      token:localStorage.getItem("token"),
      correo:$('#email').val(),
      telefono:$('#telefono').val(),
      direccion:$('#direccion').val(),
      //imagenperfil:$('#imagendeperfil')
    },
    success:function(resp){
      console.log(resp);
      if (resp=="true") {
        M.toast({html: 'Datos actualizados', classes: 'rounded'});
        setTimeout(function(){
        location.reload();
        },2000);
      }
      else {
        M.toast({html: 'Ocurrio un error', classes: 'rounded'});
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

//Esta funcion hace el registro de los usuarios nuevos
function register(){
  if ($('#nombre').val()==''){
    M.toast({html: 'Ingrese nombre', classes: 'rounded'});
  }
  else {
    if ($('#apellido').val()==''){
      M.toast({html: 'Ingrese apellido', classes: 'rounded'});
    }
    else {
      if ($('#username').val()==''){
        M.toast({html: 'Ingrese un usuario', classes: 'rounded'});
      }
      else {
        if ($('#password').val()==''){
          M.toast({html: 'Ingrese una contraseña', classes: 'rounded'});
        }
        else {
          if ($('#telefono').val()==''){
          M.toast({html: 'Ingrese su telefono', classes: 'rounded'});
          }
          else {
            if ($('#email').val()==''){
              M.toast({html: 'Ingrese su correo', classes: 'rounded'});
            }
            else {
              console.log("entra");
              $.ajax({
                url:'http://192.168.0.250/api-rest/controller/RegisterController.php',
                type:'POST',
                data:{
                  accion:'registerUser',
                  nombre:$('#nombre').val(),
                  apellido:$('#apellido').val(),
                  usuario:$('#username').val(),
                  password:$('#password').val(),
                  telefono:$('#telefono').val(),
                  correo:$('#email').val()
                },
                success:function(resp){
                  if (resp=="true") {
                    console.log(resp);
                    M.toast({html: 'Usuario registrado con exito', classes: 'rounded'});
                    setTimeout(function(){
                      window.location.href = 'index.html';
                    },2000);
                  }
                  else {
                    M.toast({html: 'Ocurrio un error', classes: 'rounded'});
                  }

                },
                error:function(err){
                  console.log(err);
                }
              });
            }
          }
        }
      }
    }
  }
}

function deleteDish(){
  console.log("Ya borre el platillo");
}

function loadPedidos(){
  $("#pedidosContent").empty();
  //$("#titPedidos").empty();
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PedidosController.php',
    type:'POST',
    data:{
      accion:'loadPedidos',
      id:localStorage.getItem("token")
    },
    success:function(resp){
      //console.log(resp);
      var Pedidos = JSON.parse(resp);
      for(var i in Pedidos){
        var botonera="";
        botonera="<span onclick='starmark(this)' id='1one' style='font-size:30px' class='fa fa-star checked'></span><span onclick='starmark(this)' id='2one' style='font-size:30px' class='fa fa-star'></span><span onclick='starmark(this)' id='3one' style='font-size:30px' class='fa fa-star '></span><span onclick='starmark(this)' id='4one' style='font-size:30px' class='fa fa-star'></span><span onclick='starmark(this)' id='5one' style='font-size:30px' class='fa fa-star'></span>                     <a class='btn-flat' onclick='votar("+Pedidos[i].idPlatillo+")'>Votar</a>";
        /*if(i>0){
          if (Pedidos[i].idCliente == Pedidos[i-1].idCliente) {
            $("#titPedidos").append("<h3>Pedidos anteriores de "+Pedidos[i].cliente+"</h3>");
          }
      }*/
      if (Pedidos[i].status == "v") {
        $("#pedidosContent").append("<li class='collection-item avatar' onclick='mostrarVoto("+Pedidos[i].idPlatillo+");'><img src='"+Pedidos[i].imagenPlatillos+"' class='circle'><p>"+Pedidos[i].platillo+"</p><p>"+Pedidos[i].restaurante+"</p><p>"+Pedidos[i].puntos+" puntos</p><p>"+Pedidos[i].fecha+"</p><p>Id:"+Pedidos[i].idOrden+"</p></li>");
      }
      else {
        $("#pedidosContent").append("<li class='collection-item avatar' onclick='mostrarVoto("+Pedidos[i].idPlatillo+");'><img src='"+Pedidos[i].imagenPlatillos+"' class='circle'><p>"+Pedidos[i].platillo+"</p><p>"+Pedidos[i].restaurante+"</p><p>"+Pedidos[i].puntos+" puntos</p><p>"+Pedidos[i].fecha+"</p><p>Id:"+Pedidos[i].idOrden+"</p></li><li class='collection-item hidden child' id='"+Pedidos[i].idPlatillo+"'>"+botonera+"</li><div class='input-field'><input value='"+Pedidos[i].idOrden+"' id='idPedido' type='text' class='hidden'></div>");
      }

    }

    },
    error:function(err){
      console.log(err);
    }
  });
}

function loadPrev(){
  $("#promosContent").empty();
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PedidosController.php',
    type:'POST',
    data:{
      accion:'loadPrev',
      id:localStorage.getItem("token")
    },
    success:function(resp){
      //console.log(resp);
      var Prev = JSON.parse(resp);
      for(var i in Prev){
        /*if(i>0){
          if (Prev[i].idCliente == Prev[i-i].idCliente) {
            $("#titPromos").append("<h3>Promos canjeadas de "+Prev[i].cliente+"</h3>");
          }
      }*/
      //$("#titPromos").append("<h3>Promos canjeadas de "+Prev[i].cliente+"</h3>");
      $("#promosContent").append("<li class='collection-item avatar'><img src='"+Prev[i].imagen+"' class='circle'><p>"+Prev[i].promocion+"</p><p>"+Prev[i].restaurante+"</p><p>"+Prev[i].valor+" puntos</p><p>"+Prev[i].fecha+"</p><p>Id:"+Prev[i].idOrdenProm+"</p></li>");
    }

    },
    error:function(err){
      console.log(err);
    }
  });
}

function mostrarVoto(id) {
  console.log(id);
  $('.child').addClass("hidden");
  $("#"+id).removeClass("hidden");
}

/*function ocultarInfoTaller(id){
  $("#"+id).addClass("hidden");
}*/

function starmark(item){
  count=item.id[0];
  sessionStorage.setItem('starRating', count);
  var subid= item.id.substring(1);
  for(var i=0;i<5;i++){
    if(i<count){
      document.getElementById((i+1)+subid).style.color="orange";
    }
    else{
      document.getElementById((i+1)+subid).style.color="black";
    }
  }
}

function votar(id){
  //alert("El voto que le dieron al platillo fue:" + sessionStorage.getItem('starRating'));
  /*setTimeout(function(){
    location.reload();
  },2000);*/
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/PedidosController.php',
    type:'POST',
    data:{
      accion:'votar',
      idPedido:$('#idPedido').val(),
      voto:sessionStorage.getItem('starRating'),
      idPlatillo:id,
      id:localStorage.getItem('token')
    },
    success:function(resp){
      console.log(resp);
      if (resp == "true") {
        setTimeout(function(){
          location.reload();
        },2000);
      }
      else {
        M.toast({html: 'Ocurrio un error', classes: 'rounded'});
      }

    },
    error:function(err){
      console.log(err);
    }
  });
}



function updateCal() {


}

//Esta funcion manda una solicitud para buscar otro usuario y poder mandarle puntos
function search(){
  $("#busquedaContainer").empty();
  if ($('#busqueda').val()==''){
    M.toast({html: 'Ingrese un nombre', classes: 'rounded'});
  }
  else {
    $.ajax({
      url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
      type:'POST',
      data:{
        accion:'buscar',
        busqueda:$('#busqueda').val()
      },
      success:function(resp){
        console.log(resp);
        if (resp!=null || resp!='undefined') {
          var Resultados = JSON.parse(resp);
          for(var i in Resultados){
            $("#busquedaContainer").append("<div class='col l12 s12 m8'><ul class='collection'><li class='collection-item avatar' onclick='modalCompartir("+Resultados[i].idCliente+");'><img src='img/"+Resultados[i].profilepic+"' alt='' class='circle'><span class='title'><b>"+Resultados[i].nombre+"</b></span><a href='#!' class='secondary-content modal-trigger'></a></li></ul></div>");
          }
        }
        else {
          $("#busquedaContainer").append("<h3>No se encontraron coincidencias</h3>");
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }

}

//Esta funcion abre un modal para elegir la cantidad de puntos que se van a enviar
function modalCompartir(idCliente){
  $("#compartirContainer").empty();
  $("#compartirFooter").empty();
  $("#modalCompartir").modal('open');
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type:'POST',
    data:{accion:'descClient',
          idCliente:idCliente
          },
    success:function(resp){
      console.log(resp);
      var Client = JSON.parse(resp);
      for(var i in Client){
        if(Client[i].idCliente == idCliente){
          $("#compartirContainer").append("<div class='row'><h3>Enviar puntos</h3><img src='img/"+Client[i].profilepic+"' alt='' class='circle'><span><b>"+Client[i].nombre+"</b></span><div class='input-field col s12'><i class='material-icons prefix' id='icon____'>share</i><input id='puntosEnviados' type='text' class=''><label for='icon_prefix'>Puntos que quieres enviar</label></div><div class='input-field col s12'><i class='material-icons prefix' id='icon____'>message</i><input id='mensaje' type='text' data-length='55' class=''><label for='icon_prefix'>Agrega un mensaje</label></div><div class='input-field'><input value='"+Client[i].idCliente+"' id='idCliente' type='text' class='hidden'></div> </div>");
          $("#compartirFooter").append("<a href='#!' class='modal-close waves-effect waves-green btn-flat'>Cancelar</a><a href='#!' class='waves-effect waves-green btn-flat' onclick='validaPuntos();'>Enviar</a>")
        }
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

/*function validaPuntos(){
  var p = document.getElementById("puntosEnviados").value;
  sessionStorage.setItem("pe",p);
  var r;
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type:'POST',
    data:{
      accion:'comprobar',
      id:localStorage.getItem("token"),
    },
    success:function(resp){
      console.log(resp);
      sessionStorage.setItem("r",resp);
      if (parseInt(sessionStorage.getItem("r"))>= parseInt(sessionStorage.getItem("pe"))) {
        enviarPuntos();
      }
      else {
        M.toast({html: 'No tienes puntos suficientes', classes: 'rounded'});
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}*/

function validaPuntos(){
  var p = document.getElementById("puntosEnviados").value;
  sessionStorage.setItem("pe",p);
  if ((localStorage.getItem("puntosUser"))>=(sessionStorage.getItem("pe"))) {
    enviarPuntos();
  }
  else {
    M.toast({html: 'No tienes puntos suficientes', classes: 'rounded'});
  }
}

function enviarPuntos(){
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CompartirController.php',
    type:'POST',
    data:{accion:'enviarPuntos',
    id:localStorage.getItem("token"),
    idCliente:$('#idCliente').val(),
    puntosEnviados:$('#puntosEnviados').val(),
    mensaje:$('#mensaje').val()
  },
    success:function(resp){
      console.log(resp);
      if (resp == "true") {
        M.toast({html: 'Se han enviado los puntos', classes: 'rounded'});
        setTimeout(function(){
        location.reload();
        },2000);
      }
      else {
        M.toast({html: 'Ocurrio un error', classes: 'rounded'});
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Seccion de carga del carrito de compras
function loadCarrito(){
  var Cart = JSON.parse(localStorage.getItem("cart"))
  for (var i in Cart){
    id = Cart[i].id;
    cant = Cart[i].quantity;
  }
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/CarController.php',
    type:'POST',
    data:{
      accion:'loadCar',
      id:id,
      cantidad:cant
    },
    success:function(resp){
      var Items = JSON.parse(resp);
      for(var i in Items){
          $("#tituloCar").append("<span><b>YOUR CART IN</b></span><br><span>"+Items[i].restaurante+"</span>")
          $("#carContent").append("<li class='collection-item avatar' onclick='deleteDish();'><img src='"+Items[i].imagenPlatillos+"' alt='' class='circle'><i class='small material-icons white delete'>do_not_disturb_on</i><span class='title'><b>"+Items[i].platillo+"</b></span><p>+"+Items[i].puntos+" pts</p><span class='secondary-content'>$"+Items[i].total+"</span></li>");
          $("#addContent").append("<li class='collection-item avatar' onclick='assignRestaurant();'><img src='img/car.png' alt='' class='circle'><i class='small material-icons white add'>add_circle</i><span class='title'><br><b>Add more dishes</b></span></li>");
          $("#cost").append("<h6>$300</h6>")
      }
    },
    error:function(err){
      console.log(err);
    }
  });

  //var Items = JSON.parse(localStorage.getItem("cart"))
  //for (var i in Items){

  //}
}

/*function totalCarrito(){
  var total=0;
  total = cost*cant;
  console.log(total);
          //$("#cost").append("<h6>$10</h6>")
}*/


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Seccion de carga de datos de pantalla AR

//Esta funcion asigna el ID del restaurante seleccionado y lo almacena en localStorage para poder cargar su menu correspondiente
function assignRestaurant(idRestaurante) {
  localStorage.setItem("restaurante",idRestaurante);
  try {
    app.loadARchitectWorld();
  } catch (e) {
    alert(e.stack);
    alert(JSON.stringify(e));
    //alert("Aqui es el error?");
  }
  //app.loadARchitectWorld();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



//Esta funcion carga los datos en la pantalla de AR, los platillos su precio, etc...
function loadAr(){
  var models=[];
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/ArController.php',
    type:'POST',
    data:{accion:'loadAr',
          idRestaurante:localStorage.getItem("restaurante")
        },
    success: function(resp){
      var Models = JSON.parse(resp);
      for(var i in Models){
        $("#overlayPicker").append("<a href='javascript: World.showOverlay("+i+");' onclick='loadDescriptionDish("+Models[i].idPlatillo+");' data-role='button' class='arkk'><img src='assets/"+Models[i].nombreImagen+".png' class='imgkk'></a>");
        World.paths.push("assets/"+Models[i].nombreImagen+".png");
      //  models[i]="assets/"+Models[i].nombreImagen+".png";
      }
      //alert(World.paths);
    },
    error:function(err){
      console.log(err);
    },
  });
}
//Esta funcion carga toda la descripcion de los platillos
function loadDescriptionDish(id) {
  $("#rowInfo").empty();
  $("#rowInfo").removeClass("hidden");
  $("#carritoContainer").empty();
  $("#qualificationContainer").empty();
  $("#qualificationContainer").removeClass("hidden");
  $("#logoContainer").empty();
  $("#hideBtn").addClass("hidden");
  $("#hideDesc").removeClass("hidden");
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/ArController.php',
    type:'POST',
    data:{accion:'loadDescriptionDish'},
    success:function(resp){
      var Descripciones = JSON.parse(resp);
      for(var i in Descripciones){
        if(Descripciones[i].idPlatillo == id){
          $("#rowInfo").append("<p class='white-text'>"+Descripciones[i].nombre+"</p><p class='white-text'>"+Descripciones[i].descripcion+"<br>$"+Descripciones[i].costo+"</p>");
          $("#carritoContainer").append("<a class='modal-trigger' href='#!' onclick='modalOrder("+Descripciones[i].idPlatillo+");'><img src='assets/car.png'></a>");
          $("#qualificationContainer").append("<p class='white-text'><i class='material-icons yellow-text'>grade</i>"+Descripciones[i].calificacion+"(185)</p>")
          $("#logoContainer").append("<img src='img/tpt.png'>")
        }
      }
    },
    error:function(err){
      console.log(err);
    },
  });
}
//Esta funcion crea un modal para realizar la orden y agregar el platillo al carrito
function modalOrder(id){
  $("#orderContainer").empty();
  $("#footerContainer").empty();
  $('#modalOrder').modal('open');
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/ArController.php',
    type:'POST',
    data:{accion:'cargarPreCar',
          id:id,
        },
    success:function(resp){
      var PreCar = JSON.parse(resp);
      for(var i in PreCar){
        if(PreCar[i].idPlatillo == id){
          $("#orderContainer").append("<div class='container'><table class='striped'><tr><td><h4>"+PreCar[i].nombre+"</h4></td></tr><tr><td><p>"+PreCar[i].descripcion+"</p></td></tr><tr><td><img style='border-radius: 20px' src='img/pizza.jpg' width='100%' alt=''></td></tr><tr><td><p>Prepared By "+PreCar[i].restaurant+"</p></td></tr><tr><td><p id='points'>+"+PreCar[i].puntos+"</p></td></tr></table></div>");
          $("#footerContainer").append("<div class='pill-modal' align='center'><a href='#!' class='modal-close waves-effect waves-green white-text' onclick='AddToCart("+PreCar[i].idPlatillo+");'>Make Order</a></div>")
        }
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}
//Esta funcion agrega el platillo elegido al carrito
function AddToCart(id){
  //Este será el arreglo primario de objetos
  var tempArray = new Array();
  //Este sera el arreglo de objetos
  var tempCart = [];
  var tempObj = [];

  if (localStorage.getItem("cart")== null) {
    tempObj = {
      id: id,
      quantity : 1
  };
    tempArray.push(tempObj);
    localStorage.setItem("cart",JSON.stringify(tempArray));
  }
  else {
    tempCart=JSON.parse(localStorage.getItem("cart"));
    for(var i in tempCart){
      if (tempCart[i].id == id) {
        tempObj = {
          id:tempCart[i].id,
          quantity : tempCart[i].quantity+1
      };
        tempArray.push(tempObj);
      }
    }
    //tempArray.push(tempCart);
    localStorage.setItem("cart",JSON.stringify(tempArray));
  }

//var debug = JSON.parse(localStorage.getItem("cart"));
var debug = JSON.parse((localStorage.getItem("cart")))[0].quantity

alert(debug);
console.log(debug);

}

//Esta funcion esconde el menu
function hideMenu() {
  $("#overlayPicker").addClass("hidden");
  $("#showBtn").removeClass("hidden");
  $("#hideBtn").addClass("hidden");
  AR.logger.debug("Si escondi el menu");
}
//Esta funcion muestra el menu
function showMenu() {
  $("#overlayPicker").removeClass("hidden");
  $("#showBtn").addClass("hidden");
  $("#hideBtn").removeClass("hidden");
}
//Esta funcion esconde la descripcion del platillo
function hideDesc() {
  $("#rowInfo").addClass("hidden");
  $("#hideDesc").addClass("hidden");
  $("#hideBtn").removeClass("hidden");
  $("#qualificationContainer").addClass("hidden");
}
//Funcion para regresar al menu principal y destruir el World de AR
function worldClose(){
  //alert("Eu entrinha");
  try {
    wikitudePlugin.close();
  } catch (e) {
    alert(e.stack);
  }

//document.location = 'architectsdk://actionButton?status=hide';
//World.onUrlInvoke("architectsdk://onUrlInvoke");
}


//Tiene que ser el ultimo metodo
//Esta funcion cierra la sesion
function logOut() {
  localStorage.setItem("token",undefined);
  window.location="index.html";
}

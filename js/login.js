function login(){
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/LoginController.php',
    type:'POST',
    data:{
      accion:'loginUser',
      usuario:$('#usuario').val(),
      password:$('#password').val()
    },
    success:function(resp){
      console.log(resp);
      if (resp=="0") {
        M.toast({html: 'Usuario o contraseña incorrecta', classes: 'rounded'});
      }
      else {
        localStorage.setItem("token",resp);
        //localStorage.setItem("token",undefined);
        window.location="main.html";
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

function loginEmployee(){
  $.ajax({
    url:'http://192.168.0.250/api-rest/controller/LoginController.php',
    type:'POST',
    data:{
      accion:'loginEmployee',
      usuario:$('#usuario').val(),
      password:$('#password').val()
    },
    success:function(resp){
      console.log(resp);
      if (resp=="0") {
        M.toast({html: 'Usuario o contraseña incorrecta', classes: 'rounded'});
      }
      else {
        //localStorage.setItem("token",resp);
        //localStorage.setItem("token",undefined);
        //window.location="main.html";
      }
    },
    error:function(err){
      console.log(err);
    }
  });
}

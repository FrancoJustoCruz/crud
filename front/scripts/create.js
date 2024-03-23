const formUser=document.getElementById("formNewUser");

formUser.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const data=new FormData(formUser);

    const res=await fetch("http://localhost:3000/api/users/store",{
        method:'POST',
        body: data,
    })
    if(res.status === 201){
        alert("Usuario creado correctamente");
        window.location.href="/index.html"
    }else{
        alert("Error al crear usuario");
    }

});
window.onload = async function (){
    let status = localStorage.getItem("login");
    if (status === "ok") {
        location.href = "producto.html";
    }
}

function mostrarMensaje(mensaje, tipo = "success") {
    let mensajeNotificacion = document.getElementById("mensajeNotificacion");
    mensajeNotificacion.textContent = mensaje;
    mensajeNotificacion.className = `alert alert-${tipo} mt-3`;

    setTimeout(() => {
        mensajeNotificacion.textContent = "";
        mensajeNotificacion.className = "";
    }, 3000);
}


document.getElementById("btn-login").addEventListener("click", async function () {
    let inputEmail = document.getElementById("email-user");
    let inputPassword = document.getElementById("password-user");

    if (inputEmail.value.trim().length <= 0 || inputPassword.value.trim().length <= 0) {
        mostrarMensaje("Porfavor complete los campos", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": inputEmail.value,
        "password": inputPassword.value,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://127.0.0.1:5001/api/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {

            if (result.user_id) { 
                localStorage.setItem("login", "ok");
                localStorage.setItem("user_id", result.user_id);

                location.href = "producto.html";

            }else{
                mostrarMensaje(result.message, "danger");
            }

        })
        .catch((error) => {
            mostrarMensaje("Hubo un error al iniciar sesión", "danger");
            console.error(error);
        });


})
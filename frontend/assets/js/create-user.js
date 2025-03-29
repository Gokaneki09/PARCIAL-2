document.getElementById("btn-register").addEventListener("click", async function () {
    let inputName = document.getElementById("name-user");
    let inputEmail = document.getElementById("email-user");
    let inputPassword = document.getElementById("password-user");
    let mensajeNotificacion = document.getElementById("mensajeNotificacion");

    if (inputName.value.trim().length <= 0 || inputEmail.value.trim().length <= 0 || inputPassword.value.trim().length <= 0) {
        mostrarMensaje("Porfavor Complete todos los campos", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": inputName.value,
        "email": inputEmail.value,
        "password": inputPassword.value,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        let response = await fetch("http://127.0.0.1:5001/api/users", requestOptions);
        let result = await response.json(); 

        if (!response.ok) {
            mostrarMensaje(result.message || "Error en el registro. Intentalo nuevamente.", "danger");
            return;
        }

        mostrarMensaje(result.message || "El usuario se registro con éxito", "success");

        setTimeout(() => {
            location.href = "login.html";
        }, 2000);
    } catch (error) {
        mostrarMensaje("Error en la conexión. Intente nuevamente.", "danger");
    }
});

function mostrarMensaje(mensaje, tipo = "success") {
    let mensajeNotificacion = document.getElementById("mensajeNotificacion");
    mensajeNotificacion.textContent = mensaje;
    mensajeNotificacion.className = `alert alert-${tipo} mt-3 d-block`;

    setTimeout(() => {
        mensajeNotificacion.textContent = "";
        mensajeNotificacion.className = "d-none";
    }, 3000);
}

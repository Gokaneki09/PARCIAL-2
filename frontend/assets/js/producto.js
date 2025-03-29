window.onload = function () {
    let status = localStorage.getItem("login");
    let userId = localStorage.getItem("user_id");

    if (status !== "ok" || !userId) {
        location.href = "login.html";
        return;
    }

    cargarProductos(userId);
};

function mostrarMensaje(mensaje, tipo = "success") {
    let mensajeNotificacion = document.getElementById("mensajeNotificacion");
    mensajeNotificacion.textContent = mensaje;
    mensajeNotificacion.className = `alert alert-${tipo} mt-3`;

    setTimeout(() => {
        mensajeNotificacion.textContent = "";
        mensajeNotificacion.className = "";
    }, 3000);
}

async function cargarProductos(userId) {
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/productos/${userId}`);
        const productos = await response.json();

        const contenedor = document.getElementById("row-productos");

        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }

        for (let i = 0; i < productos.length; i++) {
            let producto = productos[i];

            let card = document.createElement("div");
            card.classList.add("col-md-4", "mb-3");

            let cardBody = document.createElement("div");
            cardBody.classList.add("card", "shadow-sm", "p-3");

            let nombre = document.createElement("h5");
            nombre.classList.add("fw-bold");
            nombre.textContent = producto.nombre;

            let precio = document.createElement("p");
            precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;

            let btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mt-2");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = function () {
                eliminarProducto(producto.id);
            };

            let btnActualizar = document.createElement("button");
            btnActualizar.classList.add("btn", "btn-warning", "mt-2", "ms-2");
            btnActualizar.textContent = "Actualizar";
            btnActualizar.onclick = function () {
                abrirFormularioActualizar(producto);
            };

            cardBody.appendChild(nombre);
            cardBody.appendChild(precio);
            cardBody.appendChild(btnEliminar);
            cardBody.appendChild(btnActualizar);
            card.appendChild(cardBody);
            contenedor.appendChild(card);
        }
    } catch (error) {
        mostrarMensaje("Hubo un error al obtener el productos", "danger");
    }
}

document.getElementById("form-producto").addEventListener("submit", async function (event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let precio = document.getElementById("precio").value.trim();
    let userId = localStorage.getItem("user_id");

    if (!nombre || !precio || !userId) {
        mostrarMensaje("Todos los campos son obligatorios", "warning");
        return;
    }

    const datos = { nombre, precio: parseFloat(precio), user_id: userId };

    try {
        await fetch("http://127.0.0.1:5001/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        mostrarMensaje("Se agrego correctamente el producto");
        cargarProductos(userId);
        document.getElementById("form-producto").reset();
    } catch (error) {
        mostrarMensaje("Hubo un error al agregar el producto", "danger");
    }
});

function abrirFormularioActualizar(producto) {
    document.getElementById("update-id").value = producto.id;
    document.getElementById("update-nombre").value = producto.nombre;
    document.getElementById("update-precio").value = producto.precio;
    
    let modal = new bootstrap.Modal(document.getElementById("modalActualizar"));
    modal.show();
}

document.getElementById("form-actualizar").addEventListener("submit", async function (event) {
    event.preventDefault();

    let id = document.getElementById("update-id").value;
    let nombre = document.getElementById("update-nombre").value.trim();
    let precio = document.getElementById("update-precio").value.trim();

    if (!id || !nombre || !precio) {
        mostrarMensaje("Todos los campos son obligatorios", "warning");
        return;
    }

    const datos = { nombre, precio: parseFloat(precio) };

    try {
        const response = await fetch(`http://127.0.0.1:5001/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (!response.ok) {
            throw new Error("hubo un error en la actualización");
        }

        mostrarMensaje("Se actualizo correctamente el producto");
        let modal = bootstrap.Modal.getInstance(document.getElementById("modalActualizar"));
        modal.hide();

        cargarProductos(localStorage.getItem("user_id"));
    } catch (error) {
        mostrarMensaje("Ocurrio un error al eliminar el producto", "danger");
    }
});


async function eliminarProducto(id) {
    try {
        await fetch(`http://127.0.0.1:5001/api/productos/${id}`, { method: "DELETE" });
        mostrarMensaje("Se elimino correctamente el producto", "info");
        cargarProductos(localStorage.getItem("user_id"));
    } catch (error) {
        mostrarMensaje("Error no se pudo eliminar el producto", "danger");
    }
}
document.getElementById("btn-logout").addEventListener("click", function () {
    localStorage.removeItem("login");
    localStorage.removeItem("user_id");
    location.href = "login.html"; 
}); 
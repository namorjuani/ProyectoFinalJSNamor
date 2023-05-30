let contenedorProductos = document.getElementById("contenedorProductos");
let buscador = document.getElementById("buscador");
let inputs = document.getElementsByClassName("input");
let carrito = [];
let total = 0;

// Cargo productos desde el archivo JSON
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productos = data;
    renderizarTarjetas(productos);
  });

// Agrego eventos a los elementos de categoría
for (const input of inputs) {
  input.addEventListener("click", filtrarPorCategoria);
}

// Agrego evento al buscador
buscador.addEventListener("input", filtrarPorNombre);

// Filtro productos por categoría
function filtrarPorCategoria() {
  let filtros = Array.from(inputs).filter(input => input.checked).map(input => input.id);
  let arrayFiltrado = productos.filter(producto => filtros.includes(producto.categoria));
  renderizarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : productos);
}

// Filtro productos por nombre
function filtrarPorNombre() {
  let arrayFiltrado = productos.filter(producto => producto.nombre.includes(buscador.value));
  renderizarTarjetas(arrayFiltrado);
}

// Renderizo las tarjetas de productos
function renderizarTarjetas(arrayDeProductos) {
  contenedorProductos.innerHTML = "";
  arrayDeProductos.forEach((producto, i) => {
    let tarjeta = document.createElement("div");
    tarjeta.className = "tarjetaProducto";
    tarjeta.innerHTML = `
      <h1>${producto.nombre}</h1>
      <p>Categoría: ${producto.categoria}</p>
      <p>Precio: ${producto.precio}</p>
      <div class="imagen" style="background-image: url(${producto.img})"></div>
      <button class="comprar" data-producto-id="${producto.id}">COMPRAR</button>
    `;
    tarjeta.addEventListener("click", agregarAlCarrito);
    contenedorProductos.appendChild(tarjeta);
  });
}

// Agrego productos al carrito
function agregarAlCarrito(event) {
  let productoId = event.target.dataset.productoId;
  let producto = productos.find(producto => producto.id == productoId);

  if (producto) {
    let productoExistente = carrito.find(item => item.nombre === producto.nombre);

    if (productoExistente) {
      productoExistente.cantidad++;
      total += producto.precio;
    } else {
      productoExistente = { ...producto, cantidad: 1 };
      carrito.push(productoExistente);
      total += producto.precio;
    }

    guardarCarritoEnLocalStorage();
    renderizarCarrito();
  }
}

// Guardo el carrito en el Local Storage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('total', total);
}

// Cargo el carrito desde el Local Storage
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  const totalGuardado = localStorage.getItem('total');

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    total = parseInt(totalGuardado) || 0;
    renderizarCarrito();
  }
}

// Renderizo el carrito de compras
function renderizarCarrito() {
  let carritoHTML = document.getElementById("carrito");
  carritoHTML.innerHTML = "";

  carrito.forEach(({ nombre, precio, cantidad }) => {
    let itemCarrito = document.createElement("div");
    itemCarrito.innerHTML = `Producto: ${nombre}, Precio: $${precio}, Cantidad: ${cantidad}`;
    carritoHTML.appendChild(itemCarrito);
  });

  let totalHTML = document.getElementById("total");
  totalHTML.innerHTML = `Precio total: $${total}`;
}

// Vacio el carrito
function vaciarCarrito() {
  carrito = [];
  total = 0;
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
}

// Agrego evento al botón "Vaciar carrito"
let botonVaciarCarrito = document.getElementById("vaciarCarrito");
botonVaciarCarrito.addEventListener("click", vaciarCarrito);

// Finalizar la compra
function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("No hay productos seleccionados.");
    return;
  }

  mostrarMensaje("Procesando pago...", "info");

  // Simulamos un tiempo de procesamiento
  setTimeout(() => {
    vaciarCarrito();
    mostrarMensaje("¡Gracias por su compra!", "success");
  }, 2000);
}

// Agrego evento al botón "Pagar ahora"
let botonPagarAhora = document.getElementById("finalizarCompra");
botonPagarAhora.addEventListener("click", finalizarCompra);

// Muestro mensaje
function mostrarMensaje(mensaje, tipo = "error") {
  Swal.fire({
    icon: tipo,
    title: mensaje,
    showConfirmButton: true,
    timer: 2000
  });
}

// Cargo el carrito desde el Local Storage al cargar la página
cargarCarritoDesdeLocalStorage();

let contenedorProductos = document.getElementById("contenedorProductos")
//Renderizo las tarjetas de los productos por medio de JSON
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    // Aquí puedes manipular los datos recibidos del archivo JSON
    productos = data // Asignamos los datos del JSON a la variable productos
    renderizarTarjetas(productos) // Volvemos a renderizar las tarjetas con los nuevos datos
  })

let buscador = document.getElementById("buscador")
buscador.addEventListener("input", filtrarPorNombre)

let inputs = document.getElementsByClassName("input")
for (const input of inputs) {
  input.addEventListener("click", filtrarPorCategoria)
}

//Filtrar por categoria
function filtrarPorCategoria() {
  let filtros = []
  for (const input of inputs) {
    if (input.checked) {
      filtros.push(input.id)
    }
  }
  let arrayFiltrado = productos.filter(producto => {
    if (filtros.includes(producto.categoria)) {
      return producto
    }
  })
  renderizarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : productos)
}

//Filtro por nombre
function filtrarPorNombre() {
  let arrayFiltrado = productos.filter(producto => producto.nombre.includes(buscador.value))
  renderizarTarjetas(arrayFiltrado)
}


function renderizarTarjetas(arrayDeProductos) {
    contenedorProductos.innerHTML = ""
    arrayDeProductos.forEach(({ categoria, nombre, precio, img}) => {
        let tarjeta = document.createElement("div")
        tarjeta.className = "tarjetaProducto"
        tarjeta.innerHTML = `
        <h1>${nombre}</h1>
        <p>Categoría: ${categoria}</p>
        <p>Precio: ${precio}</p>
        <div class="imagen" style="background-image: url(${img})"></div>
        <button id="comprar">COMPRAR</button>
        `
        contenedorProductos.appendChild(tarjeta)
    })
}

let carrito = []
let total = 0

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
  let productoExistente = carrito.find(item => item.nombre === producto.nombre)

  if (productoExistente) {
    productoExistente.cantidad++
    total += producto.precio
  } else {
    productoExistente = { ...producto, cantidad: 1 }
    carrito.push(productoExistente)
    total += producto.precio
  }
  Swal.fire(`El producto ${producto.nombre} ha sido agregado al carrito.`)
}

// Función para renderizar el carrito de compras
function renderizarCarrito() {
  let carritoHTML = document.getElementById("carrito")
  carritoHTML.innerHTML = ""

  carrito.forEach(({ nombre, precio, cantidad }) => {
    let itemCarrito = document.createElement("div")
    itemCarrito.innerHTML = `Producto: ${nombre}, Precio: $${precio}, Cantidad: ${cantidad}`
    carritoHTML.appendChild(itemCarrito)
  })

  let totalHTML = document.getElementById("total")
  totalHTML.innerHTML = `Precio total: $${total}`
}



// Agregar evento de click a los botones de comprar
let botonesComprar = document.getElementsByClassName("comprar")
for (let i = 0; i < botonesComprar.length; i++) {
  botonesComprar[i].addEventListener("click", () => {
    agregarAlCarrito(productos[i])
    renderizarCarrito()
  })
}

// Renderizar las tarjetas de productos
function renderizarTarjetas(arrayDeProductos) {
  contenedorProductos.innerHTML = ""
  arrayDeProductos.forEach(({ categoria, nombre, precio, img }, i) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjetaProducto"
    tarjeta.innerHTML = `
        <h1>${nombre}</h1>
        <p>Categoría: ${categoria}</p>
        <p>Precio: ${precio}</p>
        <div class="imagen" style="background-image: url(${img})"></div>
        <button class="comprar">COMPRAR</button>
        `
        hola()

  
  function hola() {
    tarjeta.addEventListener("click", () => {
      agregarAlCarrito(productos[i])
      renderizarCarrito()
  })}
    contenedorProductos.appendChild(tarjeta)
})}

//Funcion vaciar carrito
let vaciarCarrito = document.getElementById("finalizarCompra")
function VaciarCarrito() {
  carrito = []
  carrito.length = 0
  total = 0
}

//Agrego unos sweet alert para finalizar la compra con un procesando seguido de un exito y vaciando el carrito.
let finalizarCompra = document.getElementById("finalizarCompra")
finalizarCompra.addEventListener("click", function () {
  if (carrito.length === 1) {
    ProcesandoPago()
    PagoProcesado()
  } else if (carrito.length === 0) {
    Pagonoprocesado()
  }
})


function ProcesandoPago() {
  Swal.fire({
    title: 'Procesando...',
    showConfirmButton: true,
    allowOutsideClick: false,
    timer: 2000 // Simulamos un retraso de 2 segundos
  })
}

function Pagonoprocesado() { {
    Swal.fire({
      title: 'No se encuentran productos seleccionados',
      showConfirmButton: true,
      allowOutsideClick: false,
      timer: 2000 // Simulamos un retraso de 2 segundos
    })
  } 
}


function PagoProcesado() {
  setTimeout(function () {
    Swal.close() // Cerrar el mensaje de "Procesando..."
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Gracias por su compra!',
      showConfirmButton: true,
      timer: 1500
    })
    
  
  
    setTimeout(function () {
      VaciarCarrito() // Vaciar el carrito
      renderizarCarrito() // Renderizar el carrito vacío
    }, 1500) // Esperar 1.5 segundos antes de vaciar y renderizar el carrito
  }, 2000) // Esperar 2 segundos antes de mostrar el Alert 
}
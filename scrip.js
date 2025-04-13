const productos = [
  { 
    id: 1, 
    nombre: "Cubrelecho Venus", 
    precio: 200000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_758378-MCO69680185972_052023-O.webp",
    descripcion: "Juego de 5 piezas para cama Queen",
    categoria: "cubrelecho"
  },
  { 
    id: 2, 
    nombre: "Juego de Sábanas Algodón", 
    precio: 110000,
    imagen: "https://www.hogar-algodon-egipcio.es/1339-square_large_default/juego-de-sabanas-90-x-200-2-piezas-400hilos.jpg",
    descripcion: "400 hilos - Color beige",
    categoria: "sabanas"
  },
  { 
    id: 3, 
    nombre: "Cortinas Elegantes", 
    precio: 175000,
    imagen: "https://www.disprodec.com.co/images/Productos/Nuevos_Productos/Cortinas_tradicionales/cortinas_tradicionales_5.jpg",
    descripcion: "Tela blackout - Varios colores",
    categoria: "cortinas"
  },
  { 
    id: 4, 
    nombre: "Cojines Decorativos", 
    precio: 110000,
    imagen: "https://m.media-amazon.com/images/I/71yO8xXGExL._AC_SX679_.jpg",
    descripcion: "Set de 4 cojines - Diseño moderno",
    categoria: "cojines"
  },
  { 
    id: 5, 
    nombre: "Manta Tejida", 
    precio: 175000,
    imagen: "https://www.diamantinaylaperla.co/cdn/shop/files/Manta-tejida-artesanalmente-algodon-02.jpg?v=1726628909&width=800",
    descripcion: "Material: 100% algodón - Tamaño 150x200cm",
    categoria: "mantas"
  },
  { 
    id: 6, 
    nombre: "Tapete Moderno", 
    precio: 170000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_806895-MCO70680479542_072023-F.webp",
    descripcion: "Diseño contemporáneo - Resistente",
    categoria: "tapete"
  },
  { 
    id: 7, 
    nombre: "Fundas para Almohadas", 
    precio: 70000,
    imagen: "https://suenosdesedacolombia.com/wp-content/uploads/2020/08/e9fabdd246972897d64a90ac599adf87.jpg",
    descripcion: "Set de 2 fundas - Algodón egipcio",
    categoria: "fundas"
  }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const contadorCarrito = document.getElementById("contador");
const filtroCategorias = document.getElementById("filtro-categorias");

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(precio);
}

function mostrarProductos(categoria = "todos") {
  contenedorProductos.innerHTML = "";
  
  const productosFiltrados = categoria === "todos" 
    ? productos 
    : productos.filter(prod => prod.categoria === categoria);
  
  productosFiltrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="producto-info">
        <h3>${prod.nombre}</h3>
        <p class="precio">${formatearPrecio(prod.precio)}</p>
        <p class="descripcion">${prod.descripcion}</p>
        <button onclick="agregarAlCarrito(${prod.id})">Añadir al carrito</button>
      </div>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(item => item.id === id);
  
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  mostrarNotificacion(`"${producto.nombre}" añadido al carrito`);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;
  
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} (${item.cantidad}) - ${formatearPrecio(item.precio * item.cantidad)}
      <button onclick="eliminarDelCarrito(${index})" class="eliminar">✖</button>
    `;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });
  
  totalCarrito.textContent = formatearPrecio(total).replace('COP', '').trim();
  contadorCarrito.textContent = cantidadTotal;
}

function eliminarDelCarrito(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarNotificacion("El carrito ya está vacío");
    return;
  }
  
  if (confirm("¿Estás seguro que deseas vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion("Carrito vaciado con éxito");
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarNotificacion("El carrito está vacío");
    return;
  }
  
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  alert(`¡Compra finalizada!\n\nTotal: ${formatearPrecio(total)}\n\nGracias por tu compra en Decoraciones Valentina.`);
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion";
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 2000);
}

// Filtro por categoría
filtroCategorias.addEventListener('change', (e) => {
  mostrarProductos(e.target.value);
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos();
  actualizarCarrito();

  // Simulación botón PayPal
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toFixed(2)
          }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        alert("¡Pago realizado con éxito con PayPal!");
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
      });
    }
  }).render('#paypal-button-container');
});

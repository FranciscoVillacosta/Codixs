let productos = [
  {id:1, nombre:"Hamburguesa", precio:80, img:"https://img.icons8.com/emoji/96/hamburger-emoji.png"},
  {id:2, nombre:"Pizza", precio:120, img:"https://img.icons8.com/emoji/96/pizza-emoji.png"},
  {id:3, nombre:"Refresco", precio:25, img:"https://img.icons8.com/emoji/96/cup-with-straw-emoji.png"}
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar menú
function mostrarMenu(){
  const menu = document.getElementById("menu");
  if(!menu) return;
  menu.innerHTML = "";
  const row = document.createElement("div");
  row.className = "row";
  productos.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card producto-card">
        <img src="${p.img}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">$${p.precio}</p>
          <button class="btn btn-primary" onclick="agregarAlCarrito(${p.id})">Agregar</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  menu.appendChild(row);
}

// Agregar al carrito
function agregarAlCarrito(id){
  const producto = productos.find(p=>p.id===id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} agregado al carrito`);
}

// Mostrar carrito
function mostrarCarrito(){
  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("total");
  if(!lista) return;
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(p=>{
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = p.nombre;
    const span = document.createElement("span");
    span.className = "badge bg-primary rounded-pill";
    span.textContent = `$${p.precio}`;
    li.appendChild(span);
    lista.appendChild(li);
    total += p.precio;
  });
  if(totalSpan) totalSpan.textContent = total;
}

// Realizar pedido por WhatsApp
const btnPedido = document.getElementById("btnPedido");
if(btnPedido){
  btnPedido.addEventListener("click", ()=>{
    if(carrito.length===0){ alert("El carrito está vacío"); return; }
    let mensaje = "Hola, quiero hacer el siguiente pedido:\n";
    carrito.forEach(p=> mensaje += `- ${p.nombre} $${p.precio}\n`);
    const total = carrito.reduce((sum,p)=>sum+p.precio,0);
    mensaje += `Total: $${total}`;
    window.open(`https://wa.me/tu-numero-aqui?text=${encodeURIComponent(mensaje)}`);
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  });
}

// Inicializar
mostrarMenu();
mostrarCarrito();

// Service Worker PWA
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

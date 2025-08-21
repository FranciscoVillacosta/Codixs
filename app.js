let productos = [
  {id:1, nombre:"Hamburguesa", precio:80, img:"https://img.icons8.com/emoji/96/hamburger-emoji.png"},
  {id:2, nombre:"Pizza", precio:120, img:"https://img.icons8.com/emoji/96/pizza-emoji.png"},
  {id:3, nombre:"Refresco", precio:25, img:"https://img.icons8.com/emoji/96/cup-with-straw-emoji.png"}
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar menú con contador
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
          <div class="input-group mb-2">
            <button class="btn btn-outline-secondary" onclick="modCantidad(${p.id}, -1)">-</button>
            <input type="number" id="cantidad-${p.id}" class="form-control text-center" value="1" min="1">
            <button class="btn btn-outline-secondary" onclick="modCantidad(${p.id}, 1)">+</button>
          </div>
          <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  menu.appendChild(row);
}

// Modificar cantidad del input
function modCantidad(id, delta){
  const input = document.getElementById(`cantidad-${id}`);
  let val = parseInt(input.value);
  val += delta;
  if(val < 1) val = 1;
  input.value = val;
}

// Agregar al carrito con cantidad
function agregarAlCarrito(id){
  const input = document.getElementById(`cantidad-${id}`);
  let cantidad = parseInt(input.value);
  const producto = productos.find(p=>p.id===id);
  for(let i=0;i<cantidad;i++){
    carrito.push(producto);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${cantidad} x ${producto.nombre} agregado(s) al carrito`);
}

// Mostrar carrito
function mostrarCarrito(){
  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("total");
  if(!lista) return;
  lista.innerHTML = "";
  let total = 0;

  // Contar productos por cantidad
  let contados = {};
  carrito.forEach(p=>{
    if(contados[p.nombre]){
      contados[p.nombre].cantidad++;
    } else {
      contados[p.nombre] = {precio:p.precio, cantidad:1};
    }
  });

  for(const [nombre, info] of Object.entries(contados)){
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${nombre} x ${info.cantidad}`;
    const span = document.createElement("span");
    span.className = "badge bg-primary rounded-pill";
    span.textContent = `$${info.precio * info.cantidad}`;
    li.appendChild(span);
    lista.appendChild(li);
    total += info.precio * info.cantidad;
  }

  if(totalSpan) totalSpan.textContent = total;
}

// Botón pedido por WhatsApp
const btnPedido = document.getElementById("btnPedido");
if(btnPedido){
  btnPedido.addEventListener("click", ()=>{
    if(carrito.length===0){ alert("El carrito está vacío"); return; }

    let contados = {};
    carrito.forEach(p=>{
      if(contados[p.nombre]){
        contados[p.nombre].cantidad++;
      } else {
        contados[p.nombre] = {precio:p.precio, cantidad:1};
      }
    });

    let mensaje = "Hola, quiero hacer el siguiente pedido:\n";
    let total = 0;
    for(const [nombre, info] of Object.entries(contados)){
      mensaje += `- ${nombre} x ${info.cantidad} = $${info.precio*info.cantidad}\n`;
      total += info.precio*info.cantidad;
    }
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

// Registrar Service Worker
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

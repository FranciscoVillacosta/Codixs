let productos = [
  {id:1, nombre:"Tacos Bañados", precio:80, img:"https://scontent-dfw5-3.xx.fbcdn.net/v/t39.30808-6/497496376_674639432021635_4485454584407420168_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFyx0xAhX5zndwBaNU5UL2so_qSNDUCtASj-pI0NQK0BI8reIAkgIGAO7kDKScVp0r1mxRjjwxNGi8GY1MSMLyO&_nc_ohc=r_Ssauxj-_oQ7kNvwGErlHp&_nc_oc=AdkJufIGPtNWUdZtWhsTlN16sEb_6ZE-HIPDbbtiSvw9cAMGKOdVRpBUMtzJN6c3Xlc&_nc_zt=23&_nc_ht=scontent-dfw5-3.xx&_nc_gid=oCLgFKgEHUj9g9lQxgA76Q&oh=00_AfVHD8BdoQvjgXt0wHMRnIibWs9jKLOLylHaN1ydNAC_kw&oe=68AC5DC7"},
  {id:2, nombre:"Pastor Negro", precio:85, img:"https://scontent-dfw5-3.xx.fbcdn.net/v/t39.30808-6/495963334_673972552088323_2081119258563847848_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHp4f5grjT8h_ZqPN564DEsmeJu3kWXs4GZ4m7eRZezgQlFdBdfXj12z-0jktf7437mVitl4TZ--afDcM7YzLN4&_nc_ohc=RldP7tk2s2IQ7kNvwHOpZxX&_nc_oc=AdnvgOLwjQjki2hJTUuiJLEr3EoV5A53KnnLN5g2jsS3tVHJ3Zt_aYDJQt49XTOuQfE&_nc_zt=23&_nc_ht=scontent-dfw5-3.xx&_nc_gid=_TGZc2hCaFNV7ur8HQw6zg&oh=00_AfW3Z_C-xS5WeSYqLE7ubca9LTX8htb3s01WN3vnhF576g&oe=68AC6177"},
  {id:3, nombre:"Tacos Al Pastor", precio:95, img:"https://scontent-dfw5-1.xx.fbcdn.net/v/t39.30808-6/495540324_671949195623992_1265843762300690841_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGTKK-yuuUcfWR4yHpbkJowwi9dqVQr9XbCL12pVCv1djRa7KF9Yhz3QEKvp9pXxE36QkKZPvM0TvB5WtbNjllB&_nc_ohc=Jy3M0VEgxmcQ7kNvwGcmgWN&_nc_oc=AdmcgIAXqm5lVyZ46BotkzlkbEVTr0rIXk3T0M01JLQ9fQX6xp97tiHBLDZ6QWhEBp0&_nc_zt=23&_nc_ht=scontent-dfw5-1.xx&_nc_gid=8eDW77-fB1PytUxx5A6Z-A&oh=00_AfW9kRd6zuCBaoQ0zU54oyRWuz4jGuSCpHRgm5hGlOkF_Q&oe=68AC57D8"}
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

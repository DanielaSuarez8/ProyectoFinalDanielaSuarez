let iconoCarro = document.querySelector('.iconoCarro');
let carrito = document.querySelector('.carrito');
let contenedor = document.querySelector('.contenedor');
let cerrar = document.querySelector('.cerrar');

iconoCarro.addEventListener('click', ()=>{
  if(carrito.style.right == '-100%'){
    carrito.style.right = '0';
    contenedor.style.transform = 'translateX(-400px)';
  } else{
    carrito.style.right = '-100%';
    contenedor.style.transform = 'translateX(0)';
  }
})

cerrar.addEventListener('click', () => {
  carrito.style.right = '-100%';
  contenedor.style.transform = 'translateX(0)';
})

let productos = null;
//obteniendo datos del archivo json
fetch('productos.json')
.then(response => response.json())
.then(data => {
  productos = data;
  addDataToHTML();
})

//mostrando datas in lista html
function addDataToHTML(){
  //removiendo data de html
  let listaProductosHTML = document.querySelector('.listaProductos');
  listaProductosHTML.innerHTML = '';
  //agregando nueva data
  if(productos != null){
    productos.forEach(producto => {
      let nuevoProducto = document.createElement('div');
      nuevoProducto.classList.add('item');
      nuevoProducto.innerHTML = 
      `<img src="${producto.imagen}">
        <h2>${producto.nombre}</h2>
        <div class="precio">$${producto.precio}</div>
        <button onclick="addCarrito(${producto.id})">Agregar al Carrito</button>`
      listaProductosHTML.appendChild(nuevoProducto)
    })
  }
}

let listaCarrito = [];

function checkCarrito(){
  var cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('listaCarrito='));
  if(cookieValue){
    listaCarrito = JSON.parse(cookieValue.split('=')[1]);
  }
}
checkCarrito();

function addCarrito($idProducto){
  let productoCopia = JSON.parse(JSON.stringify(productos));
  //si el producto no está en el carrito
  if(!listaCarrito[$idProducto]){
    let dataProducto = productoCopia.filter(
      producto => producto.id == $idProducto)[0];
      //agregando data de productos en el carrito
      listaCarrito[$idProducto] = dataProducto;
      listaCarrito[$idProducto].cantidad = 1;
  }else{
    // si el producto ya esta en el carrito
    listaCarrito[$idProducto].cantidad++;
  }
  //guardando data en cookies
  //para guardar la data del carrito cuando se apague el computador

let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
document.cookie = "listaCarrito="+JSON.stringify(listaCarrito)+";"+timeSave+"; path=/;";
addCarritoToHTML();
}
addCarritoToHTML();

function addCarritoToHTML(){
  //limpiando datos
  let listaCarritoHTML = document.querySelector('.listaCarrito');
  listaCarritoHTML.innerHTML = '';
  let totalHTML = document.querySelector('.cantidadTotal');
  let cantidadTotal = 0;

  if(listaCarrito){
    listaCarrito.forEach(producto => {
      if(producto){
        let nuevoCarrito = document.createElement('div');
        nuevoCarrito.classList.add('item');
        nuevoCarrito.innerHTML =
      `<img src="${producto.imagen}">
        <div class="contenido">
          <div class="nombre">
            ${producto.nombre}
          </div>
          <div class="precio">
            ${producto.precio}
          </div>
        </div>
        <div class="cantidad">
          <button onclick="cambiarCantidad(${producto.id}, '-')">-</button>
          <span class="value">${producto.cantidad}</span>
          <button onclick="cambiarCantidad(${producto.id}, '+')">+</button>
        </div>`
          listaCarritoHTML.appendChild(nuevoCarrito);
          cantidadTotal = cantidadTotal + producto.cantidad;
      }
    })
  }
  totalHTML.innerText = cantidadTotal;
}

function cambiarCantidad($idProducto, $type){
  switch($type) {
    case '+':
      listaCarrito[$idProducto].cantidad++;
      break;
    case '-':
      listaCarrito[$idProducto].cantidad--;
      // si la cantidad es <= 0 entonces remueve el producto del carrito
      if(listaCarrito[$idProducto].cantidad <= 0){
        delete listaCarrito[$idProducto];
      }
      break;
    default:
      break;
  }
  //guardando nueva data en cookie
  let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
  document.cookie = "listaCarrito="+JSON.stringify(listaCarrito)+";"+timeSave+"; path=/;";
  //recargando la lista del carrito en HTML
  addCarritoToHTML();
}

let listaCarrito = [];
//obteniendo data del carrito de las cookies

function chequearCarrito(){
  var cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('listaCarrito='));
  if(cookieValue){
    listaCarrito = JSON.parse(cookieValue.split('=')[1]);
  }
}

chequearCarrito();
addCarritoToHTML();
function addCarritoToHTML(){
  //limpiar data de HTML
  let listaCarritoHTML = document.querySelector('.returnCart .lista');
  listaCarritoHTML.innerHTML = '';
  let cantidadTotalHTML = document.querySelector('.cantidadTotal');
  let precioTotalHTML = document.querySelector('.precioTotal');

  let cantidadTotal = 0;
  let precioTotal = 0;

  if(listaCarrito){
    listaCarrito.forEach(producto => {
      if(producto){
        let nuevoP = document.createElement('div');
        nuevoP.classList.add('item');
        nuevoP.innerHTML =
        `<img src="${producto.imagen}" alt="">
          <div class="info">
            <div class="nombre">${producto.nombre}</div>
            <div class="precio">$${producto.precio}</div>
          </div>
          <div class="cantidad">${producto.cantidad}</div>
          <div class="returnPrice">$${producto.precio * producto.cantidad}</div>`;
      listaCarritoHTML.appendChild(nuevoP);
      cantidadTotal = cantidadTotal + producto.cantidad;
                precioTotal = precioTotal + (producto.precio * producto.cantidad);
      }
    })
  }
  cantidadTotalHTML.innerText = cantidadTotal;
  precioTotalHTML.innerText = '$' + precioTotal;
}
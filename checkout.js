let listaCarrito = [];

    // Obteniendo datos del carrito de las cookies
    function chequearCarrito(){
      let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listaCarrito='));
      if(cookieValue){
        listaCarrito = JSON.parse(cookieValue.split('=')[1]);
      }
    }

    chequearCarrito();
    addCarritoToHTML();

    // Función para agregar los productos del carrito al HTML
    function addCarritoToHTML(){
      let listaCarritoHTML = document.querySelector('.returnCart .lista');
      let cantidadTotalHTML = document.querySelector('.cantidadTotal');
      let precioTotalHTML = document.querySelector('.precioTotal');

      listaCarritoHTML.innerHTML = ''; // Limpiar el HTML

      let cantidadTotal = 0;
      let precioTotal = 0;

      if(listaCarrito){
        listaCarrito.forEach(producto => {
          if(producto){
            let nuevoP = document.createElement('div');
            nuevoP.classList.add('item');
            nuevoP.innerHTML = `
              <img src="${producto.imagen}" alt="">
              <div class="info">
                <div class="nombre">${producto.nombre}</div>
                <div class="precio">$${producto.precio}</div>
              </div>
              <div class="cantidad">${producto.cantidad}</div>
              <div class="returnPrice">$${producto.precio * producto.cantidad}</div>`;
            listaCarritoHTML.appendChild(nuevoP);

            // Sumar cantidad y precio
            cantidadTotal += producto.cantidad;
            precioTotal += producto.precio * producto.cantidad;
          }
        });
      }

      cantidadTotalHTML.innerText = cantidadTotal;
      precioTotalHTML.innerText = '$' + precioTotal;
    }

    document.getElementById('checkoutForm').addEventListener('submit', function(event) {
      event.preventDefault(); 

      const formData = new FormData(this);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      const formJSON = JSON.stringify(formObject);

      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: formJSON,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          title: 'Compra Confirmada',
          text: 'Tu compra ha sido confirmada con éxito. ¡Gracias por tu pedido!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Borrar la cookie del carrito
          document.cookie = "listaCarrito=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
          // Limpiar el carrito en la interfaz de usuario
          addCarritoToHTML(); // Actualizar el HTML después de eliminar el carrito
    
          // Redirigir a la página de inicio después de que el usuario presione "OK"
          window.location.href = 'index.html'; // Redirige a index.html
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    });
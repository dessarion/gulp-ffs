function testWebP(callback) {

  var webP = new Image();
  webP.onload = webP.onerror = function () {
  callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  
  testWebP(function (support) {
  
  if (support == true) {
  document.querySelector('body').classList.add('webp');
  }else{
  document.querySelector('body').classList.add('no-webp');
  }
  });
function target(){
  alert('Atension')
}

async function test() {
  await setTimeout(() => {
    console.log('done');
  }, 2000);
}

const item = document.querySelectorAll('.navigation__item')

item.forEach(i => {
  i.addEventListener('click', function(e){
    e.target.style.color = 'red'
    target()
    test()
  })
})
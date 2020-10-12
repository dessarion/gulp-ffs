@include('webpTester.js')
@include('alert.js')

const item = document.querySelectorAll('.navigation__item')

item.forEach(i => {
  i.addEventListener('click', function(e){
    e.target.style.color = 'red'
    target()
    test()
  })
})
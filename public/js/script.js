document.addEventListener('DOMContentLoaded', function(){
    const searchbtn = document.querySelector('.searchBTN')
    const searchbar = document.querySelector('.searchBar')
    const searchinput = document.getElementById('searchInput')
    const searchclose = document.getElementById('searchClose')

    searchbtn.addEventListener('click', function(){
        searchbar.style.visibility = 'visible'
        searchbar.classList.add('open')
        searchinput.focus()
    })
    searchclose.addEventListener('click', ()=> {
        searchbar.style.visibility = 'hidden'
    })
})

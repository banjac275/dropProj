let link = "https://ghibliapi.herokuapp.com/films";

document.addEventListener("DOMContentLoaded", (e) => {
    let men = new Dropdown({width: "300px", height: "35px", listedElStyle: "list"}, link, 1);
    men.initSearch();

});
let link = "https://ghibliapi.herokuapp.com/films";

document.addEventListener("DOMContentLoaded", (e) => {
    let men = new Dropdown({listedElStyle: "list"}, link, 1);
    men.initSearch();

});
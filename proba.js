document.addEventListener("DOMContentLoaded", (e) => {
    let men = new Dropdown({width: "300px", height: "35px", listedElStyle: "list"}, ["apples", "oranges", "pairs", "bounce", "ball", "neptune", "apealing"], 1);
    men.initSearch();

});
document.addEventListener("DOMContentLoaded",()=>{
    const search_input_tag=document.querySelector("#search-input-tag");
    search_input_tag.addEventListener("click",()=>{
        let input_icon_container=document.querySelector(".search-box-component-input");
        const leftSearchIcon=document.querySelector("#search-input-icon-center");    
        leftSearchIcon.style.display="block";
        leftSearchIcon.style.display="flex";
        leftSearchIcon.style.justifyContent="center";
        leftSearchIcon.style.alignItem="center";
        if(input_icon_container.classList.contains("addBorder")){
            input_icon_container.classList.remove("addBorder");
        }else{
            input_icon_container.classList.add("addBorder");
        }
    });

    window.addEventListener("click", (event) => {
        let input_icon_container=document.querySelector(".search-box-component-input");
        // const searchBar = document.querySelector(".search_box-component");
        const searchIcon = document.getElementById("search-input-icon-center");
        if(!input_icon_container.contains(event.target)){
            input_icon_container.classList.remove("addBorder");
            searchIcon.style.display = "none"; 
        }
    });
    // buttons stylling 
    const buttons = document.querySelectorAll(".song-movie-selectors button");

    buttons.forEach(button => {
        button.addEventListener("click", function() { 
            buttons.forEach(btn => btn.classList.remove("active"));         
            this.classList.add("active");  
            let defaultSelection=document.querySelector(".activeSelectBtn");
            defaultSelection.classList.remove("activeSelectBtn");           
        });
    });
    
    // buttons Move left and right     
    const prevMoveBtn = document.querySelector(".scrollPrev_selectionBtn");
    const nextMoveBtn = document.querySelector(".scrollNext_selectionBtn");
    const songMovieSelectorsContainer = document.querySelector(".song-movie-selectors");

    nextMoveBtn.addEventListener("click", () => {
    sideScroll(songMovieSelectorsContainer, "scrollNext_selectionBtn", 10, 300);
    });

    prevMoveBtn.addEventListener("click", () => {
    sideScroll(songMovieSelectorsContainer, "scrollPrev_selectionBtn", 10, 300);
    });

    function sideScroll(element, direction, step, distance) {
    let scrollAmount = 0;
    let slideTimer = setInterval(() => {
        if (direction === "scrollNext_selectionBtn") {
            element.scrollLeft += step;
        } else {
            element.scrollLeft -= step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            clearInterval(slideTimer);
        }
         }, 10); // Smooth scrolling
    }


})
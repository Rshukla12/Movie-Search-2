const API_KEY = "be86dd68";
let Result;

function fetchSuggestion(q){
    const url = `https://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`;
    return fetch(url)
        .then( ( res ) => res.json() )
}

function inputHandle(){
    const query = document.getElementById("query");
    query.value = event.target.innerHTML
}


function displaySuggestions(items){
    const container = document.getElementById("suggestions");
    container.innerHTML = null;
    items.forEach( ( el ) => {
        const div = document.createElement('div');
        div.textContent = el;
        div.tabIndex = "0";
        div.addEventListener("click", inputHandle);
        container.append( div );
    });
    container.style.display = "block";
}

async function handleKeyPress(){
    try {
        const query = document.getElementById("query").value;
        result = await fetchSuggestion(query);
        const {Search} = result;
        const res = [];
        Search.forEach( el => res.push( el.Title ) );
        displaySuggestions(res);
    } catch ( err ) {
        console.log(err);
    }
}

function displayMovie(movieDetails){
    const container = document.getElementById("container");
    
    const movie = document.createElement('div');
    const info = document.createElement('div');
    
    movie.id = "movie-container";
    info.id = "movie-info";

    const poster = document.createElement('img');
    const title = document.createElement('h1');
    const type = document.createElement('p');
    
    poster.src = movieDetails.Poster
    title.textContent = movieDetails.Title + " (" + movieDetails.Year + ")";
    type.textContent = "type - " + movieDetails.Type;
    
    info.append( title, type );
    movie.append( poster, info );
    container.append(movie);
}


async function handleSearch(event){
    event.preventDefault();
    try {
        document.getElementById("suggestions").style.display = "none";
        const query = document.getElementById("query").value;
        if ( !query ){
            return;
        }
        result = await fetchSuggestion(query);
        const {Search} = result;
        document.getElementById("container").innerHTML = ""
        Search.forEach( el => displayMovie(el) );
    } catch ( err ) {
        console.log(err);
    }
}


function throttler(){
    let time = 0;
    return () => {
        const now = new Date();
        let id;
        if ( now - time > 300 ){
            time = now;
            id && clearTimeout(id);
            id = setTimeout( ( ) => {
                handleKeyPress();
            }, 250)
        }
    }
}


window.addEventListener("load", () => {
   const btn = document.getElementById("search");
   const input = document.getElementById("query");
   input.onkeydown = throttler();
   btn.addEventListener("click", handleSearch);
})
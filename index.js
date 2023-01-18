/*
A SHOW CLASS CONTAINING ALL THE COMPONENTS THAT EACH SHOW WILL 
DISPLAY 
 */
class Show{
    constructor(title, image, genre, description, id){
        this.title = title;
        this.image = image;
        this.genre = genre;
        this.description = description;
        this.id = id
    }

    toString(){
        return(`
        \nTitle: ${this.title}
        \nImage: ${this.image}
        \nGenre: ${this.genre}
        \nDescription: ${this.description}
        `)
    }
}


/*
THIS FUNCTION MAKES AN API CALL TO THE TVMAZE API IN ORDER TO GET ALL THE SHOWS 
GIVEN A QUERY IN THE USER INPUT FIELD
 */
function searchShows(event){
    //Declare necessary variables
    const base_url = 'https://api.tvmaze.com/search/shows'
    const query_url = '?q=';
    var query_value = '';

    //Create the query based on the user input field
    let user_input = document.getElementById('search_text').value;
    query_value = user_input;

    //Update the result sections with the title of the search
    document.getElementById('search_query').innerText = user_input;

    //Call the API
    fetch(base_url + query_url + user_input)
    .then(function(response){
        //If the call works, parse the data
        response.json().then(function(data){
            //once the data is parsed, process it by creating objects with the necessary information,
            //then display it, these two functions handle this
            displayShows(processData(data));
        }); 
    })
    //Handle error in case the API call does not work
    .catch(function(error){
        alert("ERROR: BAD REQUEST\nRefresh the page and try again")
    })    
}



/*
THIS FUNCTION PROCESSES THE JSON DATA GIVEN IN ORDER TO CREATE OBJECTS 
WITH THE INFORMATION WE NEED FOR EACH SHOW. EACH SHOW IS THEN PUSHED ON AN
ARRAY.
 */
function processData(data){
    let shows = [];
    let s;

    for (let n in data){
        if(data[n].show.image){
            s = new Show(
                data[n].show.name,
                data[n].show.image.medium,
                data[n].show.genres,
                data[n].show.summary,
                data[n].show.id
            )
        }
        else{
            s = new Show(
                data[n].show.name,
                data[n].show.image = null,
                data[n].show.genres,
                data[n].show.summary,
                data[n].show.id
            )
        }
        shows.push(s)
    }    

    return shows;
}



/*
THIS FUNCTION DISPLAYS THE SEARCH RESULTS ON THE DOM 
 */
function displayShows(shows){
    //Clear Previous search
    clearFormatting(false, true, true);

    //Turn result section visible
    document.getElementById('result_section').classList.remove('hidden');

    //Create show elements on HTML
    for (let show in shows){
        let show_node = createShowDomElement(shows[show]);
        //Attach the display show detail function to each show
        show_node.addEventListener('click', displayShowDetail);
        document.getElementById('shows_container').appendChild(show_node); 
    }
}



/*
THIS FUNCTION CREATES INDIVIDUAL DOM NODE ELEMENTS FOR EACH SHOW
*/
function createShowDomElement(show){

    //Create the Div element that will contain the Show Data
    let show_container = document.createElement('div');
    show_container.classList.add('tv-show');

    //Create the title heading
    let show_title_heading = document.createElement('h3');
    show_title_heading.appendChild(document.createTextNode(show.title));

    //Create the image container and the image
    let image_container_div = document.createElement('div');
    image_container_div.classList.add('show-img_container');
    let image_node = document.createElement('img');
    image_node.classList.add('show-img');
    image_node.setAttribute('src', show.image);
    image_container_div.appendChild(image_node);

    //Create the genres paragraph
    let genres_paragraph = document.createElement('p');
    genres_paragraph.appendChild(document.createTextNode(show.genre));
    genres_paragraph.classList.add('show-genre');

    //Create the description paragraph
    let description_paragraph = document.createElement('p');
    description_paragraph.innerHTML = (show.description);
    description_paragraph.classList.add('show-description');
    

    //Put everything together
    show_container.appendChild(show_title_heading);
    show_container.appendChild(image_container_div);
    show_container.appendChild(genres_paragraph);
    show_container.appendChild(description_paragraph);
    return show_container;
}



/*THIS FUNCTION SHOWS THE SHOW DETAILED WHEN THE SHOW IS CLICKED */
function displayShowDetail(){
    console.log('Show is clicked');
}



function clearFormatting(search_bar, result_section, search_query){
    if(search_bar){
        console.log('Clearing Bar')
        document.getElementById('search_text').value = '';
    }
    if(search_query){
        console.log('Clearning Search query Span')
        document.getElementById('search_query').value = '';
    }
    if(result_section){
        console.log('Clearing Results')
        let container = document.getElementById('shows_container')
        document.getElementById('shows_container').innerText = '';
    }
}



window.addEventListener("load", function(){
    clearFormatting(true, false, true);
    //Attach the search function to the search buttons
    document.getElementById("search_start").addEventListener("click", searchShows)
    document.getElementById("search_text").addEventListener("keyup", function(event){
        if(event.code === 'Enter'){
            searchShows();
        }
    });
})
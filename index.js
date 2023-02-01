/*
A SHOW CLASS CONTAINING ALL THE COMPONENTS THAT EACH SHOW WILL 
DISPLAY 
 */
class Show{
    constructor(tv_maze_data){
        this.title = tv_maze_data.name,
        this.genres = tv_maze_data.genres,
        this.description = tv_maze_data.summary,
        this.id = tv_maze_data.id
        if(tv_maze_data.image){
            this.image = tv_maze_data.image.medium
        }
        else{
            this.image = null
        }
    }

    toString(){
        return(`
        \nTitle: ${this.title}
        \nImage: ${this.image}
        \nGenres: ${this.genres}
        \nDescription: ${this.description}
        `)
    }
}



/*
AN EXTENSION OF THE SHOW CLASS THAT WILL BE USED WHEN THE USER WANTS
TO SEE MORE INFOMATION ABOUT A SHOW
*/
class Show_Detailed extends Show{
    constructor(tv_maze_data){
        super(tv_maze_data);
        this.rating = tv_maze_data.rating.average;
        this.official_site = tv_maze_data.officialSite;
        this.country = tv_maze_data.network.country.name;
        this.premiered_date = tv_maze_data.premiered;
        this.ended_date = tv_maze_data.ended;
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



/*THIS FUNCTION MAKES A API CALL TO TV MAZE IN ORDER TO GET DETAILED INFORMATION
ABOUT A SHOW THAT WILL APPEAR WHENVER THE USER CLICKS ON A SHOW AFTER SEARCH */
function searchShowDetail(show_id){
    console.log('Show is clicked, the id is ' + show_id);
    console.log('Making API Call to api.tvmaze.com/shows/' + show_id);
    let url = `https://api.tvmaze.com/shows/${show_id}`;

    //Make the API Call to the TV Maze to get detailed infromation about the show clicked
    fetch(url)
    .then(function(response){
        console.log('Successful Api Call!');
        response.json()
        .then(function(data){
           let show = new Show_Detailed(data);
           console.log(show);
           displayShowDetails(show);
        })
        .catch(function(e){
            console.log('Error parsing the data: ' + e);
        })
    })
    .catch(function(e){
        console.log('Error making the request at ' + url + '\n' + e);
    })
}



/*
THIS FUNCTION PROCESSES THE JSON DATA GIVEN IN ORDER TO CREATE OBJECTS 
WITH THE INFORMATION WE NEED FOR EACH SHOW. EACH SHOW IS THEN PUSHED ON AN
ARRAY.
 */
function processData(data){
    let shows = [];

    for (let n in data){
        s = new Show(data[n].show);
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
        show_node.addEventListener('click', function(){
            searchShowDetail(shows[show].id)
        });
        document.getElementById('shows_container').appendChild(show_node); 
    }
}


/*
THIS FUNCTION DISPLAYS THE SHOW DETAIL ONCE THE USER CLICKS ON A SHOW
*/
function displayShowDetails(detailed_show){
     //Turn show expanded section visible
     document.getElementById('show_expanded_modal').classList.remove('hidden');
     //Turn the background opaque
     document.getElementById('result_section').classList.add('opaque');
     
     //Create detailed show Element and show it
     document.getElementById('show_expanded_modal').appendChild(createDetailedShowDomElement(detailed_show))
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
    genres_paragraph.appendChild(document.createTextNode(show.genres));
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


/*
THIS FUNCTION CREATES THE DOM ELEMENT FOR A DETAILED SHOW 
WHICH WILL BE APPENDED INTO THE SHOW_EXPANDED_MODAL ELEMENT
 */
function createDetailedShowDomElement(detailed_show){    
    function get_stars(){
        //Round the rating to the nearest integer
        let rating = Math.round(detailed_show.rating);        
        //Based on the rating return x number of stars        
        let stars_text = '';
        for (let x = 0; x < rating; x++){            
            stars_text += '*'
        }                    
        return stars_text;
    }
    
    //Container
    let d_show_container = document.createElement('div');
    d_show_container.classList.add('detailed_show');

    //Show title
    let d_show_title_heading = document.createElement('h3');
    d_show_title_heading.innerText = detailed_show.title;
    d_show_title_heading.classList.add('d_show_title');

    //Show review in stars
    let stars_container = document.createElement('span');    
    stars_container.appendChild(document.createTextNode(get_stars()));    

    //Show image
    let d_show_image = document.createElement('img');
    if(detailed_show.image != null){        
        d_show_image.setAttribute('src', detailed_show.image);
    }
    else{
        d_show_image.setAttribute('alt', 'No image available for this show');
    }

    //Put Everything together
    d_show_container.append(d_show_title_heading);    
    d_show_container.append(stars_container);   
    d_show_container.append(d_show_image);
    return (d_show_container);
}



function clearFormatting(search_bar, result_section, show_expanded, search_query){
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
        container.innerText = '';
    }
    if(show_expanded){
        console.log('Clearing Show Expanded')
        let container = document.getElementById('show_expanded_modal')
        container.innerText = '';
        container.classList.add('hidden'); 
        document.getElementById("result_section").classList.remove('opaque');
    }
}



window.addEventListener("load", function(){
    //Resets the formatting
    clearFormatting(true, true, true, true);

    //Attach the search function to the search buttons
    document.getElementById("search_start").addEventListener("click", searchShows)
    document.getElementById("search_text").addEventListener("keyup", function(event){
        if(event.code === 'Enter'){
            searchShows();
        }
    })

    //If the user is viewing a detailed show and clicks outside the panel, the panel shuld minimize
    document.getElementsByTagName('body')[0].addEventListener('click', function(event){
        clearFormatting(false, false, true, false);
    });
})
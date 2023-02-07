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
            //Parse the data by creating shows object with the necessary information            
            let shows = [];
            for (let n in data){
                let s = new Show(data[n].show);
                shows.push(s)
            }                                                        
            //then display the shows on the html DOM.
            displayShows(shows);
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
    let url = `https://api.tvmaze.com/shows/${show_id}`;

    //Make the API Call to the TV Maze to get detailed infromation about the show clicked
    fetch(url)
    .then(function(response){
        console.log('Successful Api Call!');
        response.json()
        .then(function(data){
           let show = new Show_Detailed(data);           
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
THIS FUNCTION DISPLAYS THE SEARCH RESULTS ON THE DOM ONCE THE DATA IS FETCHED   
 */
function displayShows(shows){
    /*
    THIS FUNCTION RETURNS INDIVIDUAL DOM NODE FOR THE SHOW GIVEN
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

    //Clear Previous search
    clearFormatting(true, true, true);

    //Turn result section visible
    document.getElementById('result_section').classList.remove('hidden');

    //For each show in the array create a DOM element and attach it to the result section
    for (let show in shows){
        let show_node = createShowDomElement(shows[show]);
        //Attach the display show detail function to each show, so if user clicks on it, it'll be called
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
    /*  
    THIS FUNCTION CREATES THE DOM ELEMENT FOR A DETAILED SHOW 
    WHICH WILL BE APPENDED INTO THE SHOW_EXPANDED_MODAL ELEMENT
    */
    function createDetailedShowDomElement(detailed_show){            
        //Container
        let d_show_container = document.createElement('div');
        d_show_container.classList.add('detailed_show');

        //Show title
        let d_show_title_heading = document.createElement('h3');
        d_show_title_heading.innerText = detailed_show.title;
        d_show_title_heading.classList.add('d_show_title');

        //Show review in stars
        let stars_container = document.createElement('span');    
            //Round the rating to the nearest integer
            let rating = Math.round(detailed_show.rating);        
            //Based on the rating return x number of stars        
            let stars_text = '';
            for (let x = 0; x < rating; x++){            
                stars_text += '*'
            }     
        stars_container.appendChild(document.createTextNode(stars_text));    

        //Show image
        let d_show_img_container = document.createElement('div');
        d_show_img_container.classList.add('d_show_img_container');
        let d_show_image = document.createElement('img');
        if(detailed_show.image != null){        
            d_show_image.setAttribute('src', detailed_show.image);
        }
        else{
            d_show_image.setAttribute('alt', 'No image available for this show');
        }
        d_show_img_container.appendChild(d_show_image);

        //Show Description
        let d_show_description = document.createElement('p');
        d_show_description.innerHTML = detailed_show.description;
        d_show_description.classList.add('d_show_description');

        //Show Genres
        let d_show_genres = document.createElement('p');
        d_show_genres.appendChild(document.createTextNode(detailed_show.genres));
        d_show_genres.classList.add('d_show_genres');

        //Premiered and End dates
        let d_show_pe = document.createElement('p');
        d_show_pe.append(document.createTextNode(`Premiered: ${detailed_show.premiered_date}`), document.createTextNode(` Ended: ${detailed_show.ended_date}`));
        d_show_pe.classList.add('d_show_prem&end');

        //Country
        let d_show_country = document.createElement('p');
        d_show_country.append(document.createTextNode(`Contry: ${detailed_show.country}`));
        d_show_country.classList.add('d_show_country');

        //Official Website
        let d_show_website = document.createElement('p');
        d_show_website.append(document.createTextNode(detailed_show.official_site));
        d_show_website.classList.add('d_show_website');

        //Wrap show info section and image
        let d_show_side_info = document.createElement('div');
        d_show_side_info.append(d_show_genres, d_show_pe, d_show_country, d_show_website);
        d_show_side_info.classList.add('d_show_side_info_container');
        let wrapper = document.createElement('div');
        wrapper.append(d_show_img_container, d_show_side_info);
        wrapper.classList.add('d_show_header');

        //Put Everything together
        d_show_container.append(d_show_title_heading, stars_container, wrapper, d_show_description);            
        return (d_show_container);
    }

     //Turn show expanded section visible
     document.getElementById('show_expanded_modal').classList.remove('hidden');
     
     //Turn the background opaque
     document.getElementById('result_section').classList.add('opaque');
     
     //Create detailed show Element and show it
     document.getElementById('show_expanded_modal').appendChild(createDetailedShowDomElement(detailed_show))
}



/*
THIS FUNCTION CLEARS THE FORMATTING OF THE PAGE BASED ON THREE PARAMETERS
 */
function clearFormatting(search_bar, result_section, search_query){
    //If this parameter is true, the search bar's text will be cleared
    if(search_bar){        
        document.getElementById('search_text').value = '';
    }
    //If this parameter is true, the 'showing results...' paragraph will be cleared
    if(search_query){       
        document.getElementById('search_query').value = '';
    }
    //If this parameter is true, the results section where all the shows are listed will be cleared
    if(result_section){        
        document.getElementById('shows_container').innerText = '';        
    }
}



window.addEventListener("load", function(){
    //Resets the formatting
    clearFormatting(true, true, true);

    //Attach the search function to the search buttons
    document.getElementById("search_start").addEventListener("click", searchShows)
    document.getElementById("search_text").addEventListener("keyup", function(event){
        if(event.code === 'Enter'){
            searchShows();
        }
    })
})
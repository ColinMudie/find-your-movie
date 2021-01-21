// + $("#userInput").val() + "&begin_date=20120101&end_date=20121231&api-key=n8ZpZeGBjpYFymrs0Lcvt46sbEJDkNuY"
//  ------------------------------ Global Variables -------------------------------
let searchHistory = [];
let foundArray = [];
let majorStreamServices = ["Amazon", "Netflix", "Hulu"];


//loops through the API data 
// function FindStreamingSource(api) {

//     for (let i = 0; i < majorStreamServices.length; i++) {
        
//         if (api.Watch === majorStreamServices[i]) {
//             console.log(majorStreamServices[i]);
//             ;
            
//             ;

//             newArray = majorStreamServices[i]
//             console.log(foundArray);
//             return foundArray.push(newArray);
//         }
//         else{
//             linkEl.text('Not Available');
//         }
//     }
// }



function findNetflix(api, userInput){
    let netflixLinkEl = $('#netflix-text');
    for (let index = 0; index < api.length; index++) {
        if (api[index].Watch === "Netflix") {
            let streamLink = api[index].WatchUrl
            netflixLinkEl.attr("href", streamLink)
            netflixLinkEl.text('You can find ' + userInput + ', here on Netflix');
            break;
        } else {
            netflixLinkEl.text("Not available on Netflix");
            // netflixLinkEl.contents().unwrap();
        }
    }
}
function findHulu(api, userInput){
    let huluLinkEl = $('#hulu-text');
    for (let index = 0; index < api.length; index++) {
        if (api[index].Watch === "Hulu") {
            let streamLink = api[index].WatchUrl
            huluLinkEl.attr("href", streamLink)
            huluLinkEl.text('You can find ' + userInput + ', here on Hulu');
            break;
        } else {
            huluLinkEl.text("Not available on Hulu");
            // huluLinkEl.contents().unwrap();
        }
    }
}
function findAmazon(api, userInput){
    let amazonLinkEl = $('#amazon-text');
    for (let index = 0; index < api.length; index++) {
        if (api[index].Watch === "Amazon") {
            let streamLink = api[index].WatchUrl
            amazonLinkEl.attr("href", streamLink)
            amazonLinkEl.text('You can find ' + userInput + ', here on Amazon');
            break;
        } else {
            amazonLinkEl.text("Not available on Amazon");
            // amazonLinkEl.contents().unwrap();
        }
    }
}



$("#btn").on("click", (event) => {
    event.preventDefault();
    let userInput = $("#userInput").val();
    var queryURL = "https://watch-here.p.rapidapi.com/wheretowatch?title=" + userInput + "&mediaType=tv%20show";

    // ------------------------------------ Setting up local storage -----------------------

    searchHistory.push(userInput);

    window.localStorage.setItem('searchHistory', searchHistory);

    // ---------------------------------------- Where to watch API --------------------------------------------------

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": queryURL,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-key": "69d811a2bemsh7406c1b512a31f1p10322djsn64aee285beed",
            "x-rapidapi-host": "watch-here.p.rapidapi.com"
        },
        "processData": false,
        "data": "{\n    \"mediaType\": \"tv show\",\n    \"title\": \"" + userInput + "\"\n}"
    };

    $.ajax(settings).done(function (response) {
        let parsedResponse = JSON.parse(response)
        console.log(typeof parsedResponse);
        // console.log(response)
        // console.log(typeof response)
        console.log(parsedResponse);

        // Which Streaming Service Available
        
        findNetflix(parsedResponse, userInput);
        findHulu(parsedResponse, userInput);
        findAmazon(parsedResponse, userInput);

    });

    // ---------------------------------------- IMDB API --------------------------------------------------

    const settings2 = {
        "async": true,
        "crossDomain": true,
        "url": "https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-by-title&title=" + userInput,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "69d811a2bemsh7406c1b512a31f1p10322djsn64aee285beed",
            "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
        }
    };

    $.ajax(settings2).done(function (response2) {
        // ---------------------------------- create search history list ------------------------
        // let ul = document.createElement("ul").textContent = "search history";
        // let li = document.createElement("li");
        // let t = document.createTextNode(userInput);
        // li.appendChild(t);
        // ul.appendChild(li);
        let imdbID = "";
        console.log(response2);
        let response2Results = response2.movie_results;
        for (let i = 0; i < response2Results.length; i++) {
            
            if ((response2Results[i].title).toLowerCase() == userInput.toLowerCase()) {
                imdbID = response2Results[i].imdb_id;
                console.log(imdbID);
            }
        }
        //If we want to expand to recommended movies here are recommended titles.
        const settings3 = {
            "async": true,
            "crossDomain": true,
            "url": "https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-similar-movies&imdb=" + imdbID + "&page=1",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "8511f3bf7bmshf017b1acf45c408p15cef2jsn821dd1e3acaa",
                "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
            }
        };
        
        $.ajax(settings3).done(function (response3) {
            console.log(response3);
        });
        
    });

})

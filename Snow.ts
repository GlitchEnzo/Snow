/// <reference path="Playlist.ts" />
/// <reference path="Video.ts" />

var videoElement: HTMLVideoElement;
var playlist: Playlist = null;

var thelist: HTMLElement;
var header: HTMLElement;
var videoTitle: HTMLElement;
var currentFolder: HTMLElement;
var searchbox: HTMLInputElement;

// hook up the OnPopState event to handle when someone tries navigating back or forward in history
window.onpopstate = (event) =>
{
    console.log("Pop State: " + JSON.stringify(event.state));

    if (event.state)
    {
        if (event.state.viewAllGenres)
        {
            playlist.ViewAllGenres(false);
        }
        else if (event.state.viewAllTV)
        {
            playlist.ViewAllTV(false);
        }
        else if (event.state.viewAllMovies)
        {
            playlist.ViewAllMovies(false);
        }
        else if (event.state.viewAllVideos)
        {
            playlist.ViewAllVideos(false);
        }
        else if (event.state.genre)
        {
            playlist.OpenGenre(event.state.genre);
        }
        else if (event.state.show)
        {
            playlist.OpenShow(event.state.show);
        }
        else if (event.state.season)
        {
            playlist.OpenSeason(event.state.season);
        }
        else if (event.state.search != null) // empty string would evaluate to false, so need to explicitly null check
        {
            playlist.Search(event.state.search, false);
        }
    }
    else if (playlist) // we should just default to show all genres
    {
        playlist.ViewAllGenres(false);
        //playlist.ViewAllVideos(false);
    }
};

window.onresize = () =>
{
    // Make the video 100% the width and 33% the height of the window.
    videoElement.width = window.innerWidth;
    videoElement.height = window.innerHeight * 0.33;

    // The size of the header and footer are fixed.  The list should take up all remaining space.
    thelist.style.height = window.innerHeight - header.clientHeight + "px";
}

function search(event: KeyboardEvent)
{
    var query: string;
    if (event.keyCode == 8) // Backspace
    {
        query = searchbox.value.substr(0, searchbox.value.length - 1);
    }
    else if (event.keyCode == 13) // Enter
    {
        query = searchbox.value;
    }
    else
    {
        query = searchbox.value + String.fromCharCode(event.keyCode);
    }

    console.log("Searching: " + query);
    playlist.Search(query, true);
}

function searchClicked()
{
    if (searchbox.value == "Search")
    {
        searchbox.value = "";
    }
}

window.onload = () =>
{
    videoElement = <HTMLVideoElement>document.getElementById('videoElement');
    videoElement.addEventListener("loadeddata", () => { videoElement.play(); }, true);
    videoElement.addEventListener("ended", () => { playlist.PlayNextVideo(); }, true);

    thelist = document.getElementById('thelist');
    header = document.getElementById('header');
    videoTitle = document.getElementById('videoTitle');
    currentFolder = document.getElementById('currentFolder');
    searchbox = <HTMLInputElement>document.getElementById('searchbox');

    // hide the address bar on mobile
    window.scrollTo(0, 1);

    playlist = new Playlist("videos.xml");

    // force a resize event
    window.onresize(null);
};
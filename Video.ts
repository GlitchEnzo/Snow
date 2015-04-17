class Video
{
    genre = "Unknown";
    title = "Unknown";
    season = "Unknown";
    episodeNumber = "Unknown";
    episodeTitle = "Unknown";
    path = "Unknown";

    /*
     * Returns true if this Video is a movie.  False if it is a TV show.
     */
    get isMovie(): boolean
    {
        return this.episodeNumber == "Unknown" || this.episodeNumber == "";
    }

    CreateListItem()
    {
        var listItem = document.createElement("li");

        // check if it is a TV show episode
        if (!this.isMovie)
        {
            listItem.innerHTML = "<div><img src=\"icons/tv.png\"/> " + this.title + " - S" + this.season + "E" + this.episodeNumber + " - " + this.episodeTitle + "</div>";
        }
        else // it is a movie
        {
            listItem.innerHTML = "<div><img src=\"icons/video.png\"/> " + this.title + "</div>";
        }

        // store the path to the song on the list item itelf to let the player access it
        listItem.setAttribute("data-path", this.path);

        var onclick = function ()
        {
            // use global playlist object to queue up this song and all others at the same level
            playlist.AddToPlaylist(this);
        };

        // we must bind the click method to this Song object in order to make the "this" object in the handler point to this Song object
        listItem.onclick = onclick.bind(this);

        return listItem;
    }
} 
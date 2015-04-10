class Video
{
    genre = "Unknown";
    type = "Unknown";
    title = "Unknown";
    season = "Unknown";
    episode = "Unknown";
    path = "Unknown";

    CreateListItem()
    {
        var listItem = document.createElement("li");

        listItem.innerHTML = "<div><img src=\"icons/video.png\"/> " + this.title + "</div>";

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
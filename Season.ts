class Season
{
    /*
     * The name of this TV show season.
     */
    name: string = "Unknown";

    /*
     * The list of episodes in this season.
     */
    episodes: Video[] = new Array();

    /*
     * The TvShow that this Season belongs to.
     */
    tvShow: TvShow;

    CreateListItem()
    {
        var listItem = document.createElement("li");

        listItem.innerHTML = "<div><img src=\"icons/tv.png\"/> Season " + this.name + " (" + this.episodes.length + " episodes)</div>";

        var onclick = function () { this.Open(true); };

        // we must bind the click method to this Genre object in order to make the "this" object in the handler point to this Genre object
        listItem.onclick = onclick.bind(this);

        return listItem;
    }

    Open(pushState: boolean)
    {
        if (pushState)
        {
            // push the state into the browser history so can navigate back to it
            history.pushState({ season: this.name }, "", null);
        }

        currentFolder.innerHTML = this.tvShow.name + " Season " + this.name;

        thelist.innerHTML = "";

        for (var i = 0; i < this.episodes.length; i++)
        {
            var video = this.episodes[i];
            var listItem = video.CreateListItem();
            thelist.appendChild(listItem);
        }
    }
}  
class TvShow
{
    /*
     * The name of this TV show.
     */
    name: string = "Unknown";

    /*
     * The list of seasons associated with this TV show.
     */
    seasons: Season[] = new Array();

    CreateListItem()
    {
        var listItem = document.createElement("li");

        listItem.innerHTML = "<div><img src=\"icons/tv.png\"/> " + this.name + " (" + this.seasons.length + " seasons)</div>";

        var onclick = function () { this.Open(true); };

        // we must bind the click method to this Genre object in order to make the "this" object in the handler point to this Genre object
        listItem.onclick = onclick.bind(this);

        return listItem;
    }

    Open(pushState: boolean)
    {
        playlist.currentShow = this;

        if (pushState)
        {
            // push the state into the browser history so can navigate back to it
            history.pushState({ show: this.name }, "", null);
        }
        currentFolder.innerHTML = this.name;

        thelist.innerHTML = "";

        for (var i = 0; i < this.seasons.length; i++)
        {
            var season = this.seasons[i];
            var listItem = season.CreateListItem();
            thelist.appendChild(listItem);
        }
    }

    AddSeason(season: Season)
    {
        season.tvShow = this;
        this.seasons.push(season);
    }

    GetSeason(seasonName: string)
    {
        for (var i = 0; i < this.seasons.length; i++)
        {
            if (this.seasons[i].name == seasonName)
            {
                return this.seasons[i];
            }
        }

        return null;
    }
} 
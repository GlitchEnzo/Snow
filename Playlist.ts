class Playlist {
    genres: Genre[] = [];
    shows: TvShow[] = [];
    movies: Video[] = [];
    videos: Video[] = []; // ALL videos.  movies or TV shows.

    //selectedGenre: string = "";

    /**
     * The index in the playlist of the video that is currently playing. 
     */
    currentVideoIndex: number = 0;

    currentShow: TvShow;

    /**
     * The actual playlist of videos queued up to play. 
     */
    playlist: string[] = [];

    constructor(xmlFilePath: string)
    {
        // load the videos XML file
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", xmlFilePath, false);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseXML;

        // parse the XML list of videos
        for (var i = 0; i < xmlDoc.childNodes[0].childNodes.length; i++)
        {
            if (xmlDoc.childNodes[0].childNodes[i].nodeName == "Video")
            {
                var video = new Video();
                video.genre = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("genre").value;
                video.title = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("title").value;

                var seasonAttr = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("season");
                if (seasonAttr != null)
                {
                    video.season = seasonAttr.value;
                }

                var episodeNumAttr = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("episodeNumber");
                if (episodeNumAttr != null)
                {
                    video.episodeNumber = episodeNumAttr.value;
                }

                var episodeTitleAttr = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("episodeTitle");
                if (episodeTitleAttr != null)
                {
                    video.episodeTitle = episodeTitleAttr.value;
                }

                video.path = xmlDoc.childNodes[0].childNodes[i].attributes.getNamedItem("path").value;

                //console.log("Loaded video: " + video.path);

                // Add to all videos list
                this.videos.push(video);
            }
        }

        // sort all of the videos into alphabetical order
        this.videos.sort(CompareVideos);

        for (var i = 0; i < this.videos.length; i++)
        {
            var video = this.videos[i];

            if (!video.isMovie) // it is a TV show
            {
                var genre: Genre = this.genres[video.genre];
                if (genre) // the genre exists
                {
                    var show: TvShow = this.shows[video.title];
                    if (show) // the TV show exists
                    {
                        //console.log(video.title + " exists!");

                        var season: Season = show.GetSeason(video.season);
                        if (season) // the season exists
                        {
                            season.episodes.push(video);
                        }
                        else // the season doesn't exist
                        {
                            season = new Season();
                            season.name = video.season;
                            season.episodes.push(video);
                            //show.seasons.push(season);
                            show.AddSeason(season);
                        }
                    }
                    else // the TV show doesn't exist
                    {
                        //console.log(video.title + " doesn't exist!");

                        show = new TvShow();
                        show.name = video.title;

                        season = new Season();
                        season.name = video.season;
                        season.episodes.push(video);
                        //show.seasons.push(season);
                        show.AddSeason(season);

                        this.shows[video.title] = show;

                        genre.shows.push(show);
                    }
                }
                else // the genre doesn't exist
                {
                    show = new TvShow();
                    show.name = video.title;

                    season = new Season();
                    season.name = video.season;
                    season.episodes.push(video);
                    //show.seasons.push(season);
                    show.AddSeason(season);

                    this.shows[video.title] = show;

                    genre = new Genre();
                    genre.name = video.genre;
                    genre.shows.push(show);

                    this.genres[video.genre] = genre;
                }
            }
            else // it is a Movie
            {
                var genre: Genre = this.genres[video.genre];
                if (genre) // the genre exists
                {
                    genre.movies.push(video);
                    this.movies.push(video);
                }
                else // the genre doesn't exist
                {
                    genre = new Genre();
                    genre.name = video.genre;
                    genre.movies.push(video);

                    this.genres[video.genre] = genre;
                }
            }
        }

        this.ViewAllGenres(false);
        //this.ViewAllVideos(false);
    }

    ViewAllGenres(pushState: boolean)
    {
        if (pushState)
        {
            // push the state into the browser history so can navigate back to it
            // pushState(stateObject, title, url)
            history.pushState({ viewAllGenres: true }, "Unused", null);
        }

        currentFolder.innerHTML = "All Genres";

        thelist.innerHTML = "";

        for (var genreItem in this.genres)
        {
            var listItem = this.genres[genreItem].CreateListItem();
            thelist.appendChild(listItem);
        }
    }

    ViewAllTV(pushState: boolean)
    {
        if (pushState)
        {
            history.pushState({ viewAllTV: true }, "Unused", null);
        }

        currentFolder.innerHTML = "All TV";

        thelist.innerHTML = "";

        for (var showItem in this.shows)
        {
            var listItem = this.shows[showItem].CreateListItem();
            thelist.appendChild(listItem);
        }
    }

    ViewAllMovies(pushState: boolean)
    {
        if (pushState)
        {
            history.pushState({ viewAllMovies: true }, "Unused", null);
        }

        currentFolder.innerHTML = "All Movies";

        thelist.innerHTML = "";

        for (var movieItem in this.movies)
        {
            var listItem = this.movies[movieItem].CreateListItem();
            thelist.appendChild(listItem);
        }
    }

    ViewAllVideos(pushState: boolean)
    {
        if (pushState)
        {
            // push the state into the browser history so can navigate back to it
            // pushState(stateObject, title, url)
            history.pushState({ viewAllSongs: true }, "Unused", null);
        }

        currentFolder.innerHTML = "All Videos";

        thelist.innerHTML = "";

        for (var videoItem in this.videos)
        {
            var listItem = this.videos[videoItem].CreateListItem();
            thelist.appendChild(listItem);
        }
    }

    OpenGenre(genreName: string)
    {
        this.genres[genreName].Open(false);
    }

    OpenShow(showName: string)
    {
        this.currentShow = this.shows[showName];
        this.shows[showName].Open(false);
    }

    OpenSeason(seasonName: string)
    {
        for (var i = 0; i < this.currentShow.seasons.length; i++)
        {
            if (this.currentShow.seasons[i].name == seasonName)
            {
                this.currentShow.seasons[i].Open(false);
            }
        }
    }

    GetNextVideo()
    {
        this.currentVideoIndex++;
        if (this.currentVideoIndex == this.playlist.length)
            this.currentVideoIndex = 0;

        return this.playlist[this.currentVideoIndex];
    }

    PlayNextVideo()
    {
        var path = this.GetNextVideo();
        var parts = path.split("/");
        videoTitle.innerHTML = parts[parts.length - 1];
        videoElement.src = path;
        videoElement.load();
    }

    //GetPrevVideo() {
    //    this.currentVideoIndex--;
    //    if (this.currentVideoIndex < 0)
    //        this.currentVideoIndex += this.playlist.length;

    //    return this.playlist[this.currentVideoIndex];
    //}

    // add the given Video node (and all other Videos at the same level) to the playlist [automatically starts playing the given Video node]
    AddToPlaylist(video: Video)
    {
        // clear the playlist
        this.playlist.length = 0;

        for (var i = 0; i < thelist.childNodes.length; i++)
        {
            var pathAttr = thelist.childNodes[i].attributes.getNamedItem("data-path");
            if (pathAttr != null)
            {
                var videoPath: string = pathAttr.value;

                // if the current node is the one that was clicked, then mark it as the current video (-1 since getNextVideo auto increments by 1)
                if (videoPath == video.path)
                {
                    this.currentVideoIndex = this.playlist.length - 1;
                }

                this.playlist.push(videoPath);
            }
        }

        // automatically start playing the video that was clicked
        this.PlayNextVideo();
    }

    Search(query: string, pushState: boolean)
    {
        query = query.toLowerCase();

        if (pushState)
        {
            // push the state into the browser history so can navigate back to it
            // if the current state is a search, then replace it to prevent a stack of search history
            if (history.state != null && history.state.search != null)
            {
                history.replaceState({ search: query }, "Unused", null);
            }
            else
            {
                history.pushState({ search: query }, "Unused", null);
            }
        }

        currentFolder.innerHTML = "Search: " + query;

        thelist.innerHTML = "";

        // find any related genres
        for (var genreItem in this.genres)
        {
            if (genreItem.toLowerCase().indexOf(query) > -1)
            {
                thelist.appendChild(this.genres[genreItem].CreateListItem());
            }
        }

        // find any related TV shows
        for (var showItem in this.shows)
        {
            if (showItem.toLowerCase().indexOf(query) > -1)
            {
                thelist.appendChild(this.shows[showItem].CreateListItem());
            }
        }

        // find any related videos
        for (var videoItem in this.videos)
        {
            var video = this.videos[videoItem];
            if (video.isMovie && video.title.toLowerCase().indexOf(query) > -1 ||
                video.episodeTitle.toLowerCase().indexOf(query) > -1)
            {
                thelist.appendChild(video.CreateListItem());
            }
        }
    }
}

/**
 * Compares two Video objects to sort them.
 */
function CompareVideos(a: Video, b: Video)
{
    // first compare the genre
    if (a.genre < b.genre)
        return -1;
    if (a.genre > b.genre)
        return 1;

    // now compare the title
    if (a.title < b.title)
        return -1;
    if (a.title > b.title)
        return 1;

    // they must be the same song
    return 0;
}
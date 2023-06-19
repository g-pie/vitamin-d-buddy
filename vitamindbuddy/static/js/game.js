var game = new Vue({
    el: '#game-page',
    data: {
        playerID: 0,
        response: [],
        suggestedTasks: [],
        savedTasks: [],
        activeTask: NaN
    },
    methods: {
        getTasks: function () {
            url = 'localhost:8000/api/v1/tasks/';
            console.log(url);
    
            // fetch data from iTunes API
            axios
            .get(url)
            .then(response => {
                // save API results
                data = response.data;
    
                console.log("Response for " + url);
                console.log(data);
    
                this.response = data.results;
    
                // save genres
                this.response.forEach(result => {
                    // check if genreName already saved
                    let genreName = result.primaryGenreName;
                    if(!this.genres.find(x => x.name === genreName)) {
                    this.genres.push({
                        name: genreName,
                        isActive: false
                    });
                    }
                })
    
                this.results = data.results;
            })
            .catch(error => console.log(error))
        },
        handleSkip: function (e) {
            taskID = e.target.value;
            // this.getResults();
        },
        handleSave: function (e) {
            taskID = e.target.value;
        },
        handleStart: function (e) {
            taskID = e.target.value;
        }
        // sortResults: function () {
        //     // sort by sort button
        //     switch(this.sortOption) {
        //     case "":
        //     case "Reset to original":
        //         this.showSongs = false;
        //         break;
        //     case "Collection Name":
        //         this.results.sort((a, b) => (a.collectionName < b.collectionName ? -1 : 1));
        //         this.results.forEach(result => {
        //         let collectionName = result.collectionName;
        //         if (collectionName in this.collectionSongs) {
        //             this.collectionSongs[collectionName].push(result.trackName);
        //         } else {
        //             this.collectionSongs[collectionName] = [result.trackName];
        //         }
        //         })
        //         break;
        //     case "Price":
        //         this.showSongs = false;
        //         this.results.sort((a, b) => (a.collectionPrice < b.collectionPrice ? -1 : 1));
        //         break;
        //     default:
        //         this.showSongs = false;
        //         console.log('sort option ' + this.sortOption + ' is not valid');
        //     }
        //     this.genResultsKey();
        // },
        // filterResults: function () {
        //     // sort by genre first
        //     // check if all results should be included
        //     if (this.isActiveGenre('ALL')) { 
        //     this.results = this.response;
        //     } else {
        //     // iterate through results and filter out those
        //     this.results = this.response.filter(result => this.sortGenres.find(genre => genre === result.primaryGenreName))
        //     }
    
        //     this.numResults = this.results.length;
        //     this.genResultsKey();
        // },
        // onEnter: function (e) {
        //     this.searchInput = e.target.value;
        //     this.getResults();
        // },
        // onSortMenuClick: function (e) {
        //     // Check if option already active
        //     let option = e.target.text;
        //     if (option === this.sortOption) { return; }
    
        //     this.options.forEach((opt) => {
        //     opt.isActive = (opt.name === option);
        //     })
    
        //     // update sort option
        //     this.sortOption = option;
        //     console.log(this.sortOption);
    
        //     this.filterResults();
    
        //     if (this.sortOption !== "Reset to original" && this.sortOption !== "") {
        //     this.sortResults();
        //     }
        // },
        // onGenreClick: function (genreClicked) {
        //     if (genreClicked === 'ALL') {
        //     // deselect all other genres
        //     this.genres.forEach(genre => {
        //         genre.isActive = (genre.name === 'ALL')
        //     })
    
        //     // update sortGenres list
        //     this.sortGenres = [genreClicked];
        //     } else {
        //     if (this.isActiveGenre(genreClicked)) {
        //         // remove genre from sortGenres
        //         this.sortGenres = this.sortGenres.filter(name => name !== genreClicked);
        //     } else {
        //         // add genre from sortGenres
        //         // remove ALL from sortGenres if only genre in list
        //         if (this.isActiveGenre('ALL')) {
        //         this.sortGenres = this.sortGenres.filter(name => name !== 'ALL');
        //         }
    
        //         // add to sortGenres
        //         this.sortGenres.push(genreClicked);
        //     }
    
        //     // update genre's active status and deactivate 'ALL', if necessary
        //     this.genres.forEach(genre => {
        //         if (genre.name === genreClicked) {
        //         genre.isActive = !genre.isActive;
        //         } else if (genre.name === 'ALL') {
        //         let sortGenresEmpty = this.sortGenres.length === 0;
        //         if (sortGenresEmpty) {
        //             this.sortGenres.push('ALL');
        //         }
        //         genre.isActive = sortGenresEmpty;
        //         }
        //     })
        //     }
    
        //     this.filterResults();
    
        //     if (this.sortOption !== "Reset to original" && this.sortOption !== "") {
        //     this.sortResults();
        //     }
        // },
        // isActiveGenre: function (genre) {
        //     return this.sortGenres.find(name => name === genre);
        // },
        // genResultsKey: function () {
        //     // hash string
        //     let hashString = `${this.results[0].collectionID}${this.results[0].artistId}${this.sortGenres.length}${this.curAudio.currentTime}`;
        //     let hash = 0;
        //     if (this.results.length !== 0) {
        //     for (var i = 0; i < hashString.length; i++) {
        //         var char = hashString.charAt(i);
        //         hash = ((hash << 5) - hash) + char;
        //         hash = hash & hash; // Convert to 32bit integer
        //     }
        //     }
        //     this.resultKey = hash;
        // },
        // playSound: function (i) {
        //     // Check if audio already playing
        //     if (this.curAudioIndex != -1) {
        //     this.curAudio.pause();
        //     }
    
        //     // update stats
        //     this.curAudioIndex = i;
        //     this.isPlayingAudio = true;
    
        //     let previewUrl = this.results[i].previewUrl;
        //     this.curAudio = new Audio(previewUrl);
        //     this.curAudio.play();
        // },
        // stopSound: function () {
        //     this.curAudio.pause();
        //     this.curAudio.currentTime = 0;
        //     this.isPlayingAudio = false;
        // },
        // showSongsByCollection: function () {
        //     if (this.sortOption === 'Collection Name') {
        //     this.showSongs = true;
        //     }
        // },
        // hideSongsByCollection: function () {
        //     if (this.sortOption === 'Collection Name') {
        //     this.showSongs = false;
        //     }
        // }
    }
})
  
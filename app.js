// fetch data
domo.get('/data/v1/artist')
    .then(function(artist){
      console.log("artist", artist);
    });

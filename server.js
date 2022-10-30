const axios = require("axios");
const express = require("express");

const Anime = require("./connect");
const ejs = require("ejs");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public")); // static file folder

var URL, title, image_url, episodes, score, members, rank, synopsis;

var searchList = [];

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}

app.get("/", (req, res) => {
  Anime.find({}, function (err, animes) {
    res.render("index", {
      AnimeList: animes,
      searchResult: searchList,
    });
  });
});

app.get("/favourites", function (req, res, next) {
  Anime.find({})
    .then(function (animes) {
      res.send(animes);
    })
    .catch(next);
});

app.get("/getAnime", (req, res) => {
  const searchtitle = req.query.title;

  const querystr = `https://api.jikan.moe/v3/search/anime?q=${searchtitle}&order_by=title&sort=asc&limit=6`;

  axios.get(querystr).then((response) => {
    searchList = response.data.results;
    console.log(searchList);

    res.redirect(req.get("referer"));
  });
});

app.get("/addAnime", (req, res) => {
  const searchtitle = req.query.title;

  const querystr = `https://api.jikan.moe/v3/anime/${searchtitle}`;

  axios.get(querystr).then((response) => {
    url = response.data.url;
    title = response.data.title;
    image_url = response.data.image_url;
    episodes = response.data.episodes;
    score = response.data.score;
    members = response.data.members;

    const animeTitle = response.data.title;
    const querystr2 = `https://kitsu.io/api/edge//anime?filter[text]=${animeTitle}&page[limit]=1`;

    axios.get(querystr2).then((response) => {
      rank = response.data.data[0].attributes.popularityRank;
      synopsis = response.data.data[0].attributes.synopsis;

      newAnime = new Anime({
        url: url,
        title: title,
        image_url: image_url,
        episodes: episodes,
        score: score,
        members: members,
        rank:rank,
        synopsis:synopsis,
      });

      newAnime
        .save()

        .then((result) => {
          console.log("Success" + result);
        })

        .catch((error) => {
          console.log("Error" + error);
        });
      res.status(200);
      res.redirect(req.get("referer"));
    });
  });
});

app.get("/deleteAnime", (req, res) => {
  const title = req.query.title;
  Anime.deleteOne({ _id: `${title}` }, function (err) {
    if (err) return errorHandler(err);
    console.log("Successfully deleted");
  });
  res.status(200);
  res.redirect(req.get("referer"));
});

app.get("/editAnime", (req, res) => {
  const title = req.query.title;
  const data = req.query.data;

  Anime.updateOne(
    { _id: `${title}` },
    { score: `${data}` },
    function (err, res) {
      if (err) return errorHandler(err);
      console.log("Successfully edited rating");
    }
  );
  res.status(200);
  res.redirect(req.get("referer"));
});

app.listen(port, () => {
  console.log("Server listening to port 3000");
});

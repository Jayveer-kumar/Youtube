require("dotenv").config();

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejs_mate = require("ejs-mate");
const axios = require("axios");
const cors = require("cors");
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejs_mate);


app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get('https://googleads.g.doubleclick.net/pagead/viewthroughconversion/962985656/', {
            params: req.query, // Forward query parameters
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get("/youtube", async (req, res) => {
    try {
        let apiKey = process.env.YOUTUBE_API_KEY;
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=20&key=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();

        // Get channel image for each video
        const channelIds = data.items.map(video => video.snippet.channelId).join(",");
        const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: {
                part: "snippet",
                id: channelIds,
                key: apiKey
            }
        });
        // Create a mapping of channelId to channel image URL
        const channelImage = {};
        channelResponse.data.items.forEach((element) => {
            const thumbs = element.snippet.thumbnails;
            channelImage[element.id] = thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url;
        });

        // Add channel image to each video
        const completeResponse = data.items.map((video) => {
            return {
                ...video,
                channelImage: channelImage[video.snippet.channelId],
            };
        });
        // Render the page with the complete video data
        res.render("video/index.ejs", { videos: completeResponse, nextPageToken: data.nextPageToken });
        // res.send(completeResponse);
    } catch (error) {
        console.log("Some error during fetching data: ");
        console.error(error);
    }
});

app.get("/youtube/search", async (req, res) => {
    try {
        let apiKey = process.env.YOUTUBE_API_KEY;
        let { search_query } = req.query;
        let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search_query}&type=video&maxResults=10&key=${apiKey}`;
        let searchresponse = await fetch(searchUrl);
        let data = await searchresponse.json();
        if (!data) {
            console.log("Data not recieve : ");
            res.send("Something Went wrong");
        }
        let videoIds = data.items.map(video => video.id.videoId).join(",");
        let videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
        let videoResponse = await fetch(videoDetailsUrl);
        let videoData = await videoResponse.json();
        if (!videoData) {
            console.log("Video Data not Recieve : ");
            res.send("Something Went wrong");
        }
        // Get Channel image for Each video
        const channelIds = videoData.items.map(video => video.snippet.channelId).join(",");
        const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: {
                part: "snippet",
                id: channelIds,
                key: apiKey
            }
        });
        if (!channelResponse) {
            console.log("Video Data not Recieve : ");
            res.send("Something Went wrong");
        }
        const channelImage = {};
        channelResponse.data.items.forEach((element) => {
            channelImage[element.id] = element.snippet.thumbnails.high.url;
        });
        const completeResponse = videoData.items.map((video) => {
            return {
                ...video,
                channelImage: channelImage[video.snippet.channelId],
            };
        });
        if (!completeResponse) {
            console.log("Complete not found : ");
            res.send("Something went Wrong :");
        }
        res.render("video/search.ejs", { videos: completeResponse, nextPageToken: data.nextPageToken });
    } catch (err) {
        console.log("Some Error in search Route : Check again : ");
        console.log(err.message);
    }
})

// Watch funtainality
app.get("/youtube/watch/:id", async (req, res) => {
    try {
        let apiKey = process.env.YOUTUBE_API_KEY;
        let id = req.params.id;
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();
        let channelId = data.items[0].snippet.channelId;
        // ye Request current playing video ka name  , subscribers or image ke liye hai
        let channelURL = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        let channelResponse = await axios.get(channelURL);
        if (!channelResponse) {
            console.log("Complete not found : ");
            res.send("Something went Wrong :");
        }
        // Ye request current playing video ke comments ke liye hai 
        let commentURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${data.items[0].id}&maxResults=20&key=${apiKey}`;
        let commentResponse = await axios.get(commentURL);
        let channelImage = channelResponse.data.items[0].snippet.thumbnails.high ? channelResponse.data.items[0].snippet.thumbnails.high.url : channelResponse.data.items[0].snippet.thumbnails.default.url;
        let completeResponse = {
            videoId: data.items[0].id,
            videos: data.items[0],
            channelImage,
            subscriberCount: channelResponse.data.items[0].statistics.subscriberCount,
            commentResponse
        }
        // Now Featch releted videos 
        let videoTags = data.items[0].snippet.tags || [];
        let searchQuery = videoTags.slice(0, 3).join(" "); // First 3 tags only
        if (!searchQuery) {
            searchQuery = data.items[0].snippet.title.split(" ").slice(0, 5).join(" ");
        }
        const similarVideosURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`;

        let similarVideosResponse = await axios.get(similarVideosURL);
        if (!similarVideosResponse) {
            console.log("Similar Videos not found : ");
            res.send("Something went Wrong :");
        }
        const similarCompleteResponse = similarVideosResponse.data.items;
        res.render("video/play.ejs", { completeResponse, similarCompleteResponse });
    } catch (error) {
        console.error(error);
    }
})


app.listen(port, () => {
    console.log(`Server is running at : ${port} :`);
})

// document.addEventListener("DOMContentLoaded",()=>{
//     const playVideoBox=document.getElementById("video_frame");
//     const videoId=playVideoBox.getAttribute("data-video-id");
//     playVideoBox.src=`https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`;
//     let player;

//     console.log("My Play.js File Linked : ");
    
//     function onYouTubeIframeAPIReady(event){
//         player=new YT.player("video_frame",{
//             events:{
//                 'onReady':onPlayerReady
//             }
//         })
//     }
//     function onPlayerReady(event){
//         const playButton=document.querySelector(".watchPlay");
//         playButton.addEventListener("click",function(){
//           player.playVideo();
//           console.log("Play button Cliked ; ");
//         });
//         const pouseButton=document.querySelector(".watchNext");
//         pouseButton.addEventListener("click",function(){
//             player.pauseVideo();
//             console.log("Pause Button Clicked : ");
//         })
//     }
// })

document.addEventListener("DOMContentLoaded", () => {
    const playVideoBox = document.getElementById("video_frame");
    const videoId = playVideoBox.getAttribute("data-video-id");

    // Set the video source
    playVideoBox.src = `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`;

    let player;

    // YouTube IFrame API callback function
    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("video_frame", {
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    // Function to handle player ready event
    function onPlayerReady(event) {
        const playButton = document.querySelector(".watchPlay");
        const pauseButton = document.querySelector(".watchNext");

        // Play video on button click
        playButton.addEventListener("click", function () {
            player.playVideo();
            console.log("Play button Cliked ; ");
        });

        // Pause video on button click
        pauseButton.addEventListener("click", function () {
            player.pauseVideo(); // Corrected method name
            console.log("Pause Button Clicked : ");
        });
    }

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let totalSubscribersPara =document.querySelector(".watching_ch_total_subs");
    let totalLikePara=document.querySelector("#watching_video_like");
    if(totalSubscribersPara || totalLikePara){
        totalSubscribersPara.textContent = formatNumber(totalSubscribersPara.textContent, "subscribers");
        totalLikePara.textContent = formatNumber(totalLikePara.textContent);
    }

    // Comment Sorting 

    const sortBtn = document.querySelector(".watch-video_comment_sort_btn");
    const sortSelect = document.querySelector(".watch-video_comment_sort_select");

    // Toggle select visibility on button click
    sortBtn.addEventListener("click", () => {
        sortSelect.style.display = sortSelect.style.display === "none" ? "inline-block" : "none";
    });
    sortSelect.addEventListener("change", (e) => {
        console.log("Selected sort:", e.target.value);
    });
    sortSelect.style.display = "none";
    
    // Format comment timestamps
    let commentTimestamps =document.querySelectorAll(".commenter-user-cmt-time");
    commentTimestamps.forEach((timeStamps)=>{
        timeStamps.textContent = publishAtFormate(timeStamps.textContent);
    })
});

// function to convert number to subscriber format  like 1000 = 1k  , 20000 = 20k

function formatNumber(value, label = "") {
    value = Number(value);  // Ensure it's a number

    if (value < 1000) {
        return label ? `${value} ${label}` : `${value}`;
    }

    const thousand = (value / 1000).toFixed(1);
    const million = (value / 1000000).toFixed(1);
    const billion = (value / 1000000000).toFixed(1);

    if (value >= 1000000000) {
        return label ? `${billion}B ${label}` : `${billion}B`;
    } else if (value >= 1000000) {
        return label ? `${million}M ${label}` : `${million}M`;
    } else {
        return label ? `${thousand}K ${label}` : `${thousand}K`;
    }
}

function publishAtFormate(publishAt){
    const publishDate=new Date(publishAt);
    const currentDate=new Date;
    const second=Math.floor((currentDate-publishDate)/1000);
    const minute=Math.floor(second/60);
    const hours=Math.floor(minute/60);
    const day=Math.floor(hours/24);
    const week=Math.floor(day/7);
    const month=Math.floor(day/30);
    const year=Math.floor(day/365);

    if(year>0) return year===1?"1 year ago":`${year} year ago`;
    if(month>0) return month===1?"1 month ago":`${month} month ago`;
    if(week>0) return week===1?"1  Week ago":`${week} week ago`;
    if(day>0) return day===1?"1 day ago":`${day} day ago`;
    if(hours>0) return hours===1?"1 hours ago ":`${hours} hours ago`;
    if(minute>0) return minute===1?"1 minute ago":`${minute} minute ago`;
    if(second>0) return second===1?"1 Second ago":`${second} second ago`;
    return "Just Now";
}
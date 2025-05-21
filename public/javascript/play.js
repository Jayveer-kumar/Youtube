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
    if(totalSubscribersPara){
        totalSubscribersPara.textContent=setSubscribers(totalSubscribersPara.textContent);
    }
    
});

// function to convert number to subscriber format  like 1000 = 1k  , 20000 = 20k

function setSubscribers(subscribers){
    if(subscribers<1000){
        return subscribers;
    }
    const abThousand=(subscribers/1000).toFixed(1);
    const abTenLakhs=(subscribers/1000000).toFixed(1);
    const abBillion= (subscribers / 1000000000).toFixed(1); 

    if(subscribers>1000000000){
        return `${abBillion}B subscribers`;
    }else if(subscribers>1000000){
        return `${abTenLakhs}M subscribers`;
    }else{
        return `${abThousand}K subscribers`;
    }
}
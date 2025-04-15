document.addEventListener("DOMContentLoaded",()=>{
    // Set Views and Updation date steps start
    // Views Steps
    const videsViewsTag=document.querySelectorAll("#home_video_views");
    videsViewsTag.forEach((singleElement)=>{
        const getViews=singleElement.textContent;
        singleElement.textContent="";
        singleElement.textContent=setViews(getViews);
    })  
    // Updation steps
    const video_updation  =document.querySelectorAll(".home-video_updation"); 
    video_updation.forEach((singleElement)=>{
    const getPublishAtDate=singleElement.textContent;
    singleElement.textContent="";
    singleElement.textContent=publishAtFormate(getPublishAtDate);
   }) 

   // Set Time of Video 
   const video_time_para=document.querySelectorAll(".home_video_time");
   video_time_para.forEach((singleElement)=>{
    const home_video_time_value=singleElement.textContent;
    singleElement.textContent='';
    singleElement.textContent=convertDuration(home_video_time_value);// Function call to get Real time
   })
   // Set Views and Updation date , time  steps end

   // Load more Videos Action Start here
    const loadMoreVideoBtn=document.getElementById("home_load_more_video_btn");
    loadMoreVideoBtn.addEventListener("click",()=>{
        const home_load_video_text=document.getElementById("home_load_video_text");
        const home_load_circle=document.getElementById("home_load_circle");
        home_load_video_text.textContent="Loading..";
        home_load_circle.style.display="block";
        // Now Load videos   
        const LoadMoreVideoFn=async ()=>{
            try{
                let nextPageToken=document.getElementById("next-page-token-box").getAttribute("data-next-page-token");
                let apiKey='AIzaSyBAfxacsSOg4HAAGQT3QLIGSNfV1veG_Jg';
                const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&pageToken=${nextPageToken}&key=${apiKey}`;
                let response=await fetch(apiUrl);
                let data=await response.json();
                if(data){
                    home_load_video_text.textContent="See More Video";
                    home_load_circle.style.display="none";
                    // Now get Channel image for Each videos 
                    const channelIds=data.items.map(element=>element.snippet.channelId).join(",");
                     const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
                                params: {
                                    part: "snippet",
                                    id: channelIds,
                                    key: apiKey
                                }
                    });
                    const channelImage = {};
                    channelResponse.data.items.forEach((element) => {
                    channelImage[element.id] = element.snippet.thumbnails.high.url;
                    });
                   // Now get views of Each Vides 
                   
                   const videosId=data.items.map(video=>video.id.videoId).join(",");
                   const videoViewsResponse= await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videosId}&key=${apiKey}`);

                    const allVideoViews={};
                    const allVideoDuration={};
                    videoViewsResponse.data.items.forEach((singleVideo)=>{
                        allVideoViews[singleVideo.id]=singleVideo.statistics.viewCount;
                        allVideoDuration[singleVideo.id]=singleVideo.contentDetails.duration||"N/A";
                    })
                    const completeResponse=data.items.map((singleVideo)=>{
                        return{
                            ...singleVideo,
                            channelImage:channelImage[singleVideo.snippet.channelId],
                            videoViews:allVideoViews[singleVideo.id.videoId]||"0",
                            videoDuration:allVideoDuration[singleVideo.id.videoId]||"N/A",
                        }
                    })
                    console.log("All Video Durations Object:", allVideoDuration);
                    completeResponse.forEach((element)=>{
                        console.log("Checking Mapping in Complete Response:");
                        console.log("singleVideo.id.videoId:", element.id.videoId);
                        console.log("Stored Duration:", allVideoDuration[element.id.videoId]);                        
                    })
                    addVideoDynamically(completeResponse);
                    // update next page Token 
                    document.getElementById("next-page-token-box").setAttribute("data-next-page-token", data.nextPageToken);
                }
            }catch(error){
              console.log("Some Error During fetching Video's : ");
              console.error(error);
            }
        }  
        LoadMoreVideoFn();// Function call  
    })
    // Load more Video Actions End here
});

const addVideoDynamically = (completeResponse)=>{
   for(let video of completeResponse){
      let home_yt_imageThumbnail=document.createElement("div");
      home_yt_imageThumbnail.classList.add("home-yt-imageThumbnail");
      let videoThumbanil=document.createElement("img");// Video thumbnail
      videoThumbanil.src=video.snippet.thumbnails.high.url;
      home_yt_imageThumbnail.appendChild(videoThumbanil);

      let home_yt_progressBar=document.createElement("div");
      home_yt_progressBar.classList.add("home-yt-progressBar");// Progress bar
      home_yt_imageThumbnail.appendChild(home_yt_progressBar);

      let home_yt_captn_val_time=document.createElement("div");// Valume,caption,timer Container
      home_yt_captn_val_time.classList.add("home-yt-captn-val-time");
      let home_yt_val_cap_box=document.createElement("div");// Volume , Caption Cantainer
      home_yt_val_cap_box.classList.add("home-yt-val-cap-box");
      let home_yt_val=document.createElement("div");// Volume Container
      home_yt_val.classList.add("home-yt-val");
      let volumeIcon=document.createElement("i");// Volume icon 
      volumeIcon.classList.add("fa-solid", "fa-volume-high");
      home_yt_val.appendChild(volumeIcon);
      let home_yt_cap=document.createElement("div"); // caption box
      home_yt_cap.classList.add("home-yt-cap");
      let captionIcon=document.createElement("i");
      captionIcon.classList.add("fa-regular","fa-closed-captioning");// Caption icon
      home_yt_cap.appendChild(captionIcon);
      home_yt_val_cap_box.appendChild(home_yt_val);
      home_yt_val_cap_box.appendChild(home_yt_cap);

      let home_yt_time_box=document.createElement("div");
      home_yt_time_box.classList.add("home-yt-time-box");
      let timeParaText=document.createElement("p");
      timeParaText.classList.add("home_video_time");
      timeParaText.textContent= convertDuration(video.videoDuration);


    //   console.log("Hum Set kay reh hai : Duration me 👇 ");
    //   console.log(video.videoDuration);


      home_yt_time_box.appendChild(timeParaText);
      home_yt_captn_val_time.appendChild(home_yt_val_cap_box);
      home_yt_captn_val_time.appendChild(home_yt_time_box);
      home_yt_imageThumbnail.appendChild(home_yt_captn_val_time);
      // Thumbnail , caption ,volume ,time and parogress Part Complete
      
      // video title description , channel image , channel image 
      let home_yt_desction_titleChannelMain=document.createElement("div");
      home_yt_desction_titleChannelMain.classList.add("home-yt-desction-title");
      let home_yt_channel_box =document.createElement("div"); // Channel image box
      home_yt_channel_box.classList.add("home-yt-channel-box");
      let channelImage=document.createElement("img");
      channelImage.src=video.channelImage;// Channel image Source
      home_yt_channel_box.appendChild(channelImage);
      home_yt_desction_titleChannelMain.appendChild(home_yt_channel_box);

      let home_yt_decription_box=document.createElement("div");// Description Box , views 
      home_yt_decription_box.classList.add("home-yt-decription-box");
      let video_description_para=document.createElement("p");
      video_description_para.classList.add("home-video-description");
      video_description_para.textContent=video.snippet.title;
      home_yt_decription_box.appendChild(video_description_para);
      let ChannelName=document.createElement("p");
      ChannelName.classList.add("home-channel-nm");
      ChannelName.textContent=video.snippet.channelTitle;
      home_yt_decription_box.appendChild(ChannelName);

      let videoViewsPara=document.createElement("p");
      videoViewsPara.classList.add("home-video-views");
      videoViewsPara.textContent=setViews(video.videoViews);// set views 
      
      let video_Last_update=document.createElement("span");
      video_Last_update.classList.add("home-video_updation");
      video_Last_update.textContent=publishAtFormate(video.snippet.publishedAt);
      videoViewsPara.appendChild(video_Last_update);
      home_yt_decription_box.appendChild(videoViewsPara);
      home_yt_desction_titleChannelMain.appendChild(home_yt_decription_box);
      // Description , ChannelImage,Channel name, Views, Last updation complete here

      let home_yt_pl_sh_dot=document.createElement("div");// For play Later , Adding Queue ,Not interested video 
      home_yt_pl_sh_dot.classList.add("home-yt-pl-sh-dot");
      let playLater_not_interestedIcon=document.createElement("i");
      playLater_not_interestedIcon.classList.add("fa-solid", "fa-ellipsis-vertical");
      home_yt_pl_sh_dot.appendChild(playLater_not_interestedIcon);
      home_yt_desction_titleChannelMain.appendChild(home_yt_pl_sh_dot);

      // Now get Main Container from front side of the user and append Main content
      // Before add these tag first create a anchor tag so we able to play Video
    
      let playVideoLink=document.createElement("a");
      playVideoLink.href=`http://localhost:8080/youtube/watch/${video.id.videoId}`;
      playVideoLink.style.textDecoration="none";
      let home_yt_video_container=document.createElement("div");
      home_yt_video_container.classList.add("home-yt-video-container");
      home_yt_video_container.appendChild(home_yt_imageThumbnail);
      home_yt_video_container.appendChild(home_yt_desction_titleChannelMain);
      let mainContainer=document.querySelector(".container");
      playVideoLink.appendChild(home_yt_video_container);
      mainContainer.appendChild(playVideoLink);
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

function setViews(views){
    // if Views are less than the 1000 
    if(views<1000){
        return `${views} views`;
    }
    const abThousand=(views/1000).toFixed(1);
    const abTenLakhs=(views/1000000).toFixed(1);
    const abBillion= (views / 1000000000).toFixed(1); 

    if(views>1000000000){
        return `${abBillion}B Views`;
    }else if(views>1000000){
        return `${abTenLakhs}M Views`;
    }else{
        return `${abThousand}K Views`;
    }
}

function convertDuration(duration) {
    if(typeof duration !=='string'){
        return "Duration type is not String ";
    }
    if(!duration){
        return "Duration is not Valid ";
    }
    const pattern = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const match = duration.match(pattern);

    if (!match) {
        return "Invalid duration format";
    }

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    // Add leading zeros and format the time
    const formattedHours = hours > 0 ? `${hours < 10 ? `0${hours}` : hours}:` : "";
    const formattedMinutes = `${minutes < 10 ? `0${minutes}` : minutes}:`;
    const formattedSeconds = `${seconds < 10 ? `0${seconds}` : seconds}`;

    // Combine the parts
    let readableDuration = formattedHours + formattedMinutes + formattedSeconds;

    // Remove trailing colon if no seconds
    if (seconds === 0) {
        readableDuration = readableDuration.slice(0, -1);
    } 
    return readableDuration;
}
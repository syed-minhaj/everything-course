

const API_KEY = process.env.YOUTUBE_API_KEY!;

async function getYoutubeUrl({title} : {title: string}){
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
            part: "snippet",
            q: title,
            type: "video",
            order: "relevance",
            videoDefinition: "high",
            regionCode: "US",
            relevanceLanguage: "en",
            maxResults: "1",
            key: API_KEY,
        })}`
    );

    const data = await response.json();
    if (data.items.length === 0) {
        return null;
    }
    return {id : data.items[0].id.videoId , title : data.items[0].snippet.title };
}

async function getOtherUrl({url} : {url: string}){
    const response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
    });
    if (!response.ok) return null; 

    const finalUrl = response.url;
    if (finalUrl.includes("vertexaisearch.cloud.google.com")) return null;

    return finalUrl;
}

export {getYoutubeUrl , getOtherUrl}
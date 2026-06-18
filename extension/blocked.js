//make radble the urls
const params = new URLSearchParams(window.location.search);
//extractteh reason for blocking the url
const originalUrl = params.get("url");
const reason = params.get("reason");

//take the references from html 
const reasonEl = document.getElementById("reason");
const urlEl = document.getElementById("blockedUrl");
const goBackBtn = document.getElementById("goBackBtn");

//Display teh reason
if(reason){
    reasonEl.textContent = `Reason: ${reason}`;
}

//display the blocked sites
if (originalUrl){
    urlEl.textContent = `Blocked URL: ${originalUrl}`;
}

//User clicks GO BACK btn
goBackBtn.addEventListener("click",()=>{
    window.location.href = 'https://www.google.com';
});
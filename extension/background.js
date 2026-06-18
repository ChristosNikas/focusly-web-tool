//Checks every time the user goes to a new page
chrome.webNavigation.onCompleted.addListener(async(details)=>{
        


    if (details.frameId !=0)return; //no ads includeded in the scan

    const { focusEnabled } = await chrome.storage.local.get("focusEnabled");
    
    if(!focusEnabled)return;//if focus mode is off then do nothing

    const url= details.url;
    //add a whitelist to avoid blocking search engines and localhost
    const whitelist = [
        'google.com/search',
        'search.brave.com',
        'bing.com/search',
        'duckduckgo.com',
        'localhost'
    ];
    const isWhitelisted = whitelist.some( site => url.includes(site));


    if (isWhitelisted) return; //if the url is whitelisted then do nothing
    
    //checks the blocklist if url is included
    const{blocklist =[]} = await chrome.storage.local.get("blocklist");

    const alreadyBlocked = blocklist.some(site => url.includes(site));

    if(alreadyBlocked){
        
        blockTab(details.tabId,url);
        return;
    }
    try{
        
        const response = await fetch("http://localhost:3000/classify", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({url})
        });
        const result = await response.json();
        

        if (result.distracting){
            const hostname= new URL(url).hostname;//get the hostname from the url

            //add to blocklist
            const updatedBlocklist = [...blocklist, hostname];
            await chrome.storage.local.set({blocklist : updatedBlocklist});
           

            //Finally block the tab
            blockTab(details.tabId, url, result.reason);

        }
    } catch (error){
        console.error("Focus server didn't make it:",error.message);
    }
}, {url:[{schemes:["http","https"]}]});//check only http and https urls

function blockTab(tabId,originalUrl,reason=""){
    const blockedPage = chrome.runtime.getURL("blocked.html")
    + "?url=" + encodeURIComponent(originalUrl)
    + "&reason=" + encodeURIComponent(reason);

    chrome.tabs.update(tabId, {url: blockedPage});
    
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse) =>{
    //when user enable/disable focus mode
    if (message.type === "TOGGLE FOCUS"){
        chrome.storage.local.set({ focusEnabled: message.enabled});
        sendResponse({success:true});
    }
    //when user deleted teh blocklist 
    if(message.type === "CLEAR BLOCKLIST"){
        chrome.storage.local.set({blocklist:[]});
        sendResponse({success:true});
    }
});


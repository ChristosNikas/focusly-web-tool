//Add references to our html by id
const toggleBtn = document.getElementById("toggleBtn");
const statusText = document.getElementById("status");
const blockedList = document.getElementById("blockedList");
const clearBtn = document.getElementById("clearBtn");


//Check if focus moide is on or off and updated teh UI
async function updateUI(){
    const { focusEnabled = false } = await chrome.storage.local.get("focusEnabled");

    if (focusEnabled){
        toggleBtn.textContent = "Stop Focus Mode";
        statusText.textContent = "Focus Mode: ON";

        //change the color when on go green
        toggleBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        toggleBtn.classList.add("bg-red-600", "hover:bg-red-700");
    }
    else{
        toggleBtn.textContent = "Start Focus Mode";
        statusText.textContent = "Focus Mode: OFF";
        
        //change the color when off go red
        toggleBtn.classList.remove("bg-red-600", "hover:bg-red-700");
        toggleBtn.classList.add("bg-green-600", "hover:bg-green-700");
    }
    //update the blocklist
    renderBlockedList();
}
//this function shows teh blocked list 
async function renderBlockedList(){
    const { blocklist = []}= await chrome.storage.local.get("blocklist");
    blockedList.innerHTML = "";

    if (blocklist.length === 0 ){
        blockedList.innerHTML = "<li class='text-gray-500'>No blocked sites</li>";
        return;
    }
    //go through the blocklist and create a list item for each blocked site
    blocklist.forEach(site => {
        const li = document.createElement("li");
        li.textContent =site;
        blockedList.appendChild(li);
    });
}
//When button is clicked
toggleBtn.addEventListener("click",async()=>{
    const {focusEnabled = false } = await chrome.storage.local.get("focusEnabled");
    //change the state of focus mode
    const newState = !focusEnabled;

    //check if focus mode is on in order to block sites
    await chrome.storage.local.set({ focusEnabled: newState });

    //send the message to have a response immediately
    chrome.runtime.sendMessage({type: "TOGGLE FOCUS", enabled: newState});

    updateUI(); 
});

//When clear button is clicked
clearBtn.addEventListener("click", async()=>{
    await chrome.storage.local.set({blocklist: []});

    chrome.runtime.sendMessage({type: "CLEAR BLOCKLIST"});
    renderBlockedList();
});
updateUI();

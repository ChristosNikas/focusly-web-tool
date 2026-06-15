require("dotenv").config();

const express=require ("express");
const cors=require("cors");
const axios=require("axios");

const app=express();
app.use(express.json());
app.use(cors());

const API=process.env.API_KEY;



app.post("/classify", async (req, res) => {
    const { url } = req.body;

    if(!url){
        return res.status(400).json({ error: "URL is required" });
    }
    try{
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "nex-agi/nex-n2-pro:free",
                max_tokens: 100,
                messages: [
                    {
                        role: "system",
                        content: `You are a focus assistant.
                        When given a URL, decide if it is distracting or not.
                        Distracting = social media, entertainment, news, videos, games.
                        Productive = work tools, documentation, learning, coding, email.
                        Reply ONLY in this JSON format, nothing else:
                        { "distracting": true or false, "reason": "short reason here" }`
                    },
                    {
                        role: 'user',
                        content: `Is this URL distracting?  ${url}`                     }
                ]
                    
            },
            {
                headers: {
                    "Authorization": `Bearer ${API}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Focusly"
                }
            }
        );
        //take ai response
        const aiResponse = response.data.choices[0].message.content;
        
        //convert json to string
        const result= JSON.parse(aiResponse);

        //send back result
        res.json(result);
    }catch (error){
        console.error("Error calling OpenRouter API:", error.message);
        console.error("Full error:", error.response?.data);  // Add this line
        res.status(500).json({error:"AI classification failed"}); 
    }
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");

});
                
            
    
    

import React, { useEffect, useState } from 'react';
import Groq from "groq-sdk";
const groq = new Groq({ dangerouslyAllowBrowser: true, apiKey: "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" });
const Reply = ({prompt})=>{
    const [response, setResponse] = useState("");
    useEffect(()=>{  
    let airesponse = "";
    async function askgroq(prompt) {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
            {
                "role": "user",
                "content": prompt,
            }
            ],
            "model": "llama3-70b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": true,
            "stop": null
        });
        for await (const chunk of chatCompletion) {
            airesponse+=(chunk.choices[0]?.delta?.content || '');
        }
        setResponse(airesponse);
        }
    askgroq(prompt);
    }, [prompt]);
    
    return (
        <>
        {response}
        </>
    )
}

export default Reply
// Define the Message interface
export interface Message {
    value: string;
    from: 'user' | 'system' | 'assistant';
}

async function huggingfaceLlama(apiKey: string, prompt: string) {
    const apiUrl = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B';
    // Transform the messages into the expected format for the API

    // console.log(`
    //     AI brainbase caller
    //     KEY: ${apiKey}
    //     MESSAGES: ${JSON.stringify(formattedMessages)}
    //     PROMPT: ${prompt}`);

    // Make the API call using fetch
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: `I am Brainbase, a friendly AI assistant mainly for help with programming. You said: ${prompt}. I replied:⠀` })
    });

    // Parse and return the response JSON
    if(!response || (response && !response.ok)) {
        if(response && response.status === 503) {
            return 'API is currently unavailable. Please try again later.';
        }else if(response && response.status === 429) {
            return 'API rate limit exceeded. Please try again later.';
        }else if(response && response.status === 403) {
            return 'API key is invalid. Please check your API key and try again.';
        }
        return 'Error calling API: ' + response.status;
    }
    const data = await response.json();
    // return JSON.stringify(data);
    return data[0].generated_text.split('⠀')[1];
}

async function brainbase(messages: Message[], prompt: string, includeInSystem?: string) {
    try {
        const formattedMessages = [{role:"system",content:`You are Brainbase. A helpful AI assistant made for programmers. The AI model you run on is a heavily modified version of Llama.
Code given should be given without head, body, or html tags, only the inside.
Users may add JS or CSS imports, change file title, export or save as .qpe (quadpad export) using buttons at the bottom of Quadpad.
Keep explanation short unless invoked by the user, giving 1-2 sentence replies when more isnt needed.
Here are the USER's files:
${includeInSystem}`},...messages.map((message) => {
            return {
                role: message.from,
                content: message.value
            };
        })];
        formattedMessages.push({ role: 'user', content: prompt });
    
        let x = await fetch("https://brainbase-api.klash.dev/", {
            method: "POST",
            body: JSON.stringify(formattedMessages)
        })
        let y = await x.json();
        return y.response;
    } catch (ex) {
        console.error(ex);
        return "API error: " + ex;
    }
}

export async function callChatGPT(apiKey: string, messages: Message[], prompt: string, includeInSystem?: string) {
    return await brainbase(messages, prompt, includeInSystem);
}

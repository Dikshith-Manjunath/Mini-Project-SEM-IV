// File: pages/api/generate-itinerary.ts
//Nvidia Llama Nemotron 70b params key: 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
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type ItineraryRequest = {
  destination: string;
  duration: number;
  budget: number;
  travelerType: string;
  interests?: string[];
};

type ItineraryResponse = {
  success: boolean;
  data?: {
    destination: string;
    duration: number;
    budget: number;
    itinerary: {
      day: number;
      title: string;
      activities: {
        time?: string;
        activity: string;
        cost?: number;
        notes?: string;
      }[];
    }[];
    budgetBreakdown: {
      category: string;
      amount: number;
      details?: string;
    }[];
    totalCost: number;
  };
  error?: string;
};

// Initialize the OpenAI client with NVIDIA API endpoint
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY, // Store this in your .env file
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItineraryResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { destination, duration, budget, travelerType, interests } = req.body as ItineraryRequest;

    // Validate required parameters
    if (!destination || !duration || !budget || !travelerType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: destination, duration, budget, and travelerType are required',
      });
    }

    console.time('itinerary-generation');
    console.log('Starting itinerary generation for', destination);

    // Prepare the prompt
    const prompt = createItineraryPrompt({
      destination,
      duration,
      budget,
      travelerType,
      interests: interests || [],
    });

    // Call NVIDIA API instead of Ollama
    const itineraryData = await generateItineraryWithNvidia(prompt);

    console.timeEnd('itinerary-generation');
    console.log('Itinerary generation complete');

    // Return the generated itinerary
    res.status(200).json({
      success: true,
      data: itineraryData,
    });
  } catch (error) {
    console.error('Itinerary generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary. Please try again later.',
    });
  }
}

// Function to create the prompt (unchanged)
function createItineraryPrompt(params: ItineraryRequest): string {
  const { destination, duration, budget, travelerType, interests } = params;
  
  let interestsText = '';
  if (interests && interests.length > 0) {
    interestsText = `The traveler is particularly interested in: ${interests.join(', ')}.`;
  }

  return `
Generate a detailed ${duration}-day travel itinerary for a ${travelerType} traveler visiting ${destination} with a budget of $${budget}.
${interestsText}

Please format the response as a detailed itinerary with:
1. A day-by-day breakdown of activities
2. Estimated costs for each activity where applicable
3. Recommended accommodations that fit the budget
4. Transportation suggestions between locations
5. A budget breakdown by category (accommodation, food, transportation, activities)
6. The total estimated cost of the trip

Make sure the itinerary is realistic, takes into account local travel times, and fits within the specified budget.
Return the response in JSON format with the following structure:
{
  "destination": string,
  "duration": number,
  "budget": number,
  "itinerary": [
    {
      "day": number,
      "title": string,
      "activities": [
        {
          "time": string (optional),
          "activity": string,
          "cost": number (optional),
          "notes": string (optional)
        }
      ]
    }
  ],
  "budgetBreakdown": [
    {
      "category": string,
      "amount": number,
      "details": string
    }
  ],
  "totalCost": number
}`;
}

// New function to use NVIDIA API instead of Ollama
async function generateItineraryWithNvidia(prompt: string) {
  try {
    console.log('Calling NVIDIA API with Llama 3.1 Nemotron model...');
    
    let completeResponse = '';
    
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.5,
      top_p: 1,
      max_tokens: 2048,
      stream: true,
    });

    // Handle streaming response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      completeResponse += content;
    }
    
    console.log('NVIDIA API response complete');
    
    try {
      // Extract JSON from the response using regex
      // This looks for content between JSON code fences (```json and ```)
      const jsonMatch = completeResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      
      let jsonString;
      if (jsonMatch && jsonMatch[1]) {
        // If JSON was found in code block, use that
        jsonString = jsonMatch[1];
      } else {
        // Try to find JSON object directly (without code fences)
        const directJsonMatch = completeResponse.match(/(\{[\s\S]*\})/);
        if (directJsonMatch && directJsonMatch[1]) {
          jsonString = directJsonMatch[1];
        } else {
          throw new Error('No JSON data found in response');
        }
      }
      
      // Parse the extracted JSON
      const itineraryData = JSON.parse(jsonString);
      return itineraryData;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Raw response:', completeResponse);
      throw new Error('Failed to parse itinerary data. The response was not valid JSON.');
    }
  } catch (error) {
    console.error('Error calling NVIDIA API:', error);
    throw new Error('Failed to generate itinerary with language model');
  }
}

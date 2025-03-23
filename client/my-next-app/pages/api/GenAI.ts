import type { NextApiRequest, NextApiResponse } from 'next';

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

    // Prepare the prompt for Ollama
    const prompt = createItineraryPrompt({
      destination,
      duration,
      budget,
      travelerType,
      interests: interests || [],
    });

    // Call Ollama API
    const itineraryData = await generateItineraryWithOllama(prompt);

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

// Function to create the prompt for Ollama
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

// Function to call Ollama API
async function generateItineraryWithOllama(prompt: string) {
  try {
    const response = await fetch('http://localhost:11434/api/generate?Content-Type=application/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3', // or whatever model you're using with Ollama
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response, which should be a JSON string in the response
    const itineraryData = JSON.parse(data.response);
    return itineraryData;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error('Failed to generate itinerary with language model');
  }
}
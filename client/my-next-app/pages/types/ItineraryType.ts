// Define this type somewhere, like in a types.ts file
export type Itinerary = {
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
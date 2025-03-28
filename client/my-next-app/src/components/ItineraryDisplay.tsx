// File: components/ItineraryDisplay.tsx
import React from 'react';

type Activity = {
  time?: string;
  activity: string;
  cost?: number;
  notes?: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: Activity[];
};

type BudgetItem = {
  category: string;
  amount: number;
  details?: string;
};

type ItineraryData = {
  destination: string;
  duration: number;
  budget: number;
  itinerary: ItineraryDay[];
  budgetBreakdown: BudgetItem[];
  totalCost: number;
};

type ItineraryDisplayProps = {
  itinerary: ItineraryData;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  return (
    <div className="bg-black text-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto my-8">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{itinerary.destination}</h1>
        <div className="flex justify-between mt-2">
          <p>{itinerary.duration} Days</p>
          <p>Budget: ${itinerary.budget}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Itinerary Days */}
        <div className="space-y-8">
          {itinerary.itinerary.map((day) => (
            <div key={day.day} className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Day {day.day}: {day.title}
              </h2>
              <ul className="space-y-4">
                {day.activities.map((activity, index) => (
                  <li key={index} className="flex">
                    {activity.time && (
                      <div className="text-gray-500 w-24 flex-shrink-0">
                        {activity.time}
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="text-gray-800">{activity.activity}</p>
                        {activity.cost !== undefined && (
                          <p className="text-gray-600 ml-4">${activity.cost}</p>
                        )}
                      </div>
                      {activity.notes && (
                        <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Budget Breakdown */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Breakdown</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {itinerary.budgetBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                <div>
                  <p className="font-medium">{item.category}</p>
                  {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                </div>
                <p className="font-medium">${item.amount}</p>
              </div>
            ))}
            <div className="flex justify-between py-2 mt-2 font-bold">
              <p>Total Cost</p>
              <p>${itinerary.totalCost}</p>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {itinerary.totalCost <= itinerary.budget ? (
                <p className="text-green-600">✓ Within budget</p>
              ) : (
                <p className="text-red-600">⚠ Over budget by ${(itinerary.totalCost - itinerary.budget).toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
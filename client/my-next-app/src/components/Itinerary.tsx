// File: components/ItineraryForm.tsx
import React, { useState } from 'react';
import type { Itinerary } from '../../pages/types/ItineraryType';

type ItineraryFormProps = {
  onItineraryGenerated: (itinerary: Itinerary) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const ItineraryForm: React.FC<ItineraryFormProps> = ({ 
  onItineraryGenerated, 
  isLoading, 
  setIsLoading 
}) => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    budget: 1000,
    travelerType: 'solo',
    interests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'budget' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests.split(',').map(interest => interest.trim()).filter(Boolean),
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        onItineraryGenerated(result.data);
      } else {
        console.error('Error generating itinerary:', result.error);
        alert('Failed to generate itinerary. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800">Generate Your Travel Itinerary</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            placeholder="e.g., Tokyo, Japan"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="1"
            max="30"
            value={formData.duration}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            min="100"
            step="100"
            value={formData.budget}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="travelerType" className="block text-sm font-medium text-gray-700">Traveler Type</label>
          <select
            id="travelerType"
            name="travelerType"
            value={formData.travelerType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends Group</option>
            <option value="business">Business</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
          <textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g., food, history, museums, outdoor activities"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
      >
        {isLoading ? 'Generating...' : 'Generate Itinerary'}
      </button>
    </form>
  );
};

export default ItineraryForm;
import type { HouseholdData } from '../types';

const API_URL = import.meta.env.VITE_API || 'http://localhost:8080';

export async function calculateFootprint(household: HouseholdData) {
  const requestResponse = await fetch(`${API_URL}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ household }),
  });
  return requestResponse.json();
}

export async function fetchAverage() {
  const requestResponse = await fetch(`${API_URL}/api/listAverage`);
  return requestResponse.json();
}



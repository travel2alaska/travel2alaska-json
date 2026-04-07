import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const NPS_API_KEY = process.env.NPS_API_KEY || 'DEMO_KEY';
const NPS_URL = 'https://developer.nps.gov/api/v1/parks?stateCode=ak&limit=50';
const DATA_DIR = path.join(__dirname, '../../data/destinations');

// Ensure destination directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Map NPS park codes to our internal region enums
// Options: southcentral, southeast, interior, arctic, southwest
const REGION_MAP: Record<string, string> = {
  'dena': 'interior',     // Denali
  'wrst': 'interior',     // Wrangell-St Elias (spans SC/Interior, generally Interior)
  'glba': 'southeast',    // Glacier Bay
  'klgo': 'southeast',    // Klondike Gold Rush
  'sitk': 'southeast',    // Sitka
  'kejf': 'southcentral', // Kenai Fjords
  'katm': 'southwest',    // Katmai
  'lacl': 'southwest',    // Lake Clark
  'ania': 'southwest',    // Aniakchak
  'alag': 'southwest',    // Alagnak
  'gaar': 'arctic',       // Gates of the Arctic
  'kova': 'arctic',       // Kobuk Valley
  'noat': 'arctic',       // Noatak
  'cakr': 'arctic',       // Cape Krusenstern
  'bela': 'arctic',       // Bering Land Bridge
  'yuch': 'interior'      // Yukon-Charley Rivers
};

function determineRegion(parkCode: string): string {
  return REGION_MAP[parkCode.toLowerCase()] || 'interior'; // Default fallback
}

// Convert NPS Activities array to a flat string array
function parseActivities(activities: any[]): string[] {
  if (!activities || !Array.isArray(activities)) return [];
  // Take top 10 activities to simplify
  return activities.map(a => a.name.toLowerCase().replace(/\s+/g, '-')).slice(0, 10);
}

// Map Topics into our 'tags' array
function parseTags(topics: any[]): string[] {
  if (!topics || !Array.isArray(topics)) return [];
  return topics.map(t => t.name.toLowerCase().replace(/\s+/g, '-')).slice(0, 10);
}

async function ingestParks() {
  try {
    console.log(`Fetching parks from NPS API for Alaska...`);
    const response = await axios.get(NPS_URL, {
      headers: { 'X-Api-Key': NPS_API_KEY }
    });

    const parks = response.data.data;
    console.log(`Successfully fetched ${parks.length} parks.`);

    let written = 0;

    for (const park of parks) {
      // Create object aligning with destination.schema.json
      const destination = {
        id: park.parkCode.toLowerCase(),
        name: park.fullName || park.name,
        region: determineRegion(park.parkCode),
        coordinates: [
          parseFloat(park.longitude),
          parseFloat(park.latitude)
        ],
        tags: parseTags(park.topics),
        activities: parseActivities(park.activities)
      };

      // Basic validation: ensure coordinates parsed correctly
      if (!destination.coordinates[0] || !destination.coordinates[1] || isNaN(destination.coordinates[0])) {
         // Some parks don't have distinct lat/lng at the macro level
         console.warn(`Skipping ${destination.name}: Invalid coordinates`);
         continue;
      }

      const filePath = path.join(DATA_DIR, `${destination.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(destination, null, 2));
      written++;
      console.log(`\u2705 Wrote ${destination.name} to ${destination.id}.json`);
    }

    console.log(`\nIngestion complete! Total generated destinations: ${written}`);

  } catch (error: any) {
    console.error('Failed to fetch from NPS API:', error?.response?.data || error.message);
    process.exit(1);
  }
}

ingestParks();

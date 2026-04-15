interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Google Maps MCP Pack — geocoding, places, directions, distance matrix, elevation.
 * Uses Google Maps Platform APIs (API key based, not OAuth).
 * Expects GOOGLE_MAPS_API_KEY injected via gateway env or BYO via _context.
 */


const API = 'https://maps.googleapis.com/maps/api';

// API key is passed via _context.google_maps.apiKey (injected by gateway or BYO)
// For now, use a hardcoded approach — the gateway can inject it later
interface MapsContext {
  google_maps?: { apiKey: string };
}

function getKey(args: Record<string, unknown>): string {
  const ctx = (args._context ?? {}) as MapsContext;
  delete args._context;
  const key = ctx.google_maps?.apiKey ?? (args._apiKey as string);
  delete args._apiKey;
  if (!key) throw new Error('Google Maps API key required. Pass via _context or _apiKey parameter.');
  return key;
}

async function mapsFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Maps API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'maps_geocode',
    description: 'Geocode an address to latitude/longitude coordinates.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        address: { type: 'string', description: 'Address to geocode (e.g., "1600 Amphitheatre Parkway, Mountain View, CA")' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['address', '_apiKey'],
    },
  },
  {
    name: 'maps_reverse_geocode',
    description: 'Reverse geocode coordinates to an address.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        lat: { type: 'number', description: 'Latitude' },
        lng: { type: 'number', description: 'Longitude' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['lat', 'lng', '_apiKey'],
    },
  },
  {
    name: 'maps_place_search',
    description: 'Search for places nearby a location (restaurants, hotels, etc.).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "pizza near Times Square")' },
        location: { type: 'string', description: 'Center point as "lat,lng" (optional)' },
        radius: { type: 'number', description: 'Search radius in meters (max 50000, default 5000)' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['query', '_apiKey'],
    },
  },
  {
    name: 'maps_place_details',
    description: 'Get detailed info about a place (address, phone, hours, reviews, rating).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        place_id: { type: 'string', description: 'Google Place ID' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['place_id', '_apiKey'],
    },
  },
  {
    name: 'maps_directions',
    description: 'Get directions between two locations.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        origin: { type: 'string', description: 'Starting point (address or "lat,lng")' },
        destination: { type: 'string', description: 'End point (address or "lat,lng")' },
        mode: { type: 'string', description: 'Travel mode: driving, walking, bicycling, transit (default: driving)' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['origin', 'destination', '_apiKey'],
    },
  },
  {
    name: 'maps_distance_matrix',
    description: 'Get travel distance and time between multiple origins and destinations.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        origins: { type: 'string', description: 'Pipe-separated origins (e.g., "New York|Boston")' },
        destinations: { type: 'string', description: 'Pipe-separated destinations (e.g., "Philadelphia|Washington DC")' },
        mode: { type: 'string', description: 'Travel mode: driving, walking, bicycling, transit' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['origins', 'destinations', '_apiKey'],
    },
  },
  {
    name: 'maps_elevation',
    description: 'Get elevation data for locations.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        locations: { type: 'string', description: 'Pipe-separated "lat,lng" pairs (e.g., "39.7391,-104.9847|36.4555,-116.8666")' },
        _apiKey: { type: 'string', description: 'Google Maps API key' },
      },
      required: ['locations', '_apiKey'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const key = getKey(args);

  switch (name) {
    case 'maps_geocode':
      return mapsFetch(`${API}/geocode/json?address=${encodeURIComponent(args.address as string)}&key=${key}`);

    case 'maps_reverse_geocode':
      return mapsFetch(`${API}/geocode/json?latlng=${args.lat},${args.lng}&key=${key}`);

    case 'maps_place_search': {
      const params = new URLSearchParams({ query: args.query as string, key });
      if (args.location) params.set('location', args.location as string);
      if (args.radius) params.set('radius', String(args.radius));
      return mapsFetch(`${API}/place/textsearch/json?${params}`);
    }

    case 'maps_place_details':
      return mapsFetch(`${API}/place/details/json?place_id=${args.place_id}&key=${key}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,website,price_level,types,geometry`);

    case 'maps_directions': {
      const params = new URLSearchParams({
        origin: args.origin as string,
        destination: args.destination as string,
        key,
      });
      if (args.mode) params.set('mode', args.mode as string);
      return mapsFetch(`${API}/directions/json?${params}`);
    }

    case 'maps_distance_matrix': {
      const params = new URLSearchParams({
        origins: args.origins as string,
        destinations: args.destinations as string,
        key,
      });
      if (args.mode) params.set('mode', args.mode as string);
      return mapsFetch(`${API}/distancematrix/json?${params}`);
    }

    case 'maps_elevation':
      return mapsFetch(`${API}/elevation/json?locations=${encodeURIComponent(args.locations as string)}&key=${key}`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 5 } } satisfies McpToolExport;

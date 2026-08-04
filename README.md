# mcp-google_maps

Google Maps MCP Pack — geocoding, places, directions, distance matrix, elevation.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `maps_geocode` | "Geocode [address] via Google Maps" / "Google Maps coordinates of [place]" / "lat lng for [address] using Google" — convert an address to lat/lng + formatted address via Google Maps Platform. Premium-quality geocoding (highest accuracy for US addresses); requires Google Maps API key. Use when Mapbox/MapTiler/OpenStreetMap miss the address. |
| `maps_reverse_geocode` | "Reverse geocode [lat,lng] via Google Maps" / "what address is at [coords] in Google" — coordinates → address via Google Maps Platform. Requires Google Maps API key. Use when you need Google's street-address parsing (most accurate for US). |
| `maps_place_search` | "Find restaurants / hotels / coffee shops / [businesses] near [location]" / "nearby [type] within [radius]" / "places to eat in [area]" — find nearby businesses and points of interest via Google Maps Places. Returns names, addresses, Google ratings, distances. Premium-quality POI data; requires Google Maps API key. Use over Yelp/OSM when you want Google's POI coverage and ratings. |
| `maps_place_details` | "Hours / phone / reviews of [business]" / "Google business info for [place]" / "is [restaurant] open" — full details for a Google Place: address, phone, hours, website, ratings, user reviews. Requires a place ID from `maps_place_search`. Use after search to drill into one specific business. |
| `maps_directions` | "Google Maps directions from A to B" / "transit / public-transport directions" / "bus / subway / train route" / "best way to get from [X] to [Y]" — turn-by-turn directions via Google Maps. Modes: driving, walking, transit (bus/subway/train), bicycling. Requires Google Maps API key. PREFER over Mapbox/OpenRouteService specifically for public-transit routing — Google has the best transit data. |
| `maps_distance_matrix` | "Travel time matrix between [N] origins and [M] destinations" / "drive-time grid via Google Maps" / "transit times between addresses" — N×M distance and duration matrix between many points via Google Maps. Modes: driving, walking, bicycling, transit. Use for delivery routing, multi-stop optimization, transit-heavy planning. |
| `maps_elevation` | "Elevation at [coords] via Google" / "altitude / height above sea level" — elevation in meters for one or more lat/lng pairs via Google Maps Elevation API. Pipe-separated locations for batch queries. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "google_maps": {
      "url": "https://gateway.pipeworx.io/google_maps/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Google_maps data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

# mcp-google_maps

Google Maps MCP Pack — geocoding, places, directions, distance matrix, elevation.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `maps_geocode` | Convert an address to coordinates. Returns latitude, longitude, and formatted address. Use when you need to locate a place on a map. |
| `maps_reverse_geocode` | Convert coordinates to a street address. Returns formatted address, city, state, and country. Use to identify what\'s at a specific location. |
| `maps_place_search` | Find nearby places by type (e.g., restaurants, hotels, parks). Returns names, addresses, ratings, and distances within a radius (in meters). |
| `maps_place_details` | Get full details for a place: address, phone, hours, website, and user reviews. Use with a place ID from search results. |
| `maps_directions` | Get turn-by-turn directions between locations. Returns route, distance, duration, and waypoints. Specify mode: driving, walking, transit, or biking. |
| `maps_distance_matrix` | Calculate travel distance and time between multiple location pairs. Returns matrix with distances and durations for specified mode: driving, walking, transit, or biking. |
| `maps_elevation` | Get elevation in meters for coordinates. Returns elevation and location data. Use to check altitude or terrain height. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

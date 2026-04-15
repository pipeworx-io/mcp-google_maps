# mcp-google_maps

Google Maps MCP Pack — geocoding, places, directions, distance matrix, elevation.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `maps_geocode` | Geocode an address to latitude/longitude coordinates. |
| `maps_reverse_geocode` | Reverse geocode coordinates to an address. |
| `maps_place_search` | Search for places nearby a location (restaurants, hotels, etc.). |
| `maps_place_details` | Get detailed info about a place (address, phone, hours, reviews, rating). |
| `maps_directions` | Get directions between two locations. |
| `maps_distance_matrix` | Get travel distance and time between multiple origins and destinations. |
| `maps_elevation` | Get elevation data for locations. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "google_maps": {
      "url": "https://gateway.pipeworx.io/google_maps/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use google_maps
```

## License

MIT

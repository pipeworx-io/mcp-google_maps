# mcp-google_maps

Google Maps MCP Pack — geocoding, places, directions, distance matrix, elevation. Uses Google Maps Platform APIs (API key based, not OAuth). Expects GOOGLE_MAPS_API_KEY injected via gateway env or BYO via _context.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1856+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/google_maps/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1856+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/maps_geocode`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-google_maps` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/google_maps/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "google_maps": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-google_maps"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Google_maps data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

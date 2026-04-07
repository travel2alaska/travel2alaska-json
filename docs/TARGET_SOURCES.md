# Primary Data Extraction Targets

Based on the data aggregation pipeline mapped in the architectural blueprint, the extraction engine targets a combination of authoritative governmental APIs, localized municipal directories, and major commercial travel platforms. Here is the operational breakdown of the primary sources:

## 1. Government, Infrastructure, and Geographic Data (APIs)
* **National Park Service (NPS) API:** Essential for authoritative data on park facilities, operating hours, campgrounds, and real-time hazard alerts.
* **Alaska 511 (DOT&PF):** Their REST API provides critical real-time infrastructure data, including road conditions, traffic events, wildfire perimeters, and active webcams.
* **State of Alaska Open Data Portals:** The Department of Natural Resources (DNR) Geoportal is the source for geospatial land and resource mapping, while the Department of Environmental Conservation provides boundaries for protected state wildlife areas and sanctuaries.
* **NOAA Alaska Fisheries API:** Provides public bottom trawl survey data, which is highly useful for correlating ocean health with sport-fishing tourism.

## 2. Transit and Scheduling Feeds
* **Alaska Marine Highway System (AMHS):** A primary source for state ferry schedules and historical passenger traffic volumes.
* **Alaska Railroad:** Crucial for extracting northbound and southbound train schedules across the state.
* **Cruise Line Agencies of Alaska:** They maintain comprehensive port schedules and vessel arrival times for major hubs like Juneau, Ketchikan, and Glacier Bay.
* **Aviation APIs:** The Alaska Airlines developer API can be targeted for commercial flight data and schedules, supplemented by public airport arrival/departure feeds from hubs like Anchorage (ANC) and Fairbanks (FAI).

## 3. Official State and Regional Tourism Directories
* **Travel Alaska:** The official state portal is a goldmine for categorizing destinations, ecotours, cultural experiences, and specific accommodation amenities (like accessibility or pet-friendliness).
* **Regional Destination Marketing Organizations:** Websites like Visit Anchorage and Explore Fairbanks provide localized business directories, member listings, and comprehensive regional event calendars.

## 4. Commercial Aggregators and Review Sites
* **TripAdvisor and Major OTAs:** These platforms must be scraped (using proxies and browser automation/Playwright) to extract user reviews, star ratings, dynamic hotel/flight pricing, and overall consumer sentiment.

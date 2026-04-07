# Travel2Alaska JSON Data Layer

This repository is the central public data engine for Travel2Alaska and its associated sites. It acts as the "source of truth" to power Next.js programmatic page generation and automated publishing.

## Structure
* `/schemas`: JSON Schemas defining the strict structure for destinations, listings, events, etc.
* `/data`: Structured reality—manually curated and worker-ingested datasets for Alaska travel points of interest.
* `/scripts`: Utility tools for validating and standardizing data.
* `/workers`: Cloudflare worker ingest automation scripts.

## How it works
External data (events, business listings, permits) are ingested via Cloudflare Workers, normalized against schemas, and checked in here.
Hosting providers (Next.js/Cloudflare Pages) pull directly from this dataset to auto-generate thousands of SEO-rich destination and category pages.

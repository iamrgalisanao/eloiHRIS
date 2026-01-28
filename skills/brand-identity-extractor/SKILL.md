---
name: brand-identity-extractor
description: Scrape and extract visual brand identity data from a website including colors, typography, images (logos, hero), and UI styling effects. Use when needing to recreate a website's look and feel, understand brand guidelines, or gather assets for design.
---

# Brand Identity Extractor

This skill uses the Firecrawl API to gather brand identity data from a provided URL.

## Core Workflow

### 1. Data Gathering
- Use `firecrawl_scrape` with `formats: ["branding", "markdown"]` to get initial design tokens and full page content.
- Use `firecrawl_extract` with the schema in [branding_schema.md](references/branding_schema.md) to get structured brand data.
- Search for "logo", "brand", "style", "icons" within the scraped markdown to find additional asset URLs.

### 2. Manual Analysis & Refinement
- Inspect the `branding` output from `firecrawl_scrape` for specific CSS values (HEX codes, font-family names).
- Identify "Hero" or "Header" images in the markdown and verify their relevance to the brand.
- Look for component-specific styling (e.g., button border-radius, shadows, hover animations).

### 3. Reporting & Artifact Creation
- **IMPORTANT**: After extraction, use the structured data to generate a new brand guidelines markdown file.
- Use the [brand_guide_template.md](assets/brand_guide_template.md) as a starting point.
- The resulting file should be saved in the project's `directives/` or `docs/` folder for future reference (e.g., `directives/brand-guidelines-<domain>.md`).
- Ensure all image URLs are validated and clickable.

## Best Practices
- **Verify Images**: Always check if the images pulled are high-resolution and relevant. Favicons and small icons should be categorized separately from hero images.
- **Color Accuracy**: If the scraped HEX codes seem off (e.g., pure black/white), double-check the `branding` format output for more nuanced color tokens.
- **Typography**: Check if fonts are standard Google Fonts or custom web fonts. This helps in implementation.

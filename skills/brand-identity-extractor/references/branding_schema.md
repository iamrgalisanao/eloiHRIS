{
  "type": "object",
  "properties": {
    "brand_name": { "type": "string" },
    "colors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "hex": { "type": "string" },
          "usage": { "type": "string", "description": "e.g. primary, secondary, background, accent" }
        }
      }
    },
    "typography": {
      "type": "object",
      "properties": {
        "primary_font": { "type": "string" },
        "secondary_font": { "type": "string" },
        "body_font": { "type": "string" }
      }
    },
    "images": {
      "type": "object",
      "properties": {
        "logos": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": { "type": "string" },
              "alt_text": { "type": "string" },
              "type": { "enum": ["main", "monochrome", "symbol", "favicon"] }
            }
          }
        },
        "hero_images": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": { "type": "string" },
              "description": { "type": "string" }
            }
          }
        }
      }
    },
    "ui_elements": {
      "type": "object",
      "properties": {
        "button_styles": { "type": "string", "description": "Border radius, shadows, hover effects" },
        "card_styles": { "type": "string" },
        "animation_notes": { "type": "string" }
      }
    }
  },
  "required": ["brand_name", "colors", "typography", "images"]
}

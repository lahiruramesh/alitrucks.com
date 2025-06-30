{
  "$schema": "https://design-tokens.org/schema.json",

  /* ─── GLOBAL TOKENS ───────────────────────────────────────────── */
  "color": {
    "sustainability": {
      "green": {
        "50":  { "value": "#F0FDF4" },   // lightest green
        "100": { "value": "#DCFCE7" },
        "200": { "value": "#BBF7D0" },
        "300": { "value": "#86EFAC" },
        "400": { "value": "#4ADE80" },
        "500": { "value": "#22C55E" },   // main sustainability green
        "600": { "value": "#16A34A" },   // darker shade
        "700": { "value": "#15803D" },
        "800": { "value": "#166534" },
        "900": { "value": "#14532D" }    // darkest green
      },
      "electric": {
        "50":  { "value": "#F0F9FF" },   // electric blue tints
        "100": { "value": "#E0F2FE" },
        "200": { "value": "#BAE6FD" },
        "300": { "value": "#7DD3FC" },
        "400": { "value": "#38BDF8" },
        "500": { "value": "#0EA5E9" },   // electric blue
        "600": { "value": "#0284C7" },
        "700": { "value": "#0369A1" },
        "800": { "value": "#075985" },
        "900": { "value": "#0C4A6E" }
      }
    },
    
    /* ─── PUBLIC APP THEME (Sustainability Focus) ─────────────── */
    "public": {
      "primary": { "value": "#22C55E" },          // sustainability green
      "primaryHover": { "value": "#16A34A" },
      "primarySoft": { "value": "#DCFCE7" },
      "secondary": { "value": "#0EA5E9" },        // electric blue accent
      "secondaryHover": { "value": "#0284C7" },
      "secondarySoft": { "value": "#E0F2FE" },
      "background": { "value": "#FFFFFF" },
      "surface": { "value": "#F8FAFC" },          // subtle gray
      "border": { "value": "#E2E8F0" },
      "textPrimary": { "value": "#1E293B" },
      "textSecondary": { "value": "#64748B" },
      "textMuted": { "value": "#94A3B8" }
    },

    /* ─── ADMIN APP THEME (Professional Focus) ────────────────── */
    "admin": {
      "primary": { "value": "#0F172A" },          // dark slate
      "primaryHover": { "value": "#1E293B" },
      "primarySoft": { "value": "#F1F5F9" },
      "secondary": { "value": "#22C55E" },        // sustainability green
      "secondaryHover": { "value": "#16A34A" },
      "secondarySoft": { "value": "#DCFCE7" },
      "background": { "value": "#FFFFFF" },
      "surface": { "value": "#F8FAFC" },
      "surfaceDark": { "value": "#F1F5F9" },
      "border": { "value": "#E2E8F0" },
      "borderDark": { "value": "#CBD5E1" },
      "textPrimary": { "value": "#0F172A" },
      "textSecondary": { "value": "#475569" },
      "textMuted": { "value": "#64748B" },
      "sidebar": { "value": "#FFFFFF" },
      "sidebarBorder": { "value": "#E2E8F0" }
    },

    /* ─── SHARED STATE COLORS ──────────────────────────────────── */
    "state": {
      "success": { "value": "#22C55E" },          // sustainability green
      "warning": { "value": "#F59E0B" },
      "danger":  { "value": "#EF4444" },
      "info":    { "value": "#0EA5E9" }           // electric blue
    }
  },

  "space": {
    "0":  { "value": "0px" },
    "1":  { "value": "4px" },
    "2":  { "value": "8px" },
    "3":  { "value": "12px" },
    "4":  { "value": "16px" },
    "5":  { "value": "24px" },
    "6":  { "value": "32px" },
    "7":  { "value": "40px" }
  },

  "radius": {
    "sm":  { "value": "4px" },
    "md":  { "value": "8px" },                    // cards & inputs[1]
    "lg":  { "value": "12px" },                   // carousel images[1]
    "pill":{ "value": "9999px" }                  // chips[1]
  },

  "font": {
    "family": {
      "base":      { "value": "\"Airbnb Cereal\", Helvetica, sans-serif" },
      "monospace": { "value": "SFMono-Regular, Consolas, monospace" }
    },
    "size": {
      "xs":  { "value": "12px" },
      "sm":  { "value": "14px" },                 // price caption[1]
      "md":  { "value": "16px" },                 // body text[1]
      "lg":  { "value": "20px" },                 // card title[1]
      "xl":  { "value": "24px" },                 // section title[1]
      "2xl": { "value": "32px" }
    },
    "weight": {
      "regular": { "value": "400" },
      "medium":  { "value": "600" },
      "bold":    { "value": "700" }
    },
    "lineHeight": {
      "tight": { "value": "1.2" },
      "base":  { "value": "1.45" },
      "loose": { "value": "1.6" }
    }
  },

  "shadow": {
    "sm": { "value": "0 1px 2px rgba(0,0,0,0.06)" },
    "md": { "value": "0 2px 8px rgba(0,0,0,0.08)" },           // cards[1]
    "lg": { "value": "0 4px 16px rgba(0,0,0,0.10)" }
  },

  "breakpoint": {
    "sm": { "value": "600px" },
    "md": { "value": "900px" },
    "lg": { "value": "1200px" },
    "xl": { "value": "1536px" }
  },

  "z": {
    "dropdown":   { "value": 1000 },
    "overlay":    { "value": 1100 },
    "modal":      { "value": 1200 },
    "popover":    { "value": 1300 },
    "tooltip":    { "value": 1400 }
  },

  /* ─── COMPONENT ALIASES ───────────────────────────────────────── */
  "components": {
    
    /* ─── PUBLIC APP COMPONENTS ────────────────────────────────── */
    "public": {
      "button": {
        "base": {
          "padding":   "{space.3} {space.5}",
          "radius":    "{radius.pill}",
          "fontSize":  "{font.size.md}",
          "fontWeight":"{font.weight.medium}"
        },
        "primary": {
          "bg":        "{color.public.primary}",
          "color":     "{color.public.background}",
          "hoverBg":   "{color.public.primaryHover}",
          "shadow":    "{shadow.sm}"
        },
        "secondary": {
          "bg":        "{color.public.secondary}",
          "color":     "{color.public.background}",
          "hoverBg":   "{color.public.secondaryHover}",
          "shadow":    "{shadow.sm}"
        },
        "outline": {
          "bg":        "{color.public.background}",
          "color":     "{color.public.primary}",
          "border":    "1px solid {color.public.primary}",
          "hoverBg":   "{color.public.primarySoft}"
        }
      },

      "input": {
        "height":     "48px",
        "padding":    "{space.4}",
        "radius":     "{radius.md}",
        "border":     "1px solid {color.public.border}",
        "focusBorder":"2px solid {color.public.primary}",
        "bg":         "{color.public.background}"
      },

      "card": {
        "radius":     "{radius.lg}",
        "bg":         "{color.public.background}",
        "shadow":     "{shadow.md}",
        "padding":    "{space.5}",
        "imgRadius":  "{radius.lg}",
        "hoverShadow": "{shadow.lg}"
      },

      "navbar": {
        "height":     "80px",
        "bg":         "{color.public.background}",
        "border":     "1px solid {color.public.border}",
        "shadow":     "{shadow.sm}"
      },

      "searchBar": {
        "bg":         "{color.public.surface}",
        "radius":     "{radius.pill}",
        "fieldGap":   "{space.5}",
        "height":     "56px",
        "boxShadow":  "{shadow.md}",
        "hoverShadow": "{shadow.lg}"
      }
    },

    /* ─── ADMIN APP COMPONENTS ─────────────────────────────────── */
    "admin": {
      "button": {
        "base": {
          "padding":   "{space.2} {space.4}",
          "radius":    "{radius.md}",
          "fontSize":  "{font.size.sm}",
          "fontWeight":"{font.weight.medium}"
        },
        "primary": {
          "bg":        "{color.admin.primary}",
          "color":     "{color.admin.background}",
          "hoverBg":   "{color.admin.primaryHover}",
          "shadow":    "{shadow.sm}"
        },
        "secondary": {
          "bg":        "{color.admin.secondary}",
          "color":     "{color.admin.background}",
          "hoverBg":   "{color.admin.secondaryHover}",
          "shadow":    "{shadow.sm}"
        },
        "outline": {
          "bg":        "{color.admin.background}",
          "color":     "{color.admin.textSecondary}",
          "border":    "1px solid {color.admin.border}",
          "hoverBg":   "{color.admin.surface}"
        }
      },

      "input": {
        "height":     "40px",
        "padding":    "{space.3}",
        "radius":     "{radius.md}",
        "border":     "1px solid {color.admin.border}",
        "focusBorder":"2px solid {color.admin.secondary}",
        "bg":         "{color.admin.background}"
      },

      "card": {
        "radius":     "{radius.md}",
        "bg":         "{color.admin.background}",
        "shadow":     "{shadow.sm}",
        "padding":    "{space.4}",
        "hoverShadow": "{shadow.md}"
      },

      "table": {
        "headerBg":   "{color.admin.surface}",
        "borderColor": "{color.admin.border}",
        "stripedBg":  "{color.admin.surface}",
        "hoverBg":    "{color.admin.surfaceDark}"
      },

      "sidebar": {
        "bg":         "{color.admin.sidebar}",
        "border":     "1px solid {color.admin.sidebarBorder}",
        "width":      "256px",
        "itemRadius": "{radius.md}",
        "itemPadding": "{space.3}",
        "activeBg":   "{color.admin.secondarySoft}",
        "activeColor": "{color.admin.secondary}",
        "hoverBg":    "{color.admin.surface}"
      },

      "header": {
        "height":     "64px",
        "bg":         "{color.admin.background}",
        "border":     "1px solid {color.admin.border}",
        "shadow":     "{shadow.sm}"
      },

      "badge": {
        "radius":     "{radius.pill}",
        "padding":    "{space.1} {space.2}",
        "fontSize":   "{font.size.xs}",
        "success": {
          "bg":       "{color.admin.secondarySoft}",
          "color":    "{color.admin.secondary}"
        },
        "warning": {
          "bg":       "#FEF3C7",
          "color":    "#92400E"
        },
        "danger": {
          "bg":       "#FEE2E2",
          "color":    "#DC2626"
        }
      }
    },

    /* ─── SHARED COMPONENTS ────────────────────────────────────── */
    "shared": {
      "calendar": {
        "cellSize":   "40px",
        "radius":     "{radius.sm}",
        "selectedBg": "{color.sustainability.green.500}",
        "selectedColor": "#FFFFFF",
        "hoverBg":    "{color.sustainability.green.100}"
      },

      "chip": {
        "padding":    "{space.1} {space.3}",
        "radius":     "{radius.pill}",
        "fontSize":   "{font.size.sm}",
        "default": {
          "bg":       "{color.sustainability.green.100}",
          "color":    "{color.sustainability.green.700}"
        },
        "electric": {
          "bg":       "{color.sustainability.electric.100}",
          "color":    "{color.sustainability.electric.700}"
        }
      },

      "modal": {
        "overlayBg":  "rgba(15, 23, 42, 0.75)",
        "radius":     "{radius.lg}",
        "shadow":     "{shadow.lg}",
        "maxWidth":   "32rem"
      }
    }
  },

  /* ─── THEME CONFIGURATIONS ────────────────────────────────────── */
  "themes": {
    "public": {
      "name": "AliTrucks Public - Sustainability Focus",
      "description": "Clean, eco-friendly design emphasizing electric vehicle sustainability",
      "primaryColor": "{color.public.primary}",
      "accentColor": "{color.public.secondary}",
      "mood": "fresh, trustworthy, environmentally conscious"
    },
    "admin": {
      "name": "AliTrucks Admin - Professional Focus", 
      "description": "Clean, data-focused interface for efficient platform management",
      "primaryColor": "{color.admin.primary}",
      "accentColor": "{color.admin.secondary}",
      "mood": "professional, efficient, organized"
    }
  }
}


Breakpoint strategy
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)  
- Desktop: > 1024px (lg+)
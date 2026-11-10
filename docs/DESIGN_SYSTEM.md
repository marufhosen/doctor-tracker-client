# Design system foundation

The interface uses Geist with a clinical teal, jade, and muted iris palette. UI
code consumes semantic tokens (`background`, `foreground`, `primary`, `muted`,
`accent`, `border`, `ring`, and chart/sidebar roles) rather than palette literals.

## Essential contrast checks

Ratios use WCAG relative luminance and meet the 4.5:1 AA threshold for normal
text.

| Foreground | Background | Ratio |
| --- | --- | ---: |
| `#145c63` clinical teal | `#ffffff` | 7.66:1 |
| `#24343b` dark slate | `#f7f9f8` warm off-white | 12.19:1 |
| `#607278` accessible muted text | `#f7f9f8` warm off-white | 4.76:1 |
| `#4f4377` iris text | `#ece9f5` iris surface | 7.30:1 |
| `#edf3f2` dark-mode text | `#16262c` dark background | 13.88:1 |
| `#102a2e` dark text | `#70c9bd` dark-mode primary | 7.74:1 |

The originally suggested `#687a80` muted text reaches only 4.24:1 on the warm
background, so the semantic muted foreground is intentionally darkened to
`#607278`.

The foundation also defines a 44px control height, visible iris focus ring,
restrained card shadow, responsive heading typography, and a global reduced-motion
fallback. Component-specific tasks may extend these tokens but should not replace
them with hardcoded colors.

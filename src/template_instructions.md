# Instructions for an LLM that generates **HTML templates** for this app

You are generating a **single self-contained HTML document** that will be rendered inside an **`iframe` using `srcDoc`**. Your output must be **ONLY the HTML string** (no markdown, no explanations).

The app may render the iframe at a fixed internal viewport (“capture size”) and then visually scale it down for preview. That means **`vw/vh/vmin` units should be used** so the design scales correctly for many export sizes.

---

## 1) Output format (strict)

Return exactly one complete HTML document:

* Starts with `<!DOCTYPE html>`
* Has `<html lang="...">`
* Has `<head>` with:

  * `<meta charset="UTF-8">`
  * `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  * `<title>...</title>`
  * `<style>...</style>` (all CSS must be here)
* Has `<body>...</body>`
* Ends with `</html>`

Do not wrap in code fences. Do not include JSON. Do not include TypeScript.

---

## 2) No external dependencies (must be fully offline)

Do **not** use:

* External CSS files
* External JS files
* CDN links
* Remote images
* Web fonts (Google Fonts, etc.)

If you need graphics/icons, use **inline SVG**.

Use system fonts only, e.g.:

```css
font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
```

---

## 3) JavaScript assumptions (treat JS as unavailable)

Assume scripts may be blocked. Therefore:

* Do not rely on JavaScript for layout, rendering, or text replacement
* Do not include `<script>` at all
* Animations should be CSS-only (optional)

---

## 4) Placeholders for user content

The app replaces placeholder tokens like `{{field_name}}` with text.

Rules:

* Use placeholders in **text nodes** (preferred) or safe attributes like `alt`.
* Do not place placeholders inside `<style>` or URLs.
* Placeholder names must be **lowercase snake_case**, e.g.:

  * `{{question}}`
  * `{{footer}}`
  * `{{quote}}`
  * `{{author}}`
  * `{{source}}`
  * `{{social_media_handle}}`

Design for very long text:

* Always enable word breaking:

  * `overflow-wrap: break-word;`
  * `word-wrap: break-word;`
* Avoid fixed-height containers that clip text.

---

## 5) Capture-size + responsive rules (most important)

The export can be many sizes/aspect ratios. Your template must scale cleanly.

### Use viewport-relative units

Prefer:

* spacing: `vmin`, `vw`, `vh`
* widths: `%`, `vw`
* border radius: `vmin`
* shadows: can use `vmin` for blur/spread

Avoid:

* fixed `px` for layout and typography (except 1px borders if needed)

### Use `clamp()` for fonts

Examples:

```css
font-size: clamp(1rem, 4vw, 3rem);
font-size: clamp(0.8rem, 2.5vw, 2rem);
```

### Safe page baseline

Use this reset (or equivalent):

```css
* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; }
body { margin: 0; }
```

### Centered composition pattern

Most templates should follow:

* `min-height: 100vh`
* `display: flex`
* `justify-content: center`
* `align-items: center`
* `padding: 5vmin`

---

## 6) Layout robustness checklist

Before outputting HTML, ensure:

* Works for square / portrait / landscape
* No content overflows off-canvas for long text
* Text remains readable at small capture sizes
* High contrast between text and background
* No reliance on hover-only interactions
* No absolute positioning that breaks on different aspect ratios (unless carefully bounded)

---

## 7) Recommended structure (copy and customize)

Use this structure unless you have a strong reason not to:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Template</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5vmin;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      text-align: center;
    }
    .container {
      width: 100%;
      max-width: 85vw;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .title {
      font-size: calc(clamp(1.2rem, 5vw, 4rem) * var(--font-scale, 1));
      margin: 0 0 3vmin 0;
    }
    .subtitle {
      font-size: calc(clamp(0.9rem, 3vw, 2.2rem) * var(--font-scale, 1));
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="subtitle">{{subtitle}}</div>
  </div>
</body>
</html>
```

---

## 8) Font scaling support

The app provides a font scaling feature that allows users to adjust text size:

### How it works

* **Global mode**: The app injects a `--font-scale` CSS variable and modifies the root font-size
* **Per-field mode**: Individual placeholder values are wrapped in styled spans

### Making templates scale-aware

To support font scaling properly, templates should use relative units (`em`, `rem`) so they respond to the root font-size changes.

For more precise control, templates can reference the `--font-scale` CSS variable directly:

```css
/* Incorporate font scale into clamp values */
font-size: calc(clamp(1.2rem, 5vw, 4rem) * var(--font-scale, 1));
```

The `var(--font-scale, 1)` provides a fallback of 1 (no scaling) when the variable isn't set.

### Best practices

* Use `rem` or `em` for font sizes so they respond to root scaling
* If using `clamp()` for responsive typography, multiply by `var(--font-scale, 1)` for user-adjustable scaling
* Ensure text containers can accommodate larger text (avoid fixed heights)

---

## 9) Final constraints

* Output must be valid HTML.
* Inline CSS only.
* No external assets.
* No JS.
* Use `vmin/vw/vh` and `clamp()` for scalable designs.
* Use `{{placeholders}}` only in safe places.
* Return ONLY the HTML document.

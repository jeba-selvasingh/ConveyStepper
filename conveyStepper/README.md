## ConveyStepper

Configurable horizontal stepper for multi-step flows. Supports an optional header bar, clickable/enableable steps, and themable colors.

**Widget ID:** `mendix.conveystepper.ConveyStepper`  
**Platform:** Web  
**Entity context required:** No  
**Offline capable:** Yes

## Features

- Configurable list of steps (caption, enabled, on click)
- Active step driven by a Mendix integer expression (1-based)
- Completed / active / pending visuals
- Label only under the active step (`Step N` + caption)
- Optional header: title, icon, pop-out, close
- Theme colors configurable in Studio Pro

## Installation

1. Build the widget (`npm run build`) or use an existing package.
2. Import `dist/1.0.0/mendix.ConveyStepper.mpk` into your Mendix app (**App** → **Add widget packages** / Marketplace upload).
3. Place **Convey Stepper** on a page from the Toolbox.

## Configuration reference

Properties are grouped in Studio Pro as **General**, **Header**, and **Colors**.

### General

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| **Active step** | Expression (`Integer`) | Yes | `1` | 1-based index of the current step. Steps with a lower index are completed; equal is active; higher are pending. |
| **Steps** | Object list | Yes (add at least one) | — | Ordered list of step definitions. Order in Studio Pro is the visual left-to-right order. |

#### Steps (object list item)

Each row under **Steps** has:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| **Caption** | Text template | Yes | — | Label shown next to the `Step N` badge when this step is active. |
| **Enabled** | Expression (`Boolean`) | Yes | `true` | When `false`, the step node is muted and not clickable. |
| **On click** | Action | No | — | Microflow / nanoflow / other action run when an **enabled** step is clicked. If unset, the step is not clickable even when enabled. |

**Step state rules (runtime):**

| Condition | Visual state |
|-----------|----------------|
| Step number &lt; **Active step** | Completed (checkmark + completed color; connector to next may be completed color) |
| Step number = **Active step** | Active (larger node + badge + caption) |
| Step number &gt; **Active step** | Pending (muted outlined node) |

**Click rules:**

- Clickable only when **Enabled** is `true` **and** **On click** is configured and can execute.
- Disabled steps use reduced opacity and `not-allowed` cursor.

### Header

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| **Show header** | Boolean | Yes | `true` | Shows the title bar above the stepper. When `false`, other header properties are hidden in Studio Pro. |
| **Title** | Text template | No | — | Header title. If empty at runtime, falls back to `Inbound Call Process`. |
| **Icon** | Icon | No | — | Optional Mendix icon. If empty, a built-in phone icon is shown. |
| **Show pop-out button** | Boolean | Yes | `true` | Shows the pop-out / external-link button on the right of the header. |
| **On pop-out** | Action | No | — | Action when the pop-out button is clicked. |
| **Show close button** | Boolean | Yes | `true` | Shows the close (X) button on the right of the header. |
| **On close** | Action | No | — | Action when the close button is clicked. |

Studio Pro notes:

- If **Show header** is off, title/icon/button properties are hidden.
- If a header button is shown but its action is empty, the widget editor warns (button still renders).

### Colors

All color values are CSS color strings (typically hex). Leave blank to use the default.

| Property | Type | Required | Default | Used for |
|----------|------|----------|---------|----------|
| **Completed color** | String | No | `#26a69a` | Completed step nodes and completed connectors |
| **Active color** | String | No | `#44566c` | Active step node and `Step N` badge |
| **Pending fill color** | String | No | `#eef1f4` | Pending step node fill |
| **Pending border color** | String | No | `#c5ccd4` | Pending step node border |
| **Connector color** | String | No | `#d5dae0` | Incomplete connectors between steps |
| **Text color** | String | No | `#1f2a37` | Captions and header title/icon color |
| **Header background** | String | No | `#f5f7fa` | Header bar background (only relevant when header is shown) |

## Usage examples

### Basic setup

1. Add a page variable or attribute, e.g. `CurrentStep` (`Integer`), default `1`.
2. Set **Active step** to `$CurrentStep` (or your attribute).
3. Add four **Steps** with captions, for example:
   1. `Search or Add Member`
   2. `Verify PHI`
   3. `Reason For Call`
   4. `Summary`
4. For each step, set **On click** to a nanoflow that sets `CurrentStep` to that step’s number (`1`–`4`).
5. Optionally restrict later steps with **Enabled**, e.g. `$CurrentStep >= 3` or a business-rule boolean.

### Typical On click pattern

In each step’s **On click** nanoflow:

1. Change `CurrentStep` (or the attribute used by **Active step**) to this step’s number.
2. Optionally run validation or navigation for that step.

### Enable / disable pattern

| Goal | Example **Enabled** expression |
|------|--------------------------------|
| Always clickable | `true` |
| Never clickable | `false` |
| Only completed + current (no jump ahead) | `$CurrentStep >= 1` for step 1, `$CurrentStep >= 2` for step 2, etc., or allow only `stepNumber <= $CurrentStep` |
| Unlock after data is ready | `$Call/IsMemberSelected` |

### Header actions

- **On pop-out** — open in a new page / pop-up / maximize layout.
- **On close** — close page, hide sidebar, or clear the call context.

## Visual behavior summary

- Only the **active** step shows the badge (`Step N`) and caption under the node.
- Completed steps show a checkmark.
- Connectors after completed steps use **Completed color**; remaining connectors use **Connector color**.
- The card includes a border and rounded corners; the header sits above a divider when enabled.

## Development

```bash
npm install
npm run build    # production .mpk in dist/
npm run dev      # watch mode
npm run lint
```

Output package: `dist/<version>/mendix.ConveyStepper.mpk`

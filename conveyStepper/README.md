## ConveyStepper

Configurable horizontal stepper for multi-step flows, with an optional header bar matching the inbound-call process pattern.

## Features

- Configurable list of steps (caption, enabled, on click)
- Active step driven by a Mendix expression (1-based)
- Completed / active / pending visuals
- Label only under the active step (`Step N` + caption)
- Optional header: title, icon, pop-out, close
- Theme colors configurable in Studio Pro

## Usage

1. Import `dist/1.0.0/mendix.ConveyStepper.mpk` into your Mendix project.
2. Place **Convey Stepper** on a page.
3. Set **Active step** to an integer expression.
4. Add **Steps**:
   - **Caption** — label for the step
   - **Enabled** — `true`/`false` expression (disabled steps are not clickable)
   - **On click** — nanoflow/microflow to change the active step (or any other logic)
5. Optionally configure **Header** and **Colors**.

### Typical On click pattern

In each step’s On click nanoflow, set your page/context active-step attribute to that step’s number (1, 2, 3…).

## Development

1. `npm install`
2. `npm run build` or `npm run dev`
3. Use the `.mpk` from `dist/`

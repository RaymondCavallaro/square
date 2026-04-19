# The Square

Concept test for a small event-driven web system inspired by the social and economic ideas behind the webnovel backdrop [Taking Ground](https://www.wattpad.com/story/410067124-taking-ground).

Made largely with AI.

## What This Is

This repository is an open prototype for exploring a simple loop:

- people declare what they want
- they commit weight to show priority
- other people choose declarations to resolve
- completed work transfers weight back into the system
- earned weight can help clear the resolver's own priorities

It is intentionally small and browser-first.

## Current Prototype

The current version is a plain browser app with:

- separated GUI and system logic
- event-driven communication through a small event bus
- declarations
- weight commitment
- resolution intents
- acquisition plan ordering
- local activity log
- `localStorage` persistence

## Project Structure

- `index.html` is the browser entry point
- `styles/` contains the CSS files
- `lib/core/` contains shared infrastructure like the event bus
- `lib/system/` contains state, selectors, actions, and rules
- `lib/ui/` contains rendering and DOM controllers
- `app/` contains app boot logic

## Status

This is a concept test, not a finished product.

The goal right now is to keep the architecture easy to change while the concept becomes clearer.

## Notes

- This repository is public-facing and meant for experimentation.
- The webnovel link above is the narrative backdrop that motivated the concept work.
- The current implementation uses mock users and local in-browser data only.

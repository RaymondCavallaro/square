# Language

- Versão em Portugues : [README.md](README.md)
- English version (this one)

# The Square

Early claim-based coordination prototype for a small event-driven web system inspired by the social and economic ideas behind the webnovel backdrop [Taking Ground](https://www.wattpad.com/story/410067124-taking-ground).

This phase still uses the language of declarations, intents, and acquisition plans, but the repository now treats those pieces as the first reduced form of a system centered on claims, exposed weight, structured resolution, and progressive memory.

The mini system keeps rules and interface separate. The system layer manages early claims, resolution proposals, exposed commitment, and an early memory trail. The UI only emits events and renders state.

Made largely with AI.

## What This Is

This repository is an open prototype for exploring a simple coordination loop:

- people frame early claims through the current declaration model
- they expose priority by committing weight
- other people submit resolution proposals
- completed work transfers weight back into the system
- earned weight can help clear the resolver's own early claims

It is intentionally small and browser-first.

## Migration Vocabulary

During Phase 1, the project uses the following bridge vocabulary:

- declaration -> early claim
- resolution intent -> resolution proposal
- committed weight -> exposed commitment
- activity log -> early memory trail

This does not mean renaming everything at once.
It means documenting the current implementation as a reduced, still-simplified version of the broader target model.

## Current Prototype

The current version is a plain browser app with:

- separated GUI and system logic
- event-driven communication through a small event bus
- early claims represented as declarations
- visible weight commitment
- resolution proposals still modeled in code as intents
- acquisition plan ordering
- local early memory trail
- `localStorage` persistence

## Phase Direction

The goal of this phase is not to copy `tg` literally.

The goal is to make it explicit that the current Square prototype is already moving toward:

- claims as the main unit
- visible commitment through weight
- more structured resolution than a loose task board
- memory that can later grow beyond a flat activity history

The implementation is still earlier and smaller than that direction, but the repository now explains the intended framing clearly.

## Project Structure

- `index.html` is the browser entry point
- `styles/` contains the CSS files
- `lib/core/` contains shared infrastructure like the event bus
- `lib/system/` contains state, selectors, actions, and rules
- `lib/ui/` contains rendering and DOM controllers
- `app/` contains app boot logic

## Status

This is a concept test, not a finished product.

The goal right now is to keep the architecture easy to change while the claim-based concept becomes clearer.

## Notes

- This repository is public-facing and meant for experimentation.
- The webnovel link above is the narrative backdrop that motivated the concept work.
- The current implementation uses mock users and local in-browser data only.

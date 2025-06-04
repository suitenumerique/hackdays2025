# 🏆 Final Submission for Element

## Project

Matrix : Element X Web

## Project Description

A next generation Element web/desktop client that aims for simplicity, familiarity, reliability and SPEED! The idea is to combine the matrix-rust-sdk(with its new web bindings) and some of latest Element Web UI components like our newly designed room list to give an impression of the future.

The context:

- Tchap Web, part of Suite Numerique, is a fork of Element Web, which is built on matrix-js-sdk, the first ever Matrix SDK, which is now over 10 years old - and it's _really_ showing its age.

- Meanwhile Element itself is the chat component in ZenDiS's openDesk project.

- Both ZenDiS and DINUM have asked us to transformationally speed up and refresh Element Web.

- Problems include:

  - Super slow login and launch (even with sliding sync) - 10s of mins to login on a large account; 10s of seconds to launch.

  - Massive memory usage

  - No search (on Web)

  - Clunky Electron on Desktop

  - No proper storage in the client (other than the evil sync accumulator)

  - Doubling our dev effort with EX and bug count.

- We already fixed this on mobile with Element X, using our 3rd generation Matrix Rust SDK.

- On Feb 13th we told ZenDiS:

  1. First we MVVM Element Web's UI (progressing well)

  2. Then we implement Element X CSS + UX (progressing well)

  3. Much later, we swap out js-sdk for rust-sdk using rust-sdk-wasm

  4. Later still, we can also swap Electron for Tauri (and WASM for native Rust)

- The hack:

  - Can we take an existing Rust SDK testjig (Aurora) and hook it up to matrix-rust-sdk to have a real, usable, EWX running in browser, in a future-proof (non-PoC!) architecture?

  - Critical missing ingredient: WASM bindings for Rust SDK - provided by Filament; landed on Friday

  - Answer: **yes.**

- For demos, we will show:

  - Show login on EW for a medium-sized account

  - Show login on Aurora - instant

  - ~10x improvement in RAM (150MB; prior to optimisation!)

  - Using same "MVVM" UI components as Element Web - e.g. RoomList.

- We got this working around 6pm yesterday; what's next?

  - Add Search!

  - See how much more we can cram in.

- You can play with it yourself at:

  - <https://dangerousdemos.net>

## Contributors

<a href="https://github.com/marcwadai">@marcwadai</a>, <a href="https://github.com/langleyd">@langleyd</a>, <a href="https://github.com/florianduros">@florianduros</a>, <a href="https://github.com/t3chguy">@t3chguy</a>, <a href="https://github.com/ara4n">@ara4n</a>, <a href="https://github.com/pdelacroix">@pdelacroix</a>, <a href="https://github.com/networkexcption">@networkexcption</a>

## Code base

https://github.com/element-hq/aurora/pull/1

## Deliverables

- Aurora.png in /assets
- Hackdays Element X Web (Shared).pdf
- Aurora.mov
- <https://dangerousdemos.net>

## Key Achievements

Getting some of our recent features and UI components on Element Web transported into the testjig client including: - The new room list and left panel - The new member list

## Challenges Overcome

- Getting the new web matrix-rust-sdk web bindings to compile(they are very fresh 😄)

## Impact

Users will benefit from the use of the rust sdk on web

- A simplified and familiar UX
- Large performance improvements with a faster experience and less use of resources
- Reliability improvements

## Next Steps

- Use this directly for Tchap X Web and Element X Web

# 🏆 Final Submission for IronCalc

## Project
La Suite Calc

## Project Description

Create a simple spreadsheet app for La Suite, based on IronCalc.

## Contributors
<a href="https://github.com/nhatcher">@nhatcher</a>, <a href="https://github.com/scandel">@scandel</a>, <a href="https://github.com/nastaliss">@nastaliss</a>, <a href="https://github.com/sylvinus">@sylvinus</a>

## Code base

https://github.com/suitenumerique/calc

## Deliverables

Demo: https://calc-demo.osc-fr1.scalingo.io/

(Uses ProConnect Identite Sandbox, where everyone can create an account or use a yopmail.com email)

Screenshot attached in /assets (see below)

## Key Achievements

* Creating a new Calc app for La Suite, forked from Docs
* Integrating IronCalc
* Import/export xlsx
* Data persistence
* Simple collaboration

## Challenges Overcome

- Get started and all working together was the first step.
- Bootstrapping and deploying a new app for La Suite had some complexity.
- To get the integration working we needed to modify IronCalc slightly.
- Getting a first simple implementation of collaboration was tricky.

## Impact

For advanced usage and strong data processing, Grist is a great solution,
but it's not a spreadsheet and users are missing simple features like color.

Calc bridges that gap and provides all La Suite users with a simple
collaborative spreadsheet.

## Next Steps

* Add interops with Drive, Grist, and a Docs custom block
* More robust collaboration with CRDTs
* IronCalc roadmap (improve XLSX support, merge cells, charts, conditional formatting, etc.)

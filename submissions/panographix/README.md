# 🏆 Final Submission for Panographix

## Project
![Panographix - Tables and graphs in Docs](https://raw.githubusercontent.com/Theodo-GovTech/hackdays2025/refs/heads/panographix-submission/submissions/panographix/assets/banner.png)

## Project Description

The year is 2025.

The entire planet is using American software.

The whole world?

**No!** The little village of Opensourcix still resist.

Still... more than 50 % of Civil servants admit to using Shadow IT, mostly relying on American services (Microsoft Office, Teams, Notion, Google workspace, etc...), and we know that 3,2 millions Civil servants are required to write docs and analyze complex data.

👉 **We aim to help civil servants better manage data and collaborate more effectively — using sovereign tools.**

We worked on integrating simple databases and charts inside Docs, by relying on the power of Grist.
Public servants can now simply share an interactive, real-time view of their Grist data directly within a document, or build a database or a chart from scratch within a Docs document

## Contributors
<a href="https://github.com/matts2cant">@matts2cant</a>, <a href="https://github.com/anaisberg">@anaisberg</a>, <a href="https://github.com/Clemsazert">@Clemsazert</a>, <a href="https://github.com/ThomasMetzger">@ThomasMetzger</a>, <a href="https://github.com/Marine-choquin">@Marine-choquin</a>

## Code base
[(Link to our forked repo)](https://github.com/Theodo-GovTech/lasuite-docs)

## Deliverables

[Demo video](https://vimeo.com/1090202299?share=copy)


[Panographix - DINUM - 2025.pdf](https://raw.githubusercontent.com/Theodo-GovTech/hackdays2025/refs/heads/panographix-submission/submissions/panographix/assets/pitch_deck.pdf)


![INTERNAL-MEMO-Docs-06-03-2025_03_52_PM](https://raw.githubusercontent.com/Theodo-GovTech/hackdays2025/refs/heads/panographix-submission/submissions/panographix/assets/screenshot.png)

## Key Achievements
Public servants can now easily :
- Build databases from scratch within Docs, with all data stored and synchronized in Grist
- Generate charts from scratch within Docs, with all data stored and synchronized in Grist
- Share a real-time view of their Grist data through an iframe in Docs
- Bonus : Show anything through an iframe in Docs

## Challenges Overcome
- Finding a good open-source charting library which included the chart configuration panel ! Turns out there are not a lot of them, and most of them are outdated or incompatible with the docs stack. We ended-up embedding chartsjs and coding the configuration panel ourselves.
- We would have loved to fetch a grist API key through ProConnect but it is not possible at the mooment. We ended-up hardcoding the API key for now. An alternative solution would be to save it in docs at block-level but it isn't perfect, and grist's CORS policies don't allow calls from a browser. A good long-term solutions might be to use docs's django backend as a gateway to communicate with grist.

## Impact
3,2 M Civil servants (category 1) are required to write docs and analyze complex issues

## Next Steps
- Import from CSV or XLSX
- Make sure the embed block works with pdf export and printing
- Implement more chart types and database views (timeline, kanban, etc...)

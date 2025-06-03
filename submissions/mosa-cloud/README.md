# 🏆 Final Submission for mosa.cloud

<img src="https://raw.githubusercontent.com/NielsCodes/hackdays2025/refs/heads/main/submissions/mosa-cloud/assets/mosa-cloud-horizontal.svg" />

## Project

La Suite Launchpad

## Project Description

The <b>La Suite Launchpad</b> is your starting point in the La Suite ecosystem. It combines data from multiple apps and summarizes it into widgets with bite-sized, actionable information. Configure your dashboard simply by telling Épicentre which information is important to you.

<b>Examples</b>

- Summarize recent changes your coworkers have made to your files
- Summarize the most important conversations from your Matrix chats
- Extract action points from your meetings
- Show Matrix discussions in which you were mentioned

## Contributors

<a href="https://github.com/nielscodes">@nielscodes</a>,
<a href="https://github.com/CasperHollemans">@CasperHollemans</a>,
<a href="https://github.com/rielzzapps">@rielzzapps</a>,
<a href="https://github.com/AleVale">@AleVale</a>

## Code base

<a href="https://gitlab.zzapps.nl/mosa.cloud/hackdays25">mosa.cloud Gitlab</a>

## Deliverables

<a href="https://demo.mosa.cloud">Live demo</a>

---

<img src="https://raw.githubusercontent.com/mosacloud/hackdays-submission/refs/heads/main/submissions/mosa-cloud/assets/screenshot.jpg" />

## Key Achievements

- Customizable and personalized hub as entrypoint into the suite
- Summarize important missed conversations from Matrix
- Summarize updates other people made on your Docs documents
- Summarize meeting, including visual content
- Extract action points from Meet summaries
- Keep an event stream of all important database events to base other actions on
- List recently created Docs and Drive files

## Challenges Overcome

- Combining various data sources into a structured
- Prioritizing information for the end-user
- Finding non-intrusive solution that can hook into any number of other apps in the suite
- Efficiently fetching valuable data
- Docker Hub did not work and poor wifi :(

## Impact

- Greater user acceptance
- Unified experience of the La Suite platform, regardless of apps installed
- Clear place to find information; no more looking for what's important to you

## Next Steps

- Adding more widgets to add cross-application functionality
  - Suggest and automate actions such as create email based on Meet summary or plan meetings based on discussions in Matrix
  - Help prioritize work
- Improving the prioritization of items shown in the Épicentre based on the current user and their work context
- Implement the La Suite MCP endpoints
- Automate the access token generation for Matrix based using OIDC impersonation
- Full-text search, since not every action should be governed by LLMs
- Replace remote LLMs with Ollama (with GPU)
- Allowing third-parties to add arbitrary widgets for their users (would need to look into safe remote code execution)
- General cleanup

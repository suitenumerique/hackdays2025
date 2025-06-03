# 🏆 Final Submission for OpenProject: Hacking Borders

## Project
Docs × OpenProject Integration

## Project Description
**A deep integration between [Docs](https://docs.numerique.gouv.fr/) and [OpenProject](https://www.openproject.org/), thanks to a shared use of [BlockNote](https://www.BlockNotejs.org/). Solved in a generic way that is scalable to others applications for further integration. The benefit for the user is the ability to seamlessly go from a collaborative text draft to a concrete project plan.**


## Contributors
- Wieland Lindenthal (<a href="https://github.com/wielinde">@wielinde</a>),
- Eric Schubert (<a href="https://github.com/kharonus">@kharonus</a>),
- Bruno Pagno (<a href="https://github.com/brunopagno">@brunopagno</a>),
- Dominic Bräunlein (<a href="https://github.com/dominic-braeunlein">@dominic-braeunlein</a>),
- Parimal Satyal (<a href="https://github.com/psatyal">@psatyal</a>)

## Code base
On GitHub: [https://github.com/opf/suitenumerique-docs/pull/1](https://github.com/opf/suitenumerique-docs/pull/1)

The original repository is a fork of Docs but with the added integration with OpenProject. This link is a pull request with the additional code.

[Add other links?]

## Deliverables
*(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)*

## Key Achievements
- A working two-way integration between Docs and OpenProject using open, enterprise-grade standards (eg. OpenID Connect)
- Cross-application user integration (single sign-on)
    - The user logs in once and is identified in as the same user in both systems
    - Actions are attributed to the same user on both platforms
- The integration is built as generic BlockNote blocks, which makes it possible for any other application using BlockNote to also integrate with OpenProject cheaply
- The ability to use Docs as a task management tool: write a bullet list in plain text, easily turn it into a set of tasks in OpenProject.
    - Each one has its own status that can be set in Docs (open/closed) or in OpenProject
	- Tasks can then be assigned, organised in a Kanban board, given dates, followed-up with in OpenProject
- Take a draft text and turn it into a user story or work package in OpenProject
	- These concrete project objects can then have their own lifecycle in a project context along with everything else OpenProject offers out of the box: statuses, workflows, assignees, dates, attachments, meetings, comments, boards, GitLab/GitHub integration, Gantt charts.
- A change in Docs is automatically reflected in OpenProject and vice-versa (a single source of truth to avoid content duplication)
- Integration of BlockNote within OpenProject, in the comments section. This makes it possible to use the same extensions built for Docs also within OpenProject (to demonstrate how reusable and scalable these components are)
- Take text (even rough text) and use an integrated LLM/AI to convert it into a standardised format (eg. a user story based an existing template/form and linguistic style)

## Challenges Overcome
- (Please fill it in, devs)

## Impact
- Users can use Docs the way it was intended, for collaboration and note-taking, but then go from that draft text to a concrete, actionable project plan in OpenProject. This makes it easy for users to go from brainstorming and iterating to structured, organised action easily and without significant barriers.
- Users of European open-source suites like [openDesk 🇩🇪](https://www.opendesk.eu/) and [La suite numérique 🇫🇷](https://lasuite.numerique.gouv.fr/) benefit since seamless integrations such as this one increases user adoption and satisfaction.
- Our approach of using open enterprise-grade standards (in the back-end) and [BlockNote](https://www.BlockNotejs.org/) (in the front-end) lowers the barrier for deep integrations, which are other often costly and complex. This is important because scalable, reusable integrations make our open source ecosystem more useful, more attractive and more powerful.

## Next Steps
- Extract the BlockNote extensions from our prototype into standalone, reusable components that can be easily documented, distributed and maintained
- Explore further integration of Docs and Blocknote (possibly as the main editor for work package descriptions and comments) in OpenProject
- Make it possible to embed complete work package queries defined in OpenProject within a Docs document
- Develop our LLM/AI features so that... (please complete)

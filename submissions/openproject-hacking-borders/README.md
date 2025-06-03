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

We have a [Pull Request](https://github.com/opf/suitenumerique-docs/pull/1) with the changes to docs, introducing new blocks and functionality for the integration.

In addition we provide a [PoC](https://github.com/opf/suitenumerique-docs/pull/4) of how to integrate the docs stack into an local dev stack with OpenProject, Keycloak and other services, using the same SSO authentication for server-to-server communication.

## Deliverables

[Docs - OpenProject integration](./assets/demo_docs_integration.mp4)

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

- The Docs dev stack is currently focused on development on `localhost`
  - Running multiple compose stacks at once requires to run Docker services without exposed ports and behind domain names
  - We updated the Docker compose (and the Makefile slightly) to enable a full docker based dev env, where the services are located behind a reverse proxy
  - We enabled hot reloads for developing the frontend inside a docker service (thanks Manuel!!!)

- The apps of _La suite_ are not using token exchange to communicate between services. To get around this, we reconfigured our own keycloak so that the `impress` client has a custom client scope, enabling access tokens issued to `docs` being accepted by OpenProject for server-to-server communication

- We were able to take a BlockNote extension from one codebase to another with minimal changes, moving the whole UI and behaviour

- We were running infrastructure changes and updates between three developers and still managed to parallelise work


## Impact
- Users can use Docs the way it was intended, for collaboration and note-taking, but then go from that draft text to a concrete, actionable project plan in OpenProject. This makes it easy for users to go from brainstorming and iterating to structured, organised action easily and without significant barriers.
- Users of European open-source suites like [openDesk 🇩🇪](https://www.opendesk.eu/) and [La suite numérique 🇫🇷](https://lasuite.numerique.gouv.fr/) benefit since seamless integrations such as this one increases user adoption and satisfaction.
- Our approach of using open enterprise-grade standards (in the back-end) and [BlockNote](https://www.BlockNotejs.org/) (in the front-end) lowers the barrier for deep integrations, which are other often costly and complex. This is important because scalable, reusable integrations make our open source ecosystem more useful, more attractive and more powerful.

## Next Steps

- Extract the BlockNote extensions from our prototype into standalone, reusable components that can be easily documented, distributed and maintained
- Explore further integration of Docs and Blocknote (possibly as the main editor for work package descriptions and comments) in OpenProject
- Make it possible to embed complete work package queries defined in OpenProject within a Docs document
- Develop our LLM/AI features so that... (please complete)
- Introduce token exchange in the la suite stack 🚀

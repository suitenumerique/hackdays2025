# 🏆 Final Submission for One Point

## Project
Ideas

## Project Description
Collaborative whiteboard that can be integrated in Meet and Drive

## Contributors
<a href="https://github.com/froissant">@froissant</a>, <a href="https://github.com/Tayteus">@Tayteus</a>, <a href="https://github.com/StanleySweet">@StanleySweet</a>, <a href="https://github.com/SouidanOP">@SouidanOP</a>, <a href="https://github.com/JeanMilleronSE">@JeanMilleronSE</a>

## Code base
[GitHub Repository](https://github.com/froissant/hackdays-2025-team-onepoint)

## Deliverables
[Live demo](https://ideas.froissant.work/)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

# Project Summary

## Key Achievements

- Delivered a working application.
- Demonstrated the feasibility of the solution while remaining **on time**, **within scope**, and **on budget**.
- Provided a clear vision for integrating the tool within *La Suite* tools (e.g. Meet/Visio).

## Challenges Overcome

Building a new tool from scratch in just a few days posed significant challenges. Key hurdles included:

- Managing tight time constraints.
- Familiarising ourselves with the *La Suite* ecosystem and its approach to consistent design integration.
- Constantly balancing trade-offs between limited off-the-shelf tools and fully customised solutions.

## Impact

### Productivity

Enables the creation of simple, visual collaboration canvases for flexible and creative workshops.

### Target Audience

Any team seeking engaging and enjoyable collaborative features during calls—which likely includes most teams. This tool helps them:

- Organise ideas and meetings more effectively.
- Create lasting outputs like summaries and reports.

## Next Steps

Several enhancements are needed to bring the project to completion:

### Architecture

The application currently has 5 moving parts, it would be nice to reduce it to three, Front, Back and Albert AI.

### DevOps

Proper linting and CI/CD. 

### Security

- Account management.
- Roles, permissions, and scopes.
- FranceConnect integration.

### Internationalisation

- Add support for multiple languages and regional settings.

### Dependencies

- Currently relies on [TLDRAW](https://tldraw.dev/).
- A decision is needed: accept the existing watermark or purchase a commercial licence to remove it.

### Performance

The application currently uses static files stored locally. Improvements could include:

- Moving data to a database such as **SQLite**, or a more scalable solution (configurable).
- Using dedicated storage solutions like **Blob Storage** or **S3-compatible** services.

### UI Completion

- Implement missing buttons, e.g. **"Share"**.
- Bind currently inactive elements, such as the burger menus on the Projects page.

### UX Research

- Develop change management and buy-in materials:
  - Communication assets.
  - Train-the-trainer documentation.

### Industrialisation & Scalability

- Prepare the product for broader deployment and future growth.


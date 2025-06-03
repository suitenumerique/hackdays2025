# 🏆 Final Submission for ErgonoGrist

## Project
Improve the UX of Grist features

## Project Description
1. Enable markdown for doc tour.
2. Documentation of the "Gaufre" for Grist
3. Enable Attachment for public forms


## Contributors
<a href="https://github.com/tayflo">@tayflo</a>, <a href="https://github.com/mrdev023">@mrdev023</a>, <a href="https://github.com/ogui11aume">@ogui11aume</a>, <a href="https://github.com/mclegrand">@mclegrand</a>

## Code base
1. markdown for GristDocTour https://github.com/ogui11aume/grist-core/tree/markdown-for-gristdoctour
2. Gaufre
   1. [integration#26](https://github.com/suitenumerique/integration/pull/26) - Allow Gaufre customization, fix relative URL for static html, Github action to build and host it on github pages
   2. [ui-kit#81](https://github.com/suitenumerique/ui-kit/pull/81) - Allow to pass a custom gaufre.js URL through ui-kit uses of Gaufre in `<LaGaufre>`
   3. [drive#205](https://github.com/suitenumerique/drive/pull/205) - Passes an env variable to drive to use a custom gaufre.js in drive - depends on 2.
   4. [docs#1038](https://github.com/suitenumerique/docs/pull/1038) - Passes an env variable to drive to use a custom gaufre.js in docs
   5. [Tests](https://github.com/suitenumerique/integration/commit/266a7af9c7fcd1e3bce85ca09a4dfa8c556965a3) - modification of gaufre contents to point to my hosted services

## Deliverables 

### Custom Gaufre

These screenshot show my nextcloud instance with the custom gaufre (from 5.) and an addition of the Gaufre to my local instance of grist.
![Nextcloud, with a custom Gaufre](assets/nextcloud.png)

![Grist, with a custom Gaufre](assets/gristgaufre.png)

### Grist file upload


## Key Achievements
(Highlight the main features or breakthroughs)

## Challenges Overcome
* Enabling attachments in form in a way that respect Grist principles
* Putting together all the knowledge necessary to configure the waffle (some assets are on private repository in the deployment phase)

## Impact
* Contributes to Grist-core the feature attachment in Grist forms (pull-request). 
  * All community
  * Better UX for file submission
* Contributes to Grist-core the feature MarkDown in GristDocTour, a very 💗 Grist feature
  * All community
  * Better UX for documenting the presentation of Grist documents
* Contribute a reusable easily-added integration UI component for locally hosted set of services

## Next Steps
* Follow-up on pull requests to Grist-core

# 🏆 Final Submission for Handi Access

## Project
Improve accessibility for Docs

## Project Description
Docs needs to be accessible to all. Let's fix the issues taggued with the tag accessibilty

## Contributors
[@Appryll](https://github.com/Appryll/),[@Comete99](https://github.com/Comete99),[@lcanagui](https://github.com/lcanagui)

## Code base
[Code base](https://github.com/Appryll/docs.git)

## Deliverables 
(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

## Key Achievements
Pull Request:
- [Page 403 - the page title](https://github.com/suitenumerique/docs/pull/1042)
- [Importance of the lang attribute on HTML elements](https://github.com/suitenumerique/docs/pull/1037)
- [Dropdown menus - option selection : ajout aria-hidden sur les icônes](https://github.com/suitenumerique/docs/pull/1036)
- [Share document modal](https://github.com/suitenumerique/docs/pull/1045)
- [add role navigation and semantic list to left panel nav](https://github.com/suitenumerique/docs/pull/1047)

## Challenges Overcome
It was difficult to install Docs et deploy it on our work PC.

## Impact
People who have some difficulties to read on screen use screen readers. Accessibilité improve the quality of the transcription for differents use case.
- Error page title: Having clear page titles makes navigation and page identification easier and, most importantly, makes the user experience more efficient.
- Lang attribute: Screen readers use this information to determine the pronunciation of text. Without this attribute, a screen reader might pronounce French with an English accent. This also helps search engines index content. Translation tools can more easily identify the source language and suggest translations.
- Drop down menus: The selection made in dropdown menus must be announced to screen readers.
- Decorative icons must be hidden in order to not be read by screen readers
- Navigation: use list enable the capacity to count the number of element in the navigation menu

## Next Steps
- Continue to implement accessibility issues !
- Ask the [The Open FUN Design System](https://github.com/openfun/cunningham) if their component are accessible. There is no annotation for the little cross to close the modal object for example. 

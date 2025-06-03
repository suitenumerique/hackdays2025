# 🏆 Final Submission for Bib4win

## Project

Docs Bibliography.

## Project Description

Add bibliography generation and a citation tool to Docs using a custom block
and custom inline content.

## Contributors

- [@jmaupetit](https://github.com/jmaupetit)
- [@wilbrdt](https://github.com/wilbrdt)
- [@mathilde-lannes](https://github.com/mathilde-lannes)
- [@flipvh](https://github.com/flipvh)
- [@matthewlipski](https://github.com/matthewlipski)

Special thanks to Maeva that joined us lately!

- [@Maeva-Calmettes](https://github.com/Maeva-Calmettes)

## Code base

Source code of the project can be found in this Docs' fork:

https://github.com/jmaupetit/docs/tree/add-bibliography

A pull-request will be submitted to the official repository when it's ready.

As most changes live in the BlockNote's repository, one should also check this
pull request:

https://github.com/TypeCellOS/BlockNote/pull/1732/

## Deliverables

(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

## Key Achievements

Docs now integrates two new `/` commands:

- `/reference` (aliased to `/cite`) to integrate a citation in the text flow
  using a [DOI](https://fr.wikipedia.org/wiki/Digital_Object_Identifier). Once
  the DOI has been submitted, all reference metadata will be automatically
  fetched to fill the document's bibliography.
- `/bibliography` block that displays active citations in the core text (in
  their order of apparition).

## Challenges Overcome

There was no real technical difficulties, more organisational challenges as we
are a big team!

That being said, one problem we had to face was that the project mostly relies
on the BlockNote project; hence we needed to use temporary builds of this
dependency to integrate and test them in our Docs' fork.

The second issue we didn't expect is that there is no high-quality libraries to
deal with citations or Zotero, maybe there is room for improvement here.

## Impact

Most **researchers** and **students** need to integrate a bibliography in their
writings. It has been reported that it's a **must-have** for them to use Docs.
If we provide a user-friendly [Zotero](https://www.zotero.org) integration, we
will provide a _de facto_ solution allowing them to step out from proprietary
non-sovereign solutions.

## Next Steps

- This contribution should be distributed as standalone package on top of the
  official BlockNote distribution.
- The Zotero integration should be part of this package.
- Bibliography items should be editable in bibtex format.
- Integrate [HAL](https://hal.science) / [ORCID](https://orcid.org) services to
  ease researcher's publication fetching.

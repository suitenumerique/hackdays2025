# 🏆 Final Submission for BigBlueButton

## Project
Embedding Docs into BigBlueButton (BBB + Docs = FTW).

## Project Description
Today, BigBlueButton is the [state webinar system](https://webinaire.numerique.gouv.fr/home).

**The Problem** is a webinar finishes, participants want key information:

 - Details from Attendance, Votes, Notes
 - Full Transcript
 - Summary + Next Steps (AI)

**The Solution** we created was to build upon the new BigBlueButton 3.0 and
 1. Create a new Docs document for each webinar
 2. Embed docs into BigBlueButton using a plug-in (no modifications to core BigBlueButton!)
 3. After meeting finishes, use AI to build and append key information to associated docs 
 4. Make a new recording format that will appear in b3desk.



## Contributors
<a href="https://github.com/ffdixon">@ffdixon</a>, <a href="https://github.com/gustavotrott">@gustavotrott</a>, <a href="https://github.com/tiagojacobs">@tiagojacobs</a>, <a href="https://github.com/guileme">@guileme</a>, <a href="https://github.com/lfzawacki">@lfzawacki</a>, <a href="https://github.com/juliarat">@juliarat</a>

## Code base

Github repository: https://github.com/iMDT/bbb-paris-hackdays/

## Deliverables 

Presentation: [slides](https://docs.google.com/presentation/d/1JBQjVM1ElGICOBYFO_fWIYJSJdqgszDraLQkknZfng4/edit?usp=sharing)

Check out this [demo video](https://youtu.be/FZISNvLitRw). 

## Key Achievements
  1. Wrote a BigBlueButton 3.0 plugin for embedding Docs into a live session
  2. Wrote a new recording processing script to call AI for transcripts (whisper) and create key points (using OpenAI API), which could use an internal AI for DINUM

## Challenges Overcome
  - Since Docs doesn't provide an API for appending, needed to create an API using playwright to append on behalf of the user
  - We had to write a plugin for docs for BigBlueButton 3.0
  - We had to write a new playback format for accessing to Dcos link

## Impact
  - Simplifies post-meeting follow-up by consolidating all relevant data.
  - Reduces cognitive load for participants by generating AI summary and key insights.
  - Improves accountability by clearly documenting responsibilities and decisions.

## Next Steps
  - Refine the interface using BBB and La Suite design system.
  - Explore new functionalities enabled by Docs updates.
  - Conduct user testing to improve usability and identify real-world use cases.


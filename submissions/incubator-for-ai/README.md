# 🏆 Final Submission for Incubator for AI

## Project
@Drive: semantic search for the documents you store in Drive.

## Project Description
Create an API to search within a user's documents in Drive, and demonstrate integration with:
* the Drive UI
* Meet
* Slack
* Claude

## Contributors
<a href="https://github.com/duncanjbrown">@duncanjbrown</a>, <a href="https://github.com/nmenezes0">@nmenezes0</a>, <a href="https://github.com/gecburton">@gecburton</a>, <a href="https://github.com/rachaelcodes">@rachaelcodes</a>

## Code base
[i.AI fork of suitenumerique/drive](https://github.com/i-dot-ai/drive)

[Slack integration](https://github.com/i-dot-ai/slack-drive-search)


## Deliverables
### Drive API endpoint
![image](assets/drive_search_api.png)
### Drive UI integration
![image](assets/drive_search_interface_results.png)

<video src="https://github.com/user-attachments/assets/557ad7fd-6ddc-4449-aadc-160af46c83f1" controls></video>
_Video not working? [The file is here](assets/drive_search_interface_720.mp4)_

### Slack integration

![image](assets/slackbot-screenshot.png)

<video src="https://github.com/user-attachments/assets/8da4234b-5124-43d3-8a22-257ec66b3178" controls></video>
_Video not working? [The file is here](assets/slackbot-recording.mov)_

### Claude integration

<video src="https://private-user-images.githubusercontent.com/23265724/450806742-322a45d4-9801-4a54-b5cc-9eac3e85e863.mov" controls></video>
_Video not working? [The file is here](assets/claude-demo.mov)_

## Key Achievements
Enabling semantic search throughout all documents in Drive and enabling users to do this in the frontend.

Demonstrating that it is possible to integrate @drive search with other La Suite Numerique apps and external apps.

Specific examples from the hackathon:

* Claude
* Slack
* Meet

## Challenges Overcome
Setting up and getting to grips with an unknown codebase in a limited time.
Getting semantic search working in Drive.
Integration with other services: Meet, Claude, Slack.

## Impact
Anyone who knows the information they need is stored in Drive, but just can't remember where it is can now search for it easily. By using semantic search, users don't even need to match the exact text in the document or remember the file name.

Opening up the API to other applications takes Drive functionality beyond the immediate application, putting it at the centre of many workflows. 

## Next Steps
* Clean up code and make sure it's secure
* Opening up integrations with other applications
  * e.g. find your documents from Docs
* Offering filtering options
  * e.g. only searching documents within particular folders
* Generating themes for uploaded documents, allowing users to search by topic
* Adding more metadata to the search results
  * e.g. date created
* Creating a similar API for other SuiteNumerique services
  * e.g. search through your meeting transcripts with @Meet
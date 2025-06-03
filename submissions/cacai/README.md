# 🏆 Final Submission for COAST Team

## Final Project Description
Our contribution addresses two distinct but related challenges.
First, [an issue](https://github.com/suitenumerique/hackdays2025/issues/7)
was raised on the Hackdays GitHub concerning group access to Docs,
how to efficiently grant access to multiple users at once for shared
documents. Second, during discussions with LaSuite experts, including
the CTO, a major concern was highlighted: how to guarantee the
confidentiality of documents, ensuring that no one outside an authorized
group can access the data.

Therefore, we identified the following problem:
**how can we ensure exclusive and secure access for collaborative groups
to their data across all LaSuite applications?**

Our solution answers both of those aspect by proposing an E2EE
implementation plan for La Suite. It is based on an end-to-end encryption
(E2EE) model, using the Messaging Layer Security (MLS), without impacting
the data replication mechanism. This approach enables secure, group-based
collaboration while ensuring complete data confidentiality.

## Contributors
<a href="https://github.com/lisafmt">@lisafmt</a>,
<a href="https://github.com/vicnetto">@vicnetto</a>,
<a href="https://github.com/jpeisenbarth">@jpeisenbarth</a>,
<a href="https://github.com/qachr">@qachr</a>,
<a href="https://github.com/ludop67">@ludop67</a>

## Code base
Our research team at COAST, INRIA, has already developed a solution called
[MultiUser Text Editor (MUTE)](https://github.com/coast-team/mute), a
peer-to-peer, web-based, real-time collaborative editor similar to Docs,
that uses CRDTs (https://inria.hal.science/hal-01655438v1). This main
project is separated into multiple subprojects, divided as:
- [mute-structs](https://gitlab.inria.fr/coast-team/mute/mute-modules/mute-structs): an implementation of the
[LogootSplit](https://gitlab.inria.fr/coast-team/mute/mute-modules/mute-structs#ref-1)
CRDT algorithm.
- [mute-crypto](https://gitlab.inria.fr/coast-team/mute/mute-modules/mute-crypto):
focus on implementing E2EE and could be easily replicated to Docs.

MUTE ressembles Docs function as a collaborative writing work space.
Therefore, we consider MUTE to be a great POC for this project.

## Deliverables 
As a deliverable, we propose an implementation plan outlining how E2EE
could be integrated into the current LaSuite infrastructure, accessible
[here](./assets/Hackathon_Business_plan_E2EE.pdf).

## Key Achievements
By fully encrypting all exchanges, nodes ensure that data can only be read
by the intended recipients. This prevents central servers from accessing,
decrypting and storing clear exchanges in their databases.

Moreover, this solution allows the creation of collaborative groups, in
order to restrain data access to a certain group. This answers La Suite's
problematics surrouding the creation of collaborative groups.

Our initial goal was to implement this secure communication layer into
the LaSuite tools. However, during the hackathon, we did not have enough
time to reproduce the same work done for MUTE. For this reason, our main
objective is to propose a valid architecture that can be integrated into
any of the LaSuite tools in the near future.

## Challenges Overcome
Due to the limited time frame, we were only able to propose an
architecture for future integration. The use of a distributed architecture
also adds complexity to the data encryption process.

## Impact
Our solution directly impacts La Suite's infrastructure by making protecting the user's datas. By adding this
security layer, it ensures full protection against basic man-in-the-middle
attacks. In the current setup, a malicious administrator could potentially
access any content retrieved from the application.

In addition, customers are increasingly concerned about the security of
their personal information. This functionality incentivates adoption by
complying with regulations such as the GDPR, enabling private, secure
data exchange.

Moreover, our solution allows the creation of collaborative groups and
therefore easier group access and easier collaborative work. This answers
one of La Suite's ambition for this hackathon, "making the tools more
usefull for the users".

Finally, the development of La Suite's collaborative features reinforces
European digital sovereignty against American multinational companies
such as Google Docs, Microsoft 365, and Notion. This objective was
emphasized by Stéphanie Schaer during the introductory speech of this
Hackathon.

## Next Steps
In the current infrastructure, group key management is handled by a
centralized server, which introduces a potential single point of failure.
Removing this centralized structure would make La Suite apps more scalable,
reliable, and cost-efficient. However, decentralized key management remains
an ongoing research challenge, which we are currently addressing within the
COAST team at Inria.
# 🏆 Final Submission for Yunohosters

## Project
Docs for Yunohost.

## Project Description

YunoHost is an Debian-based operating system aiming at simplifying server administration and therefore democratize self-hosting while making sure it stays reliable, secure, ethical and lightweight. It is a copyleft libre software project maintained exclusively by volunteers, who have been packaging in a 600+ apps store in the course of 13 years. 

Packaging Docs on YunoHost allows for individuals and small organizations interested in the product to easily deploy with the least technical knowledge required.

[More on Yunohost](https://doc.yunohost.org/admin/what_is_yunohost/)

## Contributors

<a href="https://github.com/DDATAA">@DDATAA</a>, <a href="https://github.com/fflorent">@fflorent</a>, <a href="https://github.com/mjeammet">@mjeammet</a>, <a href="https://github.com/rouja">@rouja</a>, <a href="https://github.com/Maeva-Calmettes">@Maeva</a>

## Code base
https://github.com/YunoHost-Apps/docs_ynh/

## Deliverables 
<video controls src="assets/installation.mp4" title="Démo de l'installation"></video>

## Key Achievements

Install script done. You can now self-host Docs in a few click, without having to trouble yourself with sys admin complexity.
We also support attachments, like images.
Fixed Garage's Yunohost package. Garage is a S3 storage alternative, that might be a good replacement of MiniO after recent changes of policy.

## Challenges Overcome

**How to install Docs without docker ?**

Docs is usually installed using docker but Yunohost is about rebuilding from sources. 

***Which version of Python3.12 ?**

Docs runs on Python 3.12, a relatively recent version of Python which is still not shipped in Debian Bookworm (it should be available in [Trixie](https://packages.debian.org/trixie/python3.13)). Thus, many Yunohost installs won't have native Python 3.12. This caused us a few hesistations. Should we add a ppa to an additional source or recompile Python 3.12 ? In the end, we decided to patch Docs's code (which is very easily done with Yunohost system) to lower requirements to Python 3.11, hoping that no breaking changes happened between 3.11 and 3.12. 

**Authentication**

Docs expects an OIDC identity provider and Yunohost's auth system is currently based on LDAP. We are waiting for a future Yunohost version that would implement an OIDC identity provider natively ([issue](https://github.com/YunoHost/issues/issues/676)). In the meantime, we take advantage of [the Dex package for Yunohost](https://github.com/YunoHost-Apps/dex_ynh) to allow LDAP users authenticate through an OIDC flow.

**S3 storage**

With the recent change of policy from Minio, we decided to work on making our package compatible with Garage, another S3 storage solution. Garage has received some extra attention these days and the corresponding Yunohost package received an update that we helped fixing/merging.

**Websockets**

@rouja used a few sysadmin magic tricks to enable real-time collaboration.

## Impact
Self-hosting and the creation of community is a big stake of all open-source apps - including for La Suite. By allowing smaller structures and individuals to self-host, Yunohost might be a good way to build community around La Suite's apps and turn this public code into small but real uses.

## Next Steps
- Choose a LICENCE
- Support other operations: remove, upgrade, backup, restore, change-url
- Add configurations option?
- Cleanup
- Add documentation for the admins?
- Add Docs to the Yunohost's apps catalog so it is publicly available
- Connect docs with the server's SMTP service to send email
- Maintenance of the package overtime
- Change OIDC to work with Authelia
- Watch compatibility between Python3.12 and Python3.11
- Finish compatibility with Garage ?
- Address future issues, both on Github and the forum

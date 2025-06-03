# 🏆 Final Submission for DGNUm x NixOS Community

## Project

La Suite on NixOS

## Project Description

NixOS packaging of La Suite apps (Drive, Meet, Docs)

We aim to have the most boring demo of all, because it just does what you expect :yawn:

## Contributors

<a href="https://github.com/yu-re-ka">@yu-re-ka</a>, <a href="https://github.com/copeugne">@copeugne</a>, <a href="https://github.com/laurentS">@laurentS</a>

## Code base

https://github.com/NixOS/nixpkgs

## Deliverables

- https://suitedocs.furosu.fr/
- https://suitemeet.furosu.fr/

## Key Achievements

Meet and Docs are deployed to a small scale VPS and ready for use. We don't need a full k8s cluster anymore to have
private docs and meetings.

The setup config is now reproducible by modifying a handful of variables (domain names really).

## Challenges Overcome

Setting up OIDC is still too hard for small scale organisations that don't have an existing one.

We faced many of the usual deployment challenges: a series of unexciting small problems that slowly erode most people's
motivation. None of those are newsworthy, yet they prevent most tech savvy users from actually using sovereign services.

The key challenge still lies in learning Nix to package software nicely. But once these PRs are completed, a basic setup
becomes trivial.

## Impact

Small organisations and even individuals can setup their own instances in a matter of minutes once all that code is
merged into `unstable` nix packages.

## Next Steps

- Complete packaging of `grist`, `drive`, `tchap` and so on.

- Unify services under a single `lasuite` namespace so that the entire suite can be deployed with something like:

```nix
services.lasuite = {
  enable = true;
  domainName = "mysuite.example.com";
};
```

- Integrate some default options for the harder parts, such as OIDC providers...

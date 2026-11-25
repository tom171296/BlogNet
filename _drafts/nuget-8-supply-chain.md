---
layout: post
title: "NuGet 8 and your Software Supply Chain"
subtitle: "How to use NuGet 8's new controls to secure dependencies, harden publishing, and ship safer packages."
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [security, devsecops, csharp, dotnet, supply-chain, nuget]
---

## Intro
- new year, new supply chain updates in the nuget eco system
- .NET 11 comes with NuGet 8

- improved supply chain security features, let's see what changed and how it affects your 

## NuGet Client

### NuGetCooldown
https://learn.microsoft.com/en-us/nuget/consume-packages/minimum-package-publish-age#configure-a-minimum-publish-age


### auto-run scripts
No more auto-run scripts?

## NuGet.org updates

### Staged publishing
- Staged
- Validated
- Proven (presence check?)

### Non-ASCII package IDs are deprecated

### API keys now last 30 days or less
- before nov 1 -> switch to trusted publishing (add link to trusted publishing update)

### Packages come down faster

### NuGet MCP updates
- "Secure my supply chain"

### Ship skills in packages

## Whats next
- package end-of-life status
- NuGet Signing V2 -> fix for digest issues?

## Closing
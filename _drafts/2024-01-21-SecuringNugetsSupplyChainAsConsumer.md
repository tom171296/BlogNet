---
layout: post
title: A Consumer's Guide to Securing NuGet's Supply Chain
subtitle: 
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [tag1, tag2]
---

In an era dominated by digital dependencies, the software supply chain plays a pivotal role in shaping the technology landscape. As consumers, we often download and integrate various packages to enhance the functionality of our applications. NuGet is a package manager for the Microsoft development platform. However, as we embrace the convenience of integrating third-party packages, it becomes imperative to address the lurking shadows of potential vulnerabilities in the software supply chain.

# NuGet's Supply Chain


- What is a software supply chain
    - everything that goes into your software, and where it comes from. the dependencies and properties of your dependencies.

- Risks as a consumer
    - malicious code is purposefully added to a package
    - typos 
    - multiple package sources
        - async call to all sources, 
        - https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610

Manage your dependencies
- Package sources
- Package source mapping
    - Github code space
        - Test if nuget config is automatic created if none is present.
        - Saw this going wrong in the github code space.
- Trusted signers
    - https://learn.microsoft.com/en-us/nuget/consume-packages/installing-signed-packages
- Lock files

Supply Chain security in the pipeline

- Vulnerability scan
- GitHub vulnerable dependencies

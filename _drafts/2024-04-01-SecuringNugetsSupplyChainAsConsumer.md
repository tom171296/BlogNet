---
layout: post
title: A Consumer's Guide to Securing your Nuget Supply Chain
subtitle: 
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [Digital immune system]
---

In an era dominated by digital dependencies, the software supply chain plays a pivotal role in shaping the technology landscape. As consumers, we often download and integrate various packages to enhance the functionality of our applications. NuGet is a package manager for the Microsoft development platform. However, as we embrace the convenience of integrating third-party packages, it becomes imperative to address the lurking shadows of potential vulnerabilities in the software supply chain.

# Software Supply Chain 
Software applications are no longer built entirely from custom code. Instead, they are made up of a variety of third-party components, including open-source libraries, frameworks, and modules. These components are often referred to as dependencies. The software supply chain is the process of managing these dependencies and their security risks.

By defaut, an organization inherits the software supply chain of all parts of its software. This includes the dependencies of the dependencies. This is called the transitive dependencies.

Because of how big and convoluted the software supply chain can be, it is important to understand the risks and how to mitigate them. In this blog we'll discover a few simple basic hygiene steps to secure your software supply chain. 

Many developers appear to be unaware of the risks inherent in the software supply chain. Despite the rapid pace of development and heavy reliance on third-party components, it's concerning how frequently developers downplay the potential security vulnerabilities that could affect their applications. Pressing deadlines and the temptation of fast fixes often result in neglecting security aspects within the software supply chain. It's crucial for developers to acknowledge the importance of prioritizing security awareness, implementing proactive measures to strengthen their development methodologies, and protecting their software from the hidden threats they may inadvertently introduce.

# Knowing what is in your software
Any time a package is installed or reinstalled, which includes being installed as part of a restore proces, Nuget also installs any additional packages on which that first package depends.
Those immediate dependencies might then also have dependencies on their own, which can continue to an arbitrary depth. This produces what's called a dependency graph that describes the relationships between packages at all levels.

The first step of identifying and mitigating risks in the software supply chain is to understand what is in your software. This includes the packages that are directly referenced in your project, as well as the transitive dependencies. With the introduction of the .Net core 3.1 SDK you are able to output the dependency graph of your project. This can be done by running the following command in the root of your project:
`dotnet list package --include-transitive`. With this command you can output the dependency graph of your project.

```
Project 'ChainGuardian' has the following package references
   [net8.0]:
   Top-level Package      Requested   Resolved
   > refit                7.0.0       7.0.0

   Transitive Package               Resolved
   > System.Net.Http.Json           7.0.1
   > System.Text.Encodings.Web      7.0.0
   > System.Text.Json               7.0.3
```
For the packages that are directly referenced, it is quit simple, you can use the `PackageReference` in the projects `.csproj` files to see what packages are referenced.

TODO: write something about the SBOM

 # Risks as a consumer



- Risks as a consumer
    - malicious code is purposefully added to a package
    - typos 
    - multiple package sources
        - async call to all sources, 
        - https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610



TODO:
WHAT ARE THE RISKS?
EXAMPLES OF RISKS
-  Dependency confusion
-  Malicious publishing of packages

# Mitigate these risks

Manage your dependencies
- Package sources
- Package source mapping
    - Github code space
        - Test if nuget config is automatic created if none is present.
        - Saw this going wrong in the github code space.
- Trusted signers
    - https://learn.microsoft.com/en-us/nuget/consume-packages/installing-signed-packages
- Lock files

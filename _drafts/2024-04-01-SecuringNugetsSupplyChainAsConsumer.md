---
layout: post
title: A Consumer's Guide to Securing your Nuget Supply Chain
subtitle: 
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [Digital immune system, supply chain security]
---

In an era dominated by digital dependencies, the software supply chain plays a pivotal role in shaping the technology landscape. As consumers, we often download and integrate various packages to enhance the functionality of our applications. NuGet is a package manager for the Microsoft development platform. However, as we embrace the convenience of integrating third-party packages, it becomes imperative to address the lurking shadows of potential vulnerabilities in the software supply chain.

# Software Supply Chain 
Software applications are no longer built entirely from custom code. Instead, they are made up of a variety of third-party components, including open-source libraries, frameworks, and modules. These components are often referred to as dependencies. The software supply chain is the process of managing these dependencies and their security risks.

By default, an organization inherits the software supply chain of all parts of its software. This includes the dependencies of the dependencies. This is called the transitive dependencies. Because of how big and convoluted the software supply chain can be, it is important to understand the risks and how to mitigate them. In this blog we'll discover a few simple basic hygiene steps to secure your software supply chain. 

Many developers appear to be unaware of the risks inherent in the software supply chain. Despite the rapid pace of development and heavy reliance on third-party components, it's concerning how frequently developers downplay the potential security vulnerabilities that could affect their applications. Pressing deadlines and the temptation of fast fixes often result in neglecting security aspects within the software supply chain. It's crucial for developers to acknowledge the importance of prioritizing security awareness, implementing proactive measures to strengthen their development methodologies, and protecting their software from the hidden threats they may introduce.

# Knowing what is in your software
Any time a package is installed or reinstalled, which includes being installed as part of a restore proces, Nuget also installs any additional packages on which that first package depends. Those immediate dependencies might then also have dependencies on their own, which can continue to an arbitrary depth. This produces what's called a dependency graph that describes the relationships between packages at all levels.

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

Understanding the dependency graph of your software is essential for upholding its integrity and security. It's comparable to familiarizing yourself with the ingredients of a dish before sharing it with others; it ensures that no harmful or unexpected elements jeopardize the quality or safety of your product.

Automating the generation of your dependency graph can streamline and enhance the management of your software projects. Imagine having a dynamic, up-to-date visualization of your software's dependencies at your fingertips, without manual effort. This automation not only saves time but also enhances accuracy and enables proactive decision-making.

One of the primary benefits of automating dependency graph generation is its ability to keep pace with the rapid evolution of software projects. As developers add, update, or remove dependencies, the automated process immediately reflects these changes in the dependency graph. This real-time view ensures that stakeholders are always equipped with the latest insights into their software's composition.

Through the generation and analysis of a Software Bill of Materials (SBOM), encompassing both direct and transitive dependencies, developers attain insight into their software's makeup. SBOMs facilitate enhanced risk management by empowering developers to pinpoint vulnerabilities, monitor licensing obligations, and promptly address security threats or updates within their software supply chain. Furthermore, they promote transparency and collaboration throughout the software development landscape, empowering stakeholders to make well-informed decisions regarding the software they develop, deploy, and utilize.

TODO: ADD STUFF OVER SBOM IN .NET

If you use [Github](https://github.com/) as source control for your project, you can use the dependency graph feature to have a look at the "Top-level packages" that are used by your project. The Github dependecy graph uses the [SPDX format](https://spdx.dev/). A tool that I commonly use to generate the SBOM of my software is [OWASP CycloneDX](https://cyclonedx.org/). This tool can be integrated into your build pipeline to automatically generate the SBOM of your software. The output of this tool (Json or XML) can be used by other tools.

Both the **SPDX** and **CycloneDX** are able to generate a SBOM file for you. There is a difference between the two. The SPDX format is a standard that is used to describe the licenses of the software. The CycloneDX format is a standard that is used to describe the dependencies of the software. Which means that in my opinion the CycloneDX format is more useful in handling identifying and handling vulnerabilities.

# Restoring packages
Using third party packages requires you to restore them via Nuget. All project dependencies that are listed in either a project file or a packages.config file are restored. 

Package restore first installs all the direct dependencies. These are the dependencies that are directly referenced between the `<PackageReference>` tags or `<package>` tags, then installs any dependencies of those packages throughout the entire dependency graph. Nuget will first scan the local global packages or HTTP cache folders. If the required package isn't in the local folders, Nuget tries to download it from all sources that you configured as package source.

What is interesting is that Nuget ignores the order of package sources configured. It first looks in the local NuGet cache, it the package is not present in the case, it fires a request to each package source configured. It uses the package source that responds the **quickest**. This means that by default, you don't have any control from what source you are restoring your packages. If a restore fails, Nuget doesn't indicate the failure until after it checks all sources. Nuget reports a failure ony for the last source in the list. The error implies that the package wasn't present on any of the resources.

TODO - make image of package restore behavior with multipe sources

Package resolution for transative dependencies follows a set of rules. To understand certain risks and how to mitigate them, it is important to understand how Nuget resolves transative dependencies. Before your read further, I recommend you to read the [official documentation](https://learn.microsoft.com/en-us/nuget/concepts/dependency-resolution) on how Nuget resolves transative dependencies.

# Risks as a consumer
Including third-party packages in your software projects introduces a variety of risks that can compromise the integrity and security of your software supply chain. Let's dive more into what some different risks you are exposed to as a consumer of third-party packages.

## Vulnerabilities
If you include software of which you don't know the origin, you are exposed to the risk of including malicious code in your software. There can be vulnerabilities in the package that could be exploited and be used as a backdoor to harm your environment.

Looking at recent history, there a examples of malicious code having a big impact on the world of software development. One of the most famous examples was the finding of a [vulnerability in Log4J](https://www.ncsc.gov.uk/information/log4j-vulnerability-what-everyone-needs-to-know#:~:text=Last%20week%2C%20a%20vulnerability%20was,infect%20networks%20with%20malicious%20software.), an open-source logging library that is widely used by apps and services across the internet. Exploiting this vulnerability, attackers could break into systems, steal passwords and logins, extract data and infect networks.

The Log4J vulnerability is an example of a supply chain attack where attackers where able to exploit a vulnerability that was **implemented unintentionally**. There are several databases filled with vulnerabilties that are known. One of the most famous databases is the [Common Vulnerabilities and Exposures (CVE)](https://cve.mitre.org/). This databases are used by tooling to check if there are any known vulnerabilities in the packages that you are using.

In the scope of securing your Nuget supply chain, there are a few steps you can take. First of all, you can use the `dotnet list package --vulnerable` command to check if there are any known vulnerabilities in the packages that you are using. This command will output a list of all the packages that have known vulnerabilities. 

Following the shift-left principle, you can also use Visual Studio to check if there are any known vulnerabilities in the packages that you are using. Visual Studio has a feature that will show you a warning if you have a vulnerability in your project.

![Visual Studio Vulnerability](/assets/images/2024/SupplyChainSecurity/VS_vulnerable_packages.png)

Starting from .NET 8 (SDK 8.0.100) the `restore` command [can audit]([Auditing package dependencies for security vulnerabilities | Microsoft Learn](https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages)) all your 3rd party packages. Just add the following lines of code to your project file:

```
<NuGetAudit>True</NuGetAudit> 
<NugetAuditMode>All</NugetAuditMode>
<NuGetAuditLevel>low</NuGetAuditLevel>
```

This will make sure that the `dotnet restore` command will audit all your packages for known vulnerabilities. If an error is found, the following message will be displayed:

`
warning NU1903: Package 'System.Text.RegularExpressions' 4.3.0 has a known high severity vulnerability, https://github.com/advisories/GHSA-cmhx-cq75-c4mj
`

To make the actual build fail when a vulnerability is found, you can add the following line to your project file:

`<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`

This line will make sure that the build will fail when a vulnerability is found. This will make sure that you don't introduce a vulnerable package with a new release and forces you to update/patch the vulnerability. Adding the above steps will fail your build, that is something you have to keep in mind. Like for me, if I need to fix a production issue that requires a new build, I am forced to fix the vulnerability this way. You have to keep in mind that this is blokking and figure out a way for your organization to deal with this.

## Dependency confusion
Imagine that you work at a company that uses a private Nuget feed to store all the packages that are used in your software projects. You have a package that is called `MyCompany.Common`. This package is used in all the projects that you are working on. You have a private Nuget feed that contains this package. You have a build pipeline that builds the package and pushes it to the private Nuget feed. Via some way of research, a hacker found the name of your private image used internally (`MyCompany.Common`). The hacker then creates a package with the same name, version and adds some malware/backdoor to the source code and uploads it to the public Nuget feed.

Because of the way a nuget restore works (it uses the first source that responds the quickest), the malicious package from the public Nuget feed can be installed instead of the package from the private Nuget feed. This is called dependency confusion. The hacker is able to inject malicious code into your software without you knowing it. This is a big risk for your software supply chain.

Imagine you are using the package `MyCompany.Common` with version and you reference it in your project file like this `<PackageReference Include="MyCompany.Common" Version="1.0.*" />`. You have a connection to your own private feed and the public Nuget feed. The hacker uploads a package with the name `MyCompany.Common` with version `1.0.1` to the public Nuget feed. When you run a restore, NuGet will restore the package of the hacker because of the resolution rules.

### Mitigation
There are a few things that can be done to mitigate the risk of dependency confusion. The first thing that can be done is to [claim the prefix](https://learn.microsoft.com/en-us/nuget/nuget-org/id-prefix-reservation) of your packages. This means that you claim the prefix of your packages on the public Nuget feed. This way, the public Nuget feed will not allow anyone to upload a package with the same prefix as your packages. This will prevent the hacker from uploading a package with the same name as your package. In the example of `MyCompany.Common`, you would claim the prefix `MyCompany`.




-- How to mitigate
--- package source mapping
--- use a private feed
--- trusted signers


## Typosquatting attack
-- what is typosquatting
-- why are you vulnerable
-- how to mitigate
--- use a private feed
--- trusted signers




## Code signing

-- Code signing
--- What is code signing

## Something about reproducible builds

Another example that shocked the world is the [SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know). In this hack, the attackers inserted a backdoor into the SolarWinds Orion software. This backdoor was then distributed to all customers of SolarWinds. This backdoor was then used to infiltrate the networks of the customers of SolarWinds.

# Conslusion


# References
- [Nuget documentation](https://docs.microsoft.com/en-us/nuget/)
- [Package versioning](https://learn.microsoft.com/en-us/nuget/concepts/package-versioning?tabs=semver20sort#examples)
- [Dependency resolution](https://learn.microsoft.com/en-us/nuget/concepts/dependency-resolution)
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

```shell
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

![Nuget Supply Chain Security](/assets/images/2024/SupplyChainSecurity/nuget-restore.drawio.png)

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

```XML
<NuGetAudit>True</NuGetAudit> 
<NugetAuditMode>All</NugetAuditMode>
<NuGetAuditLevel>low</NuGetAuditLevel>
```

This will make sure that the `dotnet restore` command will audit all your packages for known vulnerabilities. If an error is found, the following message will be displayed:

```shell
warning NU1903: Package 'System.Text.RegularExpressions' 4.3.0 has a known high severity vulnerability, https://github.com/advisories/GHSA-cmhx-cq75-c4mj
```

To make the actual build fail when a vulnerability is found, you can add the following line to your project file:

```XML
<TreatWarningsAsErrors>true</TreatWarningsAsErrors>
```

This line will make sure that the build will fail when a vulnerability is found. This will make sure that you don't introduce a vulnerable package with a new release and forces you to update/patch the vulnerability. Adding the above steps will fail your build, that is something you have to keep in mind. Like for me, if I need to fix a production issue that requires a new build, I am forced to fix the vulnerability this way. You have to keep in mind that this is blokking and figure out a way for your organization to deal with this.

## Dependency confusion
Imagine that you work at a company that uses both a public and a private Nuget feed to retrieve the packages that are used in your software projects. You have a package that is called `MyCompany.Common`. You have a build pipeline that builds the package and pushes it to the private Nuget feed. Via some way of research / reverse engineering, a hacker found the name of your private image used internally (`MyCompany.Common`). The hacker then creates a package with the same name, version and adds some malware/backdoor to the source code and uploads it to the public Nuget feed.

Because of the way a nuget restore works (it uses the first source that responds the quickest), the malicious package from the public Nuget feed can be installed instead of the package from the private Nuget feed. This is called dependency confusion. The hacker is able to inject malicious code into your software without you knowing it. This is a big risk for your software supply chain.

Imagine you are using the package `MyCompany.Common` with version and you reference it in your project file like this `<PackageReference Include="MyCompany.Common" Version="1.0.*" />`. You have a connection to your own private feed and the public Nuget feed. The hacker uploads a package with the name `MyCompany.Common` with version `1.0.1` to the public Nuget feed. When you run a restore, NuGet will restore the package of the hacker because of the resolution rules.

With the way you define your package version references, you can unintentionally introduce a new way your software gets vulnerable for a supply chain attack. It is good to understand how [Nuget semantic versioning works](https://learn.microsoft.com/en-us/nuget/concepts/package-versioning?tabs=semver20sort#references-in-project-files-packagereference) and what the risks are of the way you reference your packages in your project file.

### Mitigation
By default, having both a public and a private feed is a risk. I would recommend to **only use a private feed**. This way you (your company) has control over the packages that are available to your software projects. You can configure Nuget to only use the private feed. The configuration of Nuget goes via a [`nuget.config` file](https://learn.microsoft.com/en-us/nuget/reference/nuget-config-file). This file can be placed in the root of your project or in the root of your solution. 
```XML
<packageSources>
   <clear /> <!-- Clear all other package source configuration besides everything below this line -->
   <add key="private.org" value="https://private-feed.link" protocolVersion="3" /> <!-- Add the private Nuget feed -->
</packageSources>
```

If for some reason you use / require a public feed, there are a few things that you can do to mitigate the risk of dependency confusion. The first thing that can be done is to [claim the prefix](https://learn.microsoft.com/en-us/nuget/nuget-org/id-prefix-reservation) of your packages. This means that you claim the prefix of your packages on the public Nuget feed. This way, the public Nuget feed will not allow anyone to upload a package with the same prefix as your packages. This will prevent the hacker from uploading a package with the same name as your package. In the example of `MyCompany.Common`, you would claim the prefix `MyCompany`. 

The second thing you can do is to configure Nuget to pull certain images from a certain source. So you can configure Nuget to pull the `MyCompany.Common` package from the private feed. Adding package source mapping requires you to configure *ALL* packages that you use in your solution. This means the directly referenced packages, transative packages and other Nuget sources that are used in for example your build pipeline.  This can be done by configuring the `nuget.config` file like this:
```XML
<packageSourceMapping>
   <packageSource key="nuget.org">
      <package pattern="MyCompany.*">
   </packageSource>
</packageSourceMapping>  
```

A third thing that you can do is to configure trusted signers. This means that you can configure Nuget to only accept packages that are signed by a certain trusted signer. This way you can make sure that the packages that you are using are signed by a trusted source. This can be done by configuring the `nuget.config` file like this:
```XML
<config>
   <add key="signatureValidationMode" value="require" /> <!-- Require all signatures of publisher to be validated -->
</config>

<trustedSigners>
   <author name="MyCompany">
      <certificate fingerprint="1234567890" hashAlgorithm="SHA256" allowUntrustedRoot="false" />
   </author>
</trustedSigners>
```

To protect your software from the serious risks of dependency confusion, it's essential to take proactive measures. Start by configuring Nuget to only use a private feed, ensuring control over the packages integrated into your projects. If you must use a public feed, mitigate risks by claiming your package prefix, setting up package source mapping, and configuring trusted signers. Taking these steps will significantly reduce the likelihood of malicious code infiltrating your software supply chain. Act now by reviewing and updating your Nuget configurations to safeguard your projects against these potential vulnerabilities.

## Typosquatting attack
A different way to attack your software supply chain with the focus on your dependencies is by using a typosquatting attack. Typosquatting is a form of cybersquatting that relies on mistakes such as typographical errors made by users when inputting a website address into a web browser. Should a user accidentally enter an incorrect website address, they may be led to an alternative website that could contain malware, phishing scams, or other malicious content.

In .NET we have the command `dotnet add package <package-name>`. This command will add a package to your project. The package name that you provide is used to download the package from the Nuget feed. If you make a typo in the package name, Nuget will try to download the package with the typo in the name. This is where the risk of typosquatting comes in. A hacker can upload a package with a name that is very similar to a popular package. If you make a typo in the package name, Nuget will download the package from the hacker instead of the package from the original author. Looking at the `MyCompany.Common` example, the hacker can upload a package with the name `MyCompany.Commonn` to the public Nuget feed. If you make a typo in the package name, Nuget will download the package from the hacker.

### Mitigation
Some of the mitigations that you did for the dependency confusion attack can also be used for the typosquatting attack.
- Use a private feed, this way you have control over the packages that are available to your software projects.
- Claim the prefix of your packages on the public Nuget feed. This way, the public Nuget feed will not allow anyone to upload a package with the same prefix as your packages.
- Configure trusted signers. This way you can configure Nuget to only accept packages that are signed by a certain trusted signer.

By implementing these proactive measures, you can significantly reduce the risk of typosquatting attacks on your software supply chain. Safeguard your projects against potential vulnerabilities by reviewing and updating your Nuget configurations to protect your software from malicious code infiltration.

## Infiltrated build system
Another example that shocked the world is the [SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know). In this hack, the attackers inserted a backdoor into the SolarWinds Orion software. This backdoor was then distributed to all customers of SolarWinds. This backdoor was then used to infiltrate the networks of the customers of SolarWinds.

In the SolarWinds case, attackers got access to the build system. They inserted malware into the build environment that was used to build the SolarWinds Orion software. This malware was then used to insert a backdoor into the SolarWinds Orion software. This backdoor was then distributed to all customers of SolarWinds. 

All the other attacks that I have described in this blog are about your dependencies and how you can protect yourself from them. A supply chain attack on your build environment is a different kind of attack. You're not in control of the packages that are cached locally on your build server. If a hacker gets access to your build server, they can add malicious code to your local cache. If Nuget decides to use the local cache of the build server to restore the packages, the malicious code will be used in your software.

### Mitigation
To protect your software from the serious risks of an infiltrated build system, it's essential to take proactive measures. Start by securing your build environment. Make sure that only authorized personnel have access to the build environment. Make sure that the build environment is up-to-date with the latest security patches. Make sure that the build environment is monitored for any suspicious activity.

From a .NET perspective, there are mainly two things that I would recommend to make that the build result on your local machine is the same as the build result on the build server.
The first thing that I would recommend is the use of a *package lock file*. With `PackageReference`, Nuget always tries to produce the same closure of package dependencies if the inpat package reference list has not changed. However, there are a few scenarios where it may not be able to do so. Cases where the package graph may change include:
- **Package deletion**, nuget.org doesn't support package deletion, but not all package sources have this constraint.
- **Floating versions**, where the version range is not pinned to a specific version.
- **Package content mismatch**, the same version of a package may have different content on different package sources.

Starting from `Nuget.exe` 4.9 and .NET SDK 2.1.500, you can use a lock file. 
You must enable the lock file by adding the following line to your project file:
```XML
<PropertyGroup>
    <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
</PropertyGroup>
```

This will generate a lock file with all your resolved dependencies in it. You must commit/check-in this lock file to your source control so that it is always available for `restore`.NuGet does a quick check to see if there were any changes in the package dependencies as mentioned in the project file (or dependent projects’ files) and if there were no changes, it just restores the packages mentioned in the lock file without re-evaluating the full package graph. NuGet detects a change in the defined dependencies as enumerated in the project file(s), it re-evaluates the package graph and updates the lock file to reflect the new package graph applicable for the project. This is the default mode and is useful when you are in a development environment actively modifying your package and project dependencies.

Reading this, I hear you think. If the dependency graph is re-evaualted when there are changes in the project file, how does this protect me from an infiltrated build system? Well, by default it doesn't. But you can tell the dotnet restore command to run in a `locked-mode`. You can run the `dotnet restore` command with the `--locked-mode` flag. This will make sure that the lock file is used to restore the packages and that the lock file is not updated. This way you can make sure that the packages that are restored are the same as the packages that are restored on your local machine. Beside the `--locked-mode` flag you can also use the following configuration in your project file:
```XML
<PropertyGroup>
   <!-- assuming you have the MSBuild property (ContinuousIntegrationBuild) set to true -->
   <RestoreLockedMode Condition=<"'$(ContinuousIntegrationBuild)' == 'true'">true</RestoreLockedMode>
</PropertyGroup>
```

The second thing that you can do is setup your .NET build to be a [reproducible build / determenistic](https://reproducible-builds.org/). A reproducible build is a process where you compile the same source code with the same tools and settings, and it always produces the exact same output (like a binary or executable file). In simpler terms, it's like following a recipe to bake a cake: if you use the same ingredients and steps every time, you'll end up with the same cake each time. The key idea is that anyone who has the source code can rebuild the software and get the same result as the original, ensuring nothing has been altered or tampered with along the way. This helps verify that the software you have is trustworthy and hasn't been modified maliciously.

Reproducible builds are enabled by default in .NET SDK projects, but there is an extra property, `ContinuousIntegrationBuild` (also used in last example), that you can set to `true`. This forces the build server to normalize stored file paths. 
```XML
<PropertyGroup Condition="'$(GITHUB_ACTIONS)' == 'true'">
   <ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>
</PropertyGroup>
```

To make your build even more reliable, there a even more project properties that you can set. These properties are:

- `AssemblySearchPaths` - Restrict the reference assembly search path to avoid machine-specific dependencies.
```XML
<PropertyGroup>
   <AssemblySearchPaths>

   </AssemblySearchPaths>
</PropertyGroup>>
```

- `TargetFrameworkRootPath` - This setting enables you to disable msbuild's lookup of the .NET framework sdks thru OS registry. So any malicious sdk installed on the build machine will not be used.
```XML
<PropertyGroup>
   <TargetFrameworkRootPath Condition="'$(BuildingInsideVisualStudio)'!='true'">[UNDEFINED]</TargetFrameworkRootPath>
</PropertyGroup>
```

- `NetCoreTargetingPackRoot` - Disable msbuild's lookup of dotnetcore through default install locations. Instead, resolve from nuget feed.
```XML
<PropertyGroup>
   <NetCoreTargetingPackRoot>[UNDEFINED]</NetCoreTargetingPackRoot>
</PropertyGroup>
```

- `DisableImplicitNuGetFallbackFolder` and `DisableImplicitLibraryPacksFolder` - Disable the extra implicit nuget package caches provided by dotnetsdk.
```XML
<PropertyGroup>
   <DisableImplicitNuGetFallbackFolder>true</DisableImplicitNuGetFallbackFolder>
   <DisableImplicitLibraryPacksFolder>true</DisableImplicitLibraryPacksFolder>
</PropertyGroup>
```

This properties need to be set for each .NET SDK project. To make this more easily for you, there is a Nuget package [dotnet/reproducible-builds](https://github.com/dotnet/reproducible-builds) that sets these properties for you. By implementing these proactive measures, you can significantly reduce the risk of an infiltrated build system. Safeguard your projects against potential vulnerabilities by securing your build environment, enabling package lock files, and setting up reproducible builds. Act now by reviewing and updating your .NET configurations to protect your software from malicious code infiltration.

# Conslusion
In conclusion, securing your NuGet supply chain is essential to safeguarding your software projects from the growing threats of supply chain attacks. The increasing reliance on third-party packages introduces vulnerabilities that can be exploited by malicious actors, as seen in high-profile incidents like the Log4J vulnerability and SolarWinds attack. As a consumer, it's crucial to implement robust security practices, including thorough dependency management, package restoration controls, and proactive measures against dependency confusion and typosquatting.

By understanding your software’s dependency graph and automating the generation of Software Bills of Materials (SBOMs), you can gain visibility into potential risks and ensure that vulnerabilities are swiftly addressed. Additionally, leveraging tools like CycloneDX and implementing safety measures like package locking and source mapping can provide further protection.

Ultimately, staying vigilant and adopting a security-first approach in managing your NuGet packages will help you build resilient software systems. Regularly review your configurations, update your security practices, and monitor your supply chain to stay ahead of emerging threats. With these strategies in place, you can mitigate risks and maintain the integrity of your software projects.


# References
- [Nuget documentation](https://docs.microsoft.com/en-us/nuget/)
- [Package versioning](https://learn.microsoft.com/en-us/nuget/concepts/package-versioning?tabs=semver20sort#examples)
- [Dependency resolution](https://learn.microsoft.com/en-us/nuget/concepts/dependency-resolution)
- [Lock file](https://devblogs.microsoft.com/nuget/enable-repeatable-package-restores-using-a-lock-file/)
- [ContinuousIntegrationBuild](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/msbuild-props#continuousintegrationbuild)
- [MSBuild project properties](https://learn.microsoft.com/en-us/visualstudio/msbuild/common-msbuild-project-properties?view=vs-2022)
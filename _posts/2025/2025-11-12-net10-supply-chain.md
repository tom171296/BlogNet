---
title: ".NET 10: What Changes in Your Supply Chain"
excerpt: See what changes in your supply chain after upgrading to .NET 10
date: 2025-11-12
tags: [security, devsecops, csharp, dotnet, supply-chain, nuget]
published: true
cover-img: /assets/images/2025/net10-supply-chain/header.png
thumbnail-img: /assets/images/2025/net10-supply-chain/header.png
share-img: /assets/images/2025/net10-supply-chain/header.png
---

With .NET 10 LTS, Microsoft continues to strengthen the foundations of a secure and reliable developer ecosystem. While the way you build and ship software remains familiar, several subtle but impactful changes in defaults and new platform features enhance the security and transparency of your software supply chain.

In this post, we will explore the key supply chain improvements introduced with .NET 10 and what they mean for developers upgrading from .NET 8.

These updates focus on making secure practices the default, not an afterthought. From new auditing capabilities and improved visibility into dependency chains to smarter defaults and easier remediation of vulnerabilities, .NET 10 gives developers more control and confidence over the packages that flow through their applications.

## Strong auditing capabilities
With the introduction of [NuGetAudit](https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages#running-a-security-audit-with-restore) 
in NuGet 6.8 (.NET 8), all projects that used the **public** NuGet registry where able to scan their dependencies for known vulnerabilities during 
package restore. `dotnet restore` downloads the required `VulnerabilityInfo` resource from the public NuGet registry and checks all packages in the 
dependency graph against it. The data source for nuget.org is the [GitHub Advisory Database](https://github.com/advisories?query=type:reviewed+ecosystem:nuget).
A lot of enterprises run a curated private NuGet feed and don't allow direct access to the public feed. Therefore, the restore command was not able to retrieve the vulnerability information.
In .NET 9 (NuGet 6.12), `audit sources` was introduced, allowing users to configure additional sources to download vulnerability information from.

Audit sources can be configured in your `NuGet.config` file like this:

```xml
<configuration>
    <auditSources>
        <clear />
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    </auditSources>
</configuration>
```

Starting with NuGet 7.0 (part of the .NET 10 toolchain) and Visual Studio 2026, those configured audit sources are also honored in the Visual Studio Package Manager UI.

## Fine-Grained Control with NuGetAuditSuppress
.NET 8 (NuGet 6.11) introduced the ability to suppress specific vulnerability warnings using a [`NuGetAuditSuppress`](https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages#excluding-advisories). 
This feature allows developers to manage exceptions for known vulnerabilities that are either not applicable or have been mitigated through other means. 
In .NET 8, suppressions could only be applied to packages that were included in the project via `PackageReference`. Projects using a `packages.config` file were not able to take advantage of this feature. With .NET 9 (NuGet 6.12), this limitation has been removed, and suppressions can now be applied to all types of projects, regardless of how dependencies are managed.

Suppressions can be added to your projects `.csproj` file like this:

```xml
<ItemGroup>
    <NuGetAuditSuppress Include="https://github.com/advisories/XXXX" />
</ItemGroup>
```

## Smarter Defaults: Audit Mode Changes
Building software since .NET 8 shows vulnerability warnings during package restore for your direct dependencies. These are the dependencies that are defined in the project file. An example warning looks like this:

```shell
warning NU1904: Package 'Refit' 7.0.0 has a known critical severity vulnerability, https://github.com/advisories/GHSA-3hxg-fxwm-8gf7
```

The NuGet Audit behavior has the following default configuration in .NET 8:
```XML
    <NugetAudit>true</NugetAudit> 
    <NugetAuditMode>direct</NugetAuditMode> 
    <NugetAuditLevel>low</NugetAuditLevel> 
```

You can change these settings in your project file to adjust the behavior. In .NET 10, **the default behavior has changed** to report vulnerabilities in all dependencies, not just direct ones. This means that during package restore, developers will receive warnings for vulnerabilities found in both direct and transitive dependencies, providing a more comprehensive view of potential security issues in their projects. Transitive vulnerabilities often represent the largest share of risk because they’re less visible to developers. With .NET 10, those hidden issues finally surface automatically.”

## Reducing Attack Surface: Package Pruning
Pruning removes package references that the target framework already supplies, tightening your dependency graph.

In .NET 9 (NuGet 6.13 / SDK 9.0.200) it arrived quietly as an opt‑in feature that only affected transitive packages. You had to enable it explicitly per target framework. The immediate effect was modest: a few fewer packages restored and slightly less audit noise, but direct references to runtime-provided libraries (like `System.Text.Json`) still stayed in your project and appeared in scans.

With .NET 10, pruning becomes the default for projects that target `net10.0` and expands to cover direct references. When a direct reference is entirely redundant, the build surfaces a guidance warning:

```shell
warning NU1510: PackageReference System.Text.Json will not be pruned. Consider removing this package from your dependencies, as it is likely unnecessary.
```
Removing those obsolete direct references simplifies lock files, reduces false positives in vulnerability auditing, and trims SBOM output—without changing runtime behavior.

What to do when upgrading from .NET 8: accept the default pruning, and when you see `NU1510` verify the API is platform-provided, then delete the reference. Your restores get faster and the dependency set you actually ship becomes clearer.

## Targeted Remediation
Identifying vulnerable packages is useful, but fast and disciplined remediation is what improves real risk posture. Introduced alongside .NET 10 (NuGet 7), a focused update flow lets you repair just what’s broken instead of broadly bumping your graph.

The command:
```shell
dotnet package update --vulnerable
```
Examines the resolved dependency graph (after pruning) and upgrades each vulnerable package to the **lowest** safe version—only far enough to clear the advisory. That keeps churn small, avoids unnecessary major jumps, and preserves dependency stability. The feature landed in NuGet 7 so it’s available as you move into the .NET 10 toolchain.

How it typically fits into a cycle: you restore (audit warnings appear), run the update command, restore again to confirm the `NU19xx` warnings disappear, then run tests. The result is a minimal diff that security reviewers can reason about quickly.

If one or more warnings remain, either no patched version exists yet or a transitive dependency is holding back the update—use `dotnet list package --include-transitive` to pinpoint the blocker.

## From Awareness to Action
.NET 10 continues Microsoft’s steady shift toward secure by default software supply chains. What started in .NET 8 with top-level auditing now extends across the entire dependency lifecycle, from transparent vulnerability data and fine grained suppressions to pruning and targeted remediation.

These capabilities do not add friction. They remove uncertainty. You can see what is vulnerable, fix only what is necessary, and keep your dependency graph lean and trustworthy. Security becomes part of the normal restore, build, and test rhythm, not an afterthought.

As you upgrade to .NET 10, enable auditing, review your pruning warnings, and try the `dotnet package update --vulnerable` command. You will end up with a cleaner, faster, and more transparent build that is ready for the next generation of secure software delivery.
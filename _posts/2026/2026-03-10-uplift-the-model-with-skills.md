---
layout: post
title: "Uplifting the LLM: Guided Access to Real-Time Truth"
subtitle: "A practical pattern for moving AI assistants from stale training recall to live, verifiable answers."
cover-img: /assets/images/2026/uplifting-llm/header.png
thumbnail-img: /assets/images/2026/uplifting-llm/header.png
share-img: /assets/images/2026/uplifting-llm/header.png
tags: [ai, llm, nuget, mcp, devtools, skills]
---

"Add Serilog to my project," you ask your AI assistant. It confidently suggests version 2.8.0 with a specific
configuration pattern. You follow the advice. The build succeeds. Everything seems fine. Some time later, you discover
the model recommended a version that was already a year old when it gave you the advice, missing critical bug fixes,
performance improvements, and API enhancements that shipped after its training cutoff.

That scenario is no longer edge-case behavior. It is the default failure mode when an LLM is asked to answer fast-moving
questions from static training memory.

NuGet is a perfect stress test: versions ship continuously, transitive dependencies shift under your feet, best practices
change, and security advisories land without warning. A model frozen at a training date simply cannot know what happened
last week, let alone this morning.

The usual answer is "train more often." That helps, but only temporarily. It does not solve the root problem.
The real question is this: why are we asking models to *remember* volatile facts at all?

A better approach is to let the model *query* live systems for current truth. This is where the Model Context Protocol
(MCP) and the NuGet MCP server become practical.

## The Package Management Problem

Package ecosystems like NuGet are the perfect stress test for LLM reliability. Consider what changes in a typical week:

- **New versions ship constantly**: Libraries such as `Microsoft.Extensions.*`, `Newtonsoft.Json`, and `Serilog` move
 quickly with feature updates, bug fixes, and occasional behavioral changes.
- **Best practices drift**: Initialization patterns, configuration approaches, and recommended usage evolve with the ecosystem.
- **Breaking changes arrive**: Major version bumps change API surfaces, deprecate methods, and reorganize namespaces.

An LLM trained a few months ago does not just lack recent information; it can provide *confidently incorrect* guidance:
- Suggesting package versions that don't exist or are superseded
- Recommending APIs that have been deprecated or removed
- Showing initialization patterns that no longer work

You can retrain every week and still be behind. Package ecosystems change faster than training cycles can keep up.

## The Solution: Stop Remembering, Start Querying

The insight is simple: **LLMs shouldn't memorize package versions. They should query for them.**

When you ask "Add Serilog to my project," the model should not guess from memory. It should:
1. Query NuGet's API to find the current latest version
2. Fetch the package's README for current usage patterns
3. Check for dependency conflicts with your existing packages
4. Execute the appropriate `dotnet add package` command with verified information

MCP gives the model a standardized interface for discovering and invoking external tools. Instead of pretending to be a
database of package metadata, the model becomes an orchestrator that reasons over live data.

The [**NuGet MCP server**](https://www.nuget.org/packages/NuGet.Mcp.Server) exposes structured tools that the model can invoke:
- `mcp_nuget_get-latest-package-version`: Query NuGet.org for the current latest version
- `mcp_nuget_get-package-readme`: Fetch the current README documentation
- `mcp_nuget_get-nuget-solver`: Analyze dependency constraints and version compatibility
- `mcp_nuget_update-package-to-version`: Execute safe package updates with verification

This creates a clean separation of concerns:
- The model handles intent, planning, and orchestration.
- The MCP server handles retrieval of volatile, time-sensitive facts.

## Teaching the Model with a "Skill"

To make this repeatable, you can define a skill. A [skill](https://agentskills.io/home) is a declarative markdown file that teaches 
the model which tools are available, when to use them, and how to sequence them.

For the NuGet scenario, I am using the following `nuget-package-implementation` skill, which teaches the model to fetch package 
information at runtime instead of relying on stale training recall.

```markdown
---
name: nuget-package-implementation
description: Describes how to get usage instructions for adding or implementing a NuGet
  package in a project, including viewing best practices and examples from the
  package's README file. Use this skill when you need to understand how to use a
  NuGet package effectively in your projects.
allowed-tools: mcp_nuget_get-package-readme, mcp_nuget_get-latest-package-version
---

# NuGet package implementation
This skill provides guidance on how to retrieve and utilize information about a
NuGet package, including accessing its README file for documentation and usage
instructions.

## Available MCP Tools
| Tool | Purpose |
|------|---------|
| `mcp_nuget_get-package-readme` | Retrieves the README.md file of a specified NuGet package |
| `mcp_nuget_get-latest-package-version` | Fetches the latest version of a specified NuGet package |

## When to use this skill
Use this skill when you need to:
- Understand the purpose and functionality of a NuGet package
- Access the README file for detailed documentation
- Learn how to implement and use the package in your projects
- Explore examples and best practices provided in the package documentation
- Get insights into package features, installation instructions, and usage guidelines

## Core rules
1. Always verify the package name and version before retrieving information.
2. Read the best practices and usage instructions provided in the README file.
3. Ensure compatibility of the package with your project requirements.
4. Implement the package according to the guidelines specified in the documentation.

## Workflows

### Retrieving package guidelines
- Use the `mcp_nuget_get-latest-package-version` tool to find the latest version of
  the NuGet package you are interested in.
- Use the `mcp_nuget_get-package-readme` tool to fetch the README.md file of the NuGet package.
- Review the README.md file to understand the package's purpose, installation
  instructions, usage examples, and any other relevant information.

```

## Wrapping up

Back to the Serilog example: the outcome is fundamentally different. Instead of confidently returning an outdated guess,
the model queries the NuGet MCP server for the current version, checks the README for current guidance, and proposes an
implementation based on today's reality.

This is not a one-time migration. It is an architectural decision: move volatile facts out of model memory and into
live, verifiable tool calls.

Over time, some of that knowledge **may become stable enough** to absorb into training. But for package ecosystems, reality
changes too quickly for static recall to stay trustworthy.

That is exactly why package management is such a strong proving ground for MCP. It exposes the limits of pure recall and
demonstrates a more reliable pattern:
- Keep the model focused on intent and reasoning.
- Delegate volatile facts to live systems.

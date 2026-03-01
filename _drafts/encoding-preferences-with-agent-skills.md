---
layout: post
title: "Encoding Your Team's Way: Agent Skills as Executable Conventions"
subtitle: "How to make AI follow your team's preferences and workflows instead of generic best practices"
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [ai, llm, agent-skills, devtools, team-conventions]
---

Your AI assistant knows how to add a NuGet package. It can write SQL queries, scaffold API endpoints, and configure
deployment pipelines. But does it do these things *your team's way*? Does it follow your naming conventions? Use your
preferred error-handling patterns? Respect your security review process?

The gap between "the AI can do this" and "the AI does this the way we want" is where most teams struggle with AI adoption.
It's not about capability—modern LLMs are remarkably capable. It's about **preference**. It's about the accumulated wisdom
of your team, encoded as conventions, workflows, and "the way we do things here."

This is where agent skills shift from capability extension to preference encoding. Instead of teaching the AI something
it can't do, you're teaching it *how* to do what it already knows—according to your team's standards.

## The Capability vs. Preference Distinction

When extending AI with skills and tools, there are fundamentally two types of extensions:

**Capability Uplift**: Teaching the model to do something it couldn't do through training alone.
- Example: Query a live API for current data
- Example: Execute specialized algorithms or transformations
- Example: Access proprietary systems or internal knowledge bases

**Preference Encoding**: Instructing the model on how to do something it already knows, but in your preferred way.
- Example: "Always use our error-handling pattern"
- Example: "Follow our 3-step security review before deploying"
- Example: "Use these naming conventions for database migrations"

Capability uplift makes the model smarter. Preference encoding makes the model *yours*.

The distinction matters because these two types of skills serve different purposes and may evolve differently:

- **Capability skills** may become less necessary as base models improve. If GPT-7 can natively do what your current skill
  provides, you might retire that skill.
- **Preference skills** are more durable. They capture organizational knowledge that exists outside the model's training
  data and will continue to exist regardless of how capable future models become.

## The Problem: Generic AI in a Specific Context

Large language models are trained on vast amounts of public code, documentation, and best practices. This gives them broad
capability, but it also means they default to *generic* approaches:

- They suggest the most common pattern, not your team's preferred pattern
- They follow public best practices, which may conflict with your internal standards
- They produce "correct" code that doesn't match your conventions
- They execute workflows that work, but skip your required validation steps

Consider a simple example: adding a logging library to your project.

**What a generic AI might do:**
```bash
dotnet add package Serilog
```

**What your team's standard requires:**
1. Check if the latest version is compatible with your existing dependencies
2. Verify the package version doesn't have known vulnerabilities
3. Add the package at a specific, approved version
4. Update the team's dependency tracking spreadsheet
5. Run `dotnet restore` to verify no conflicts
6. Commit with a standardized commit message format

The AI *can* do all these steps. But without explicit instruction, it won't—because it doesn't know these are *your*
team's requirements.

## Agent Skills: Executable Team Conventions

Agent skills solve this by encoding your team's preferences as structured, executable instructions. Instead of relying
on the model to "just know" your conventions, you make those conventions explicit and machine-readable.

Think of agent skills as executable runbooks. Each skill defines:

- **What** the task is (e.g., "manage NuGet packages")
- **How** to do it according to your standards (e.g., "always check compatibility first")
- **What tools** are allowed (e.g., "use these MCP tools, not manual .csproj editing")
- **What guardrails** apply (e.g., "never skip version verification")

The model reads these skills and follows them. The skills enforce discipline not through hope, but through structure.

### Anatomy of a Preference-Encoding Skill

Let's look at a concrete example: enforcing your team's package management workflow.

```yaml
name: team-nuget-standards
description: 'Manage NuGet packages according to our team standards'
allowed-tools:
  - mcp_nuget_get-nuget-solver
  - mcp_nuget_get-latest-package-version
  - mcp_nuget_update-package-to-version
  - run_in_terminal
```

**Core Rules (Your Team's Preferences):**

1. **NEVER guess package versions.** Always query `mcp_nuget_get-latest-package-version` before suggesting or installing.
   *(Reason: We've had production incidents from stale version assumptions)*

2. **NEVER directly edit `.csproj` files** to add/remove packages. Always use `dotnet add/remove package` commands.
   *(Reason: Manual edits skip NuGet's dependency resolution)*

3. **ALWAYS verify before updating:**
   - Query the MCP server to confirm the target version exists on NuGet.org
   - Check dependency compatibility using `mcp_nuget_get-nuget-solver`
   - Show the user what will change before proceeding
   - Execute the update using the verified version
   - Run `dotnet restore` to validate the result
   *(Reason: Our CI/CD pipeline requires clean restores; catch conflicts before commit)*

4. **ALWAYS use semantic commit messages** for package changes:
   - Format: `deps: update [PackageName] from [OldVersion] to [NewVersion]`
   *(Reason: Our release notes are auto-generated from commit messages)*

**Mandatory Workflow:**

```markdown
When a user asks to add or update a package:

Step 1: Verify the request
  - Call mcp_nuget_get-latest-package-version(packageName)
  - If user specified a version, verify it exists
  - Explain what version will be used and why

Step 2: Check compatibility
  - Call mcp_nuget_get-nuget-solver with current project dependencies
  - If conflicts exist, explain them to the user
  - Offer options: upgrade conflicting packages, or use a compatible version

Step 3: Get user confirmation
  - Show exactly what will change
  - Wait for explicit approval

Step 4: Execute the change
  - Use dotnet CLI or mcp_nuget_update-package-to-version
  - Run dotnet restore to verify
  - If restore fails, revert and explain the issue

Step 5: Document the change
  - Suggest a commit message following our format
  - Remind user to update dependency tracking if required
```

This isn't teaching the AI something new. It's teaching the AI *your team's way*.

## Real-World Benefits: From Chaos to Consistency

When you encode preferences as skills, you transform the AI from a helpful but unpredictable assistant into a reliable
member of your team who knows your standards.

**Before (Generic AI):**
- Every developer gets slightly different package management advice
- Some updates skip compatibility checks
- Commit messages are inconsistent
- Dependency conflicts surface during CI, not before commit
- Onboarding requires explaining conventions repeatedly

**After (Preference-Encoded Skills):**
- Every developer gets the same, standard workflow
- Compatibility checks are automatic and consistent
- Commit messages follow the team format
- Conflicts are caught before commit
- Onboarding is encoded: new developers get the right guidance from day one

The skill becomes **living documentation**—documentation that can't drift out of sync because it *is* the operational
reality.

## The Discipline Advantage

The real power of preference-encoding skills isn't just consistency—it's discipline.

As soon as you give a model the ability to call tools, the temptation is to imagine general autonomy—an "AI agent that
can do anything." But autonomy without guardrails is dangerous. The value isn't in making the model more autonomous;
it's in making its behavior more **predictable**.

> A skill is not there to make the model smarter, but to make it more disciplined.

Agent skills act as structured guardrails:

- **They prevent hallucination** by requiring the model to query authoritative sources instead of guessing
- **They enforce sequencing** by making certain steps mandatory before others can proceed
- **They codify "why"** by documenting the reasoning behind each rule
- **They enable safe autonomy** by defining exactly what the model is allowed to do and how

Discipline—not creativity—is the heart of safe, reliable agent behavior. Skills give the system the structure it needs
to keep the model aligned with your operational reality.

## Building Your Team's Skill Library

Creating a library of preference-encoding skills is an investment, but it's an investment that compounds:

**Start with high-friction workflows:**
- Processes that frequently go wrong when new team members try them
- Workflows with many steps that are easy to skip
- Tasks where consistency matters more than creativity

**Document the "why" alongside the "what":**
Each rule in your skill should explain the reasoning. This makes skills self-documenting and helps team members understand
the conventions even as they're being enforced.

**Version your skills:**
As your team's standards evolve, your skills should evolve too. Keep skills in version control alongside your code. When
you change a convention, update the skill that encodes it.

**Make skills discoverable:**
Team members should know what skills exist and when to use them. Consider:
- A skill catalog in your team wiki
- Naming conventions that make skills easy to find
- Skills that reference each other for complex workflows

**Test your skills:**
Just like code, skills can have bugs. Test them against real scenarios:
- Do they produce the expected workflow?
- Do they catch edge cases?
- Do they provide helpful error messages?
- Do they adapt when conditions change?

## Beyond NuGet: Encoding All Your Conventions

The package management example is just one domain. The pattern of preference encoding applies anywhere your team has
conventions:

**Code Generation Preferences:**
- Naming conventions for classes, methods, variables
- File organization and folder structures
- Error handling patterns
- Logging and observability standards

**Deployment Workflows:**
- Required pre-deployment checks
- Staging validation before production
- Rollback procedures
- Post-deployment verification steps

**Security Reviews:**
- Checklists for code that touches authentication
- Required approvals for infrastructure changes
- Secret management patterns
- Compliance validation steps

**Testing Standards:**
- Test naming conventions
- Required test coverage thresholds
- Integration test setup patterns
- Mock vs. real dependency guidelines

In each case, you're not teaching the AI new capabilities. You're teaching it to apply its existing capabilities in
ways that match your team's accumulated wisdom.

## Closing Thoughts: Your AI, Your Way

The difference between a generic AI assistant and a valuable team member is *context*—not just understanding the current
task, but understanding how your team approaches tasks.

Preference-encoding skills bridge that gap. They transform AI from a knowledgeable outsider into a team member who knows
your conventions, follows your standards, and enforces your collective wisdom.

This isn't about limiting AI capabilities. It's about channeling those capabilities in productive directions. It's about
taking the AI's broad knowledge and focusing it through the lens of your team's specific practices.

When you encode your preferences as skills:
- New team members get instant guidance that matches your standards
- Experienced team members get consistency across all AI interactions
- Your collective knowledge becomes executable, version-controlled infrastructure
- Your conventions can't drift because they're enforced by code

The models may be generic. But with the right skills, the assistance they provide doesn't have to be.

Your team has a way of doing things. Make sure your AI knows it.

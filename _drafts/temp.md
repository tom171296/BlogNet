---
layout: post
title: "Discipline Over Drift: A Sustainable Future for AI-Augmented Engineering"
subtitle: 
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
tags: [tag1, tag2]
---

The moment an LLM finishes training, its knowledge starts to become obsolete. It is a perfect, static snapshot of a world that
has already moved on. While we celebrate the incredible power of AI-augmented engineering, a silent clock is ticking.
The frameworks we use, the APIs we call, and the security vulnerabilities we patch evolve daily. Our AI assistants,
however, remain frozen in time. This isn't a flaw in the models; it's a fundamental mismatch of clockspeeds. We are
embedding slow-moving, static intelligence into the heart of our fast-moving, dynamic development cycles. The result
is a subtle but dangerous drift, where the AI's world and the real world diverge, leading to confident but incorrect
suggestions, deprecated patterns, and insecure code. How do we build systems that don't just work now, but continue to
work six months from now? The answer isn't bigger models or more frequent training. It's a radical shift in how we think
about the role of AI: from an all-knowing oracle to a disciplined reasoner that queries a living system for truth.

## Time is the real constraint

With the introduction of LLMs into software development, we've seen incredible leaps in productivity and
creativity. However, as with any technology, the initial excitement can overshadow long-term challenges. One of the
most pressing issues is how to ensure that the AI assistants we rely on can age gracefully. We can't keep training
new models every few months, and even if we could, the real problem is that the world changes faster than models can
keep up.

LLMs are, by design, snapshots of knowledge at a specific point in time. They are trained on a fixed body of data
that captures the state of the world. From the moment training stops, the clock starts
ticking. New frameworks emerge, APIs change, libraries deprecate functions, security vulnerabilities are discovered,
regulations evolve, and best practices shift. The model itself remains unchanged.

Our software systems, in contrast, exist in a living ecosystem of continuous integration, dependency updates, 
and operational feedback. The environment surrounding the AI assistant is in constant motion.

The fundamental mismatch is not one of intelligence, but of rate of change. Models are slow and expensive to update. 
Meanwhile, our code, libraries, and internal APIs evolve daily. When we embed a slow-moving model inside a fast-moving 
engineering workflow, we create a tension. The question is not whether the model is capable, but whether it can stay 
aligned with a reality that keeps shifting beneath it.

## Reframing the AI Assistant: From Knower to Reasoner

If the core constraint is temporal, then we must rethink the role of the AI assistant in our systems. We often treat 
LLMs as knowers—compressed archives of documentation, Stack Overflow answers, and GitHub gists. We ask them for facts,
for API usage, for up-to-date guidance. But this embedded knowledge is static. It reflects training time, not runtime.

Where LLMs truly excel is not in being current, but in reasoning. They are exceptionally strong at synthesis,
translation, abstraction, and planning. Their weakness is remembering facts that have a shelf life. They don't know
a configuration flag changed meaning last week, and they can't reliably track versioned APIs.

This leads to a more productive framing of the model's role:

> The model should reason; the system should remember.

In practice, this means we should externalize volatile knowledge from the model, representing it in a structured,
queryable format that can be updated independently. The AI assistant can then ask for this information as needed. 
This way, when an API changes, you only need to update the external knowledge source, not retrain the model.

## Externalizing volatile knowledge

The core solution is simple: move fast-changing knowledge out of the model and into the system. Instead of forcing 
the AI to remember the world as it was during training, we give it the ability to ask about the world as it is right 
now.

This requires treating the model not as a long-term memory store but as a reasoning engine sitting on top of a dynamic
information substrate. The system—not the model—becomes the source of truth for anything that changes frequently.

Fundamentally, externalizing volatile knowledge means representing the fast-moving parts of your domain in a way that is:

- Structured — Information must be machine-readable, not embedded in prose.
- Queryable — The model should be able to ask for data instead of hallucinating it.
- Version-Aware — APIs, schemas, and configurations evolve; the system must expose these distinctions.
- Continuously Updatable — Knowledge sources can change independently of the model.

This inversion of responsibility shifts us from LLM as oracle to LLM as operator. It's here that agent skills and the
Model Context Protocol (MCP) become critical. They provide a structured mechanism for exposing tools, data sources, and
evolving knowledge to the model in a controlled way. The model no longer guesses what the world looks like; it queries
it.

### Building the System That Remembers: An Appreciating Asset

This architectural shift requires deliberate engineering investment. Creating MCP servers, authoring skills, and curating
structured knowledge sources takes time and discipline. But unlike most technical debt payments, this investment doesn't
just prevent decay—it builds an asset that compounds in value.

Consider what you're actually creating:

- **Executable documentation** that can't drift out of sync with reality, because it *is* the operational reality
- **Shared organizational knowledge** captured in version-controlled form rather than tribal memory
- **Onboarding infrastructure** that guides new developers through idiomatic patterns automatically
- **Cross-team consistency** enforced through code, not through wiki pages that nobody reads

The "system that remembers" isn't built in one sprint. Start with your most volatile, highest-impact knowledge: the internal
API that changes weekly, the deployment workflow that breaks when done wrong, the security pattern that must be followed.
Each externalized piece of knowledge improves every AI interaction from that point forward. Each skill you write becomes
reusable infrastructure.

This is the critical inversion: instead of paying an ongoing, hidden tax to maintain a model's increasingly stale knowledge,
you invest in building a durable system that makes *every* model interaction more reliable. The first skill is expensive.
The tenth is routine. The fiftieth is where you realize you've built something that outlasts any individual model version.

You're not just preventing drift. You're building the connective tissue between human knowledge and machine reasoning.

## Enforcing Discipline Through Agent Skills

Externalizing knowledge solves the "what" problem—where the model should look for truth. Agent skills solve the "how"
problem—how the model should act on that knowledge in disciplined, predictable ways.

As soon as you give a model the ability to call tools, the temptation is to imagine general autonomy—an "AI agent that
can do anything." But the real value of agent skills isn't in making the model more powerful, but in making its behavior
more predictable.

Agent skills are bounded capabilities. Each skill defines a narrow slice of what the system is allowed to do: fetch data,
run a workflow, apply a transformation. A skill doesn't expand the model's general intelligence; it gives it a safe,
well-defined interface to a specific piece of functionality. They also act as guardrails against hallucination. When the
model reaches for a capability, it is selecting from known behaviors, not fabricating API calls.

> A skill is not there to make the model smarter, but to make it more disciplined.

Discipline—not creativity—is the heart of safe, reliable agent behavior. Skills give the system the structure it
needs to keep the model aligned with operational reality. They are the mechanism that transforms a probabilistic
reasoning engine into a trustworthy participant in a software system. And when combined with externalized,
version-aware knowledge, agent skills become the connective tissue that allows LLMs to work inside fast-changing
environments without drifting out of sync or behaving unpredictably.

## Practical example: Nuget packages

Package ecosystems are the perfect stress test for the “time is the real constraint” thesis.
NuGet packages change constantly: new versions ship, transitive dependencies shift, APIs deprecate, configuration
patterns evolve, and community “best practices” drift over time. A model trained even a few months ago may sound
confident while recommending:

- a package version that no longer exists (or is superseded),
- an API surface that has changed,
- initialization patterns that are now discouraged,
- or configuration defaults that no longer apply.

So instead of asking the model to remember NuGet reality, we externalize the volatile parts and make the model ask. 
The pattern looks like this:

- The model reasons about what needs to happen.
- The system remembers what is current and what is allowed.
- Skills provide disciplined, bounded ways to act.
- MCP tools provide live, queryable context: versions, metadata, README guidance.

Below is a concrete example using two complementary skills backed by a NuGet MCP server. Rather than showing complete
implementations, let's focus on the key elements that demonstrate disciplined behavior.

### Package Management Skill: Enforcing Safe Workflows

The skill's frontmatter defines its scope and available tools:

```yaml
name: nuget-manager
description: 'Manage NuGet packages in .NET projects/solutions...'
allowed-tools: mcp_nuget_get-nuget-solver, mcp_nuget_get-latest-package-version
```

The `allowed-tools` list is critical—it defines exactly which MCP tools the model can invoke within this skill's context.
This prevents the model from improvising solutions or calling arbitrary tools.

The skill then establishes non-negotiable rules:

```markdown
## Core Rules

1. **NEVER** directly edit `.csproj` or `Directory.Packages.props` files to add/remove packages.
   Always use `dotnet add package` and `dotnet remove package` commands.
2. **DIRECT EDITING** is ONLY permitted for changing versions of existing packages.
3. **VERSION UPDATES** must follow the mandatory workflow:
   - Verify the target version exists on NuGet (query, don't guess)
   - Determine if versions are managed per-project or centrally
   - Update the version string in the appropriate file
   - Immediately run `dotnet restore` to verify compatibility
```

Notice what this accomplishes: the model can't fabricate its own approach to package management. It must follow a
verifiable four-step workflow. When the model needs to update a package, it queries the MCP server to verify the
version exists—it doesn't rely on training data from months ago.

### Package Usage Skill: Querying Live Documentation

The second skill handles implementation guidance:

```yaml
name: nuget-package-implementation
description: 'Get usage instructions for implementing a NuGet package...'
allowed-tools: mcp_nuget_get-package-readme, mcp_nuget_get-latest-package-version
```

Its workflow is simple but powerful:

```markdown
## Workflows

### Retrieving Package Guidelines
- Use `mcp_nuget_get-latest-package-version` to find the current version
- Use `mcp_nuget_get-package-readme` to fetch live README documentation
- Extract implementation patterns from current documentation, not training data
```

When a developer asks "How do I use Serilog?", the model doesn't recite patterns from its training cutoff. It queries
the NuGet MCP server for the *current* README, extracts the initialization pattern that's recommended *today*, and
guides the developer accordingly.

These two skills, working together, ensure that package management is both safe (enforced workflows) and current
(querying live data). The model reasons about *how* to help the developer, while the MCP server provides the truth
about *what* is current.


## What This Changes for Engineering Teams

This architectural shift doesn't just make for better AI—it makes for better engineering workflows.

1. Predictable AI Behavior: Developers rely on stable interfaces, not artful prompt shaping. The AI's output becomes
more consistent and less dependent on hidden training artifacts.
2. Less "Prompt Archaeology": Prompts stop being the primary mechanism for control. Developers spend less time tweaking
phrasing and more time delivering value.
3. Shared, Versioned Knowledge: The authoritative representations of your APIs, workflows, and conventions become a shared,
testable, and version-controlled organizational asset.
4. Faster Onboarding: New developers are guided by the AI through idiomatic usage. The organization embeds its best practices
into the environment itself, not into tribal knowledge.

## Closing thoughts: a more sustainable LLM future

The early wave of LLM adoption has been defined by improvisation. But as these systems become deeply embedded in our
daily workflows, the question shifts from what models can do to how we make them dependable over time. The challenge
is no longer raw capability—it’s sustainability.

By externalizing volatile information and channeling the model's reasoning through disciplined skills, we create AI-augmented
systems that age gracefully. This moves us away from a fragile dependence on what a model "remembers" and toward a durable
foundation built on shared tooling and continuously updated domain knowledge.

The result isn’t just more reliable AI—it’s more reliable engineering. A future where LLMs aren't magical assistants that
slowly drift out of date, but disciplined partners that operate within the guardrails we define.

The models may be static. But with the right architecture, the systems built around them don’t have to be.

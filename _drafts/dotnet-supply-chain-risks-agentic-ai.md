---
layout: post
title: ""
subtitle: ""
cover-img: /assets/images/2026/todo
thumbnail-img: /assets/images/2026/todo
share-img: /assets/images/2026/todo
tags: [ai native development, supply chain security, agentic ai]
---

Your next supply chain attack won’t start in a compromised package.

It will start with a suggestion.

AI-assisted development is changing how we build software. In .NET ecosystems, tools are no longer just helping you write code—they suggest dependencies, shape implementations, and increasingly influence architectural decisions.

That changes the game.

We’re no longer just defending against malicious packages in our dependency graph.  
We’re defending against **manipulated inputs to the development process itself**.

In this post, we’ll explore how AI-native development reshapes supply chain risk—and why
deterministic checks are becoming essential in modern .NET environments.

---

# The shift: From code you write to code you accept

With AI-native development, I mean workflows where AI actively:
- suggests code
- recommends dependencies
- influences decisions

Not just autocomplete—**decision shaping**.

This introduces a fundamental shift:

> You are no longer in full control of the code entering your system.

Your inputs now include:
- AI-generated code snippets  
- Suggested dependencies  
- Context pulled from external sources  

That last one is critical.

Because it means your supply chain no longer starts at `dotnet restore`.

It starts at the **moment a suggestion is made**.

---

# New threats in AI-native .NET development

## AI as a policy-blind dependency recommender

AI models are probabilistic—not policy-aware.

They optimize for “what looks right,” not for:
- security
- licensing
- maintenance
- compatibility with your environment

That leads to subtle but dangerous failure modes in .NET projects:

- Recommending **older package versions with known CVEs** because they appear frequently in training data  
- Suggesting packages from blog posts or sample repos without validating **publisher trust**  
- Proposing packages with **incompatible or restrictive licenses**  
- Recommending **abandoned packages** with no maintenance or patching  

AI accelerates discovery but it cannot be your trust boundary.

Every suggested dependency is **untrusted input**.

---

## Dependency confusion—starting before restore

Classic dependency confusion relied on namespace overlap between private and public feeds.

In AI-native workflows, the attack starts earlier.

The model itself becomes the entry point.

A realistic flow:

1. The AI suggests a package that *sounds correct*  
   (`Contoso.Security.Jwt`)  
2. The package does not exist in your internal feed  
3. Restore falls back to a public source  
4. An attacker publishes a lookalike package  
5. Your build succeeds—importing attacker-controlled code  

The key difference:

> The confusion no longer starts in your configuration.  
> It starts in the **suggestion layer**.

---

## Context poisoning: influencing the suggestion engine

AI tools don’t just rely on your code.

They pull context from:
- documentation
- blog posts
- search results
- external services

That creates a new attack surface: **indirect influence**.

If an attacker can manipulate those sources, they can influence what your AI suggests.

Example:

A blog post promotes:
> “Use `Secure.Jwt.Handler` v2.1.0 for JWT handling in .NET”

The package is attacker-controlled.

The AI picks it up.  
It looks legitimate.  
It gets suggested—and accepted.

No exploit needed. Just influence.

---

# The real problem: blurred trust boundaries

Traditionally, trust boundaries were clear:

- Your code vs external code  
- Your pipeline vs external systems  

With AI, those boundaries blur:

- External influence enters through suggestions  
- Malicious intent hides in context  
- Risk is introduced **before** dependencies are even resolved  

This leads to an uncomfortable reality:

> AI is part of your development pipeline but not under your control.

Even if you provide instructions/skills:
- models can ignore them  
- tools can be invoked implicitly  
- context sources are not fully visible  

AI is not malicious but it is not authoritative either.

Treat it as an **untrusted contributor**.

---

# The need for deterministic checks

All of these risks share one property:

They exploit non-determinism.

AI suggestions are:
- probabilistic  
- context-dependent  
- not guaranteed to follow policy  

Which means:

> Your security controls cannot rely on developer judgment alone.

You need **deterministic enforcement**.

Not “this looks right.”  
But: “this is allowed.”

---

# Key deterministic checks for .NET supply chains

To safely adopt AI-assisted development, your pipeline must enforce strict guarantees—regardless of how a dependency was introduced.

### Block vulnerable dependencies
AI may suggest outdated or vulnerable packages.

Your pipeline must **fail builds deterministically** if known vulnerabilities are present—even if the suggestion looked valid.

---

### Enforce license policy
AI does not understand your organization’s licensing constraints.

Every package must be validated against an explicit allow/deny policy.

---

### Lock package sources
Prevent fallback to untrusted feeds.

Use package source mapping to ensure:
- internal packages resolve only from internal sources  
- public packages come from explicitly approved feeds  

---

### Verify trusted publishers
A package name is not a trust signal.

Enforce validation of:
- publisher identity  
- ownership  
- provenance  

---

### Use lock files and deterministic restore
AI-driven updates can silently change your dependency graph.

Lock files ensure:
- reproducible builds  
- no unexpected transitive changes  
- controlled updates  

---

### Block unknown dependencies by default
If a package is not explicitly approved:

It should not enter your system.

No exceptions for “AI suggested it.”

---

# AI changes the starting point of your supply chain

Supply chain security didn’t disappear.

It moved.

From:
- package ingestion  
To:
- suggestion acceptance  

If your controls only start at build time, you’re already too late.

---

# Final thought

AI didn’t remove the need for supply chain security.

It expanded the attack surface to the earliest stage of development.

The moment a suggestion appears.

Treat AI output as input—not authority.  
Enforce policy deterministically—not implicitly.

Because in AI-native development:

> The first compromised dependency may never have been intentionally chosen.
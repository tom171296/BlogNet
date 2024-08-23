---
title: "A Practical Guide to SLSA for Software Producers (Part 1)"
date: 2025-09-01
tags: [security, slsa, devsecops, csharp, dotnet, github-actions]
---

## A Practical Guide to SLSA for Software Producers (Part 1)

### 🎯 Goal: Show how developers and organizations can adopt practices to create verifiable, tamper-resistant software.

---

### Introduction to SLSA: Why Your Software Supply Chain Needs a Guardian

*   **The Modern Threat Landscape:** Discuss recent high-profile supply chain attacks like SolarWinds and the xz backdoor. Explain how these incidents highlight the vulnerability of the software we depend on.
*   **What is SLSA?** Introduce the Supply-chain Levels for Software Artifacts (SLSA) framework as a security framework. It's a checklist of standards and controls to prevent tampering, improve integrity, and secure packages and infrastructure.
*   **A Quick Tour of SLSA Levels:** Briefly explain the progression from SLSA Level 0 (no guarantees) to SLSA Level 3 (hardened build platform), providing a simple analogy for what each level represents in terms of trust and security.

---

## Visual Overview: SLSA Levels & Producer Responsibilities

| SLSA Level | Description                | Producer Responsibility |
|------------|----------------------------|------------------------|
| 0          | No guarantees              | Awareness              |
| 1          | Build script available     | Basic controls         |
| 2          | Hosted build service       | Secure pipeline        |
| 3          | Hardened build platform    | Provenance, signing    |

---

### The Producer's Responsibility: Building with Integrity

This section will detail the core responsibilities of a software producer in the SLSA model.

*   **Securing the Build Pipeline:**
    *   The build process is a primary target for attackers.
    *   Emphasize the need for ephemeral, isolated, and hermetic build environments.
    *   Explain how platforms like GitHub Actions and Azure DevOps provide these features out-of-the-box.
*   **Generating Provenance: The Birth Certificate for Your Software:**
    *   Define provenance: It's verifiable metadata about how an artifact was built. Who built it? What source code was used? What build steps were run?
    *   Explain that this provenance is the key to achieving SLSA compliance. It allows consumers to verify that the software they are using came from a trusted source and a secure process.

---

### Actionable Steps for Producers

#### Securing the Build Pipeline
- Use ephemeral, isolated build environments
- Enable branch protection and required reviews
- Store secrets securely (e.g., GitHub/Azure secrets)
- Example: GitHub Actions YAML snippet for secure builds

#### Generating Provenance
- Use SLSA GitHub Generator or custom scripts
- Ensure provenance includes source, builder, and steps
- Example: Provenance file snippet

#### Signing Artifacts
- Use Sigstore Cosign for signing
- Upload signatures to Rekor transparency log
- Example: Cosign command

---

### Hands-On Demo: Achieving SLSA Level 3 with .NET and GitHub Actions

Let's move from theory to practice. We'll build a simple .NET application and generate verifiable provenance for it.

*   **1. The Project:**
    *   A minimal .NET Web API. We'll keep it simple to focus on the process, not the code.
    *   The complete source code will be available on GitHub.

*   **2. The Build Pipeline (GitHub Actions):**
    *   We will use a GitHub Actions workflow to build and package the application.
    *   We'll use the `slsa-framework/slsa-github-generator` to automatically generate SLSA-compliant provenance. This tool acts as a "reusable workflow" that wraps our build and handles the complexities of provenance generation.

*   **3. Generating and Signing the Attestation:**
    *   The SLSA generator will output a provenance attestation in the in-toto format.
    *   We will then sign this attestation using Sigstore's `cosign` tool. This creates a cryptographic signature, proving the attestation hasn't been tampered with.
    *   The signature will be uploaded to a transparency log (Rekor) for public verification.

*   **4. The Result:**
    *   A container image for our .NET application.
    *   A signed SLSA provenance attestation that proves how the image was built.

---

### Demo: Step-by-Step
1. Create a minimal .NET Web API (link to sample repo)
2. Set up GitHub Actions workflow (YAML example)
3. Integrate SLSA provenance generation
4. Sign the attestation and push to Rekor

---

### Common Pitfalls to Avoid
- Hardcoding secrets in workflows
- Skipping provenance generation
- Not verifying signatures before release

---

### Further Reading & Resources
- [SLSA Official Documentation](https://slsa.dev/)
- [Sigstore Project](https://sigstore.dev/)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

### Key Takeaways (Summary Table)
| Action         | Impact                  |
|----------------|------------------------|
| Secure builds  | Prevent tampering      |
| Provenance     | Enable verification    |
| Signing        | Build trust            |

**Coming Up in Part 2:** We'll switch perspectives and look at the consumer side. How can you use the provenance and signatures we just created to verify software before you use it? Stay tuned!

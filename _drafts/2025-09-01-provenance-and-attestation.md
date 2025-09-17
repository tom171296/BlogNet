---
title: "No signature, no deployment: Provenance and attestation"
date: 2025-09-01
tags: [security, slsa, devsecops, csharp, dotnet, github-actions, provenance, attestation]
---

# No signature, no deployment: Provenance and attestation

The software supply chain is now one of the most common attack surfaces.  
Incidents like SolarWinds and Codecov showed us how attackers can compromise not the app itself, but the systems that
build and deliver it. To reduce this risk, we need stronger guarantees about our artifacts. Two critical building blocks
here are **attestation** and **provenance**.  

The examples in this blog use .NET and GitHub, but the principles apply broadly across technologies and platforms.  

---

## Introduction to SLSA: Why Your Software Supply Chain Needs a Guardian

[SolarWinds](https://www.crowdstrike.com/en-us/blog/sunspot-malware-technical-analysis/),
[Codecov](https://about.codecov.io/apr-2021-post-mortem/) — these attacks blew the doors off supply chain security.  

The scary part? Most folks never see it coming. It’s not just about bugs in code; it’s about every step from source to
shipped software. Scanning for vulnerabilities is great, but it’s not enough. Code can change after you scan it, and
every link in the chain is a chance for trouble.

**SLSA** (Supply-chain Levels for Software Artifacts) is a set of guidelines to protect you against this. It:  
- Gives us a **common vocabulary** for discussing supply chain security.  
- Helps you evaluate **the trustworthiness of what you consume**.  
- Provides a **checklist** to improve how you produce software.  

With [SLSA v1.2 RC1](https://slsa.dev/spec/v1.2-rc1/tracks), there are two tracks:  
- **Source track** → Secures your repositories.  
- **Build track** → Secures your build pipelines.  

This blog focuses on the **Build track**, because that’s where attestation and provenance come in.  

---

## The Producer's Responsibility: Building with Integrity

As a producer, your job is to prove that your software was built securely and consistently. That boils down to:  

### 🔒 Securing the Build Pipeline

Attackers love build pipelines because compromising them lets them inject malicious code *after* all your security
checks.

Best practices:  
- Use **ephemeral, isolated runners** (GitHub-hosted or short-lived self-hosted).  
- Lock down branches with **protection rules + reviews**.  
- Store secrets in vaults or native secret stores.  
- Keep workflows hermetic: no network access unless absolutely needed.  

**Example: GitHub Actions workflow with ephemeral runners**  

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write # required for keyless signing
```
That last line (id-token: write) is important — it enables OIDC tokens for keyless signing with Cosign.

### 📝 Generating Provenance, The Birth Certificate for Your Software
Provenance gives consumers the ability to trace an artifact back to its exact source and build process. 
If an attacker swaps your artifact in the registry, consumers can detect the mismatch by verifying the 
provenance against your repo and commit.

Provenance is a detailed record of how your software was built. It includes:  
- **Source details**: Commit hashes, branch names, tags.
- **Build environment**: OS, tools, dependencies.
- **Build steps**: Commands run, configurations used.
- **Outputs**: Artifacts produced, their hashes.

This info is usually stored in a **provenance file** (e.g., in [in-toto](https://in-toto.io/) format).

Github created a [provenance generator action](https://github.com/slsa-framework/slsa-github-generator) to help 
automate this process.

Firstly, you need to give the build more permissions to write the provenance file:
```yaml
permissions:
    id-token: write
    contents: read
    packages: write
    attestations: write # required to push attestation to registry
```
Generating and adding the build provenance is as simple as adding the following step to your build job:

```yaml
- name: Generate artifact attestation
    uses: actions/attest-build-provenance@v2
    with:
        subject-name: ${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}
        subject-digest: ${{ needs.build.outputs.digest }}
        push-to-registry: true
```

### Adding Attestation: The Digital Signature of Trust
Without a signature, anyone could generate fake provenance. With attestation, consumers can cryptographically 
verify that the provenance really came from your build pipeline. Unsigned provenance is informative, but not authoritative. 
Without attestation, there’s no guarantee it hasn’t been tampered with. Signed provenance is **evidence**.

Attestation is the process of signing the provenance file, creating a tamper-evident seal. This can be done using
tools like [Cosign](https://github.com/sigstore/cosign).
There are two main ways to sign:
- **Key-based signing**: You manage private keys to sign the provenance. This requires secure key storage and rotation.
- **Keyless signing**: Uses OIDC tokens to sign without managing keys. This is more secure and easier to manage.

Key-based signing may be required in highly regulated or air-gapped environments, but it adds operational overhead (secure storage, rotation).
Keyless signing (OIDC-based) is simpler and reduces risk of key leaks, but it depends on a trusted identity provider.

In the example above, the `actions/attest-build-provenance` uses [sigstore](https://sigstore.dev/) signing tools to sign the provenance file. 

- [Cosign](https://github.com/sigstore/cosign) is used under the hood to sign the provenance file.
- [Fulcio](https://github.com/sigstore/fulcio) is used as the certificate authority to issue short-lived certificates.
- [Rekor](https://github.com/sigstore/rekor) is used as the transparency log to record the signature and certificate.

It uses keyless signing by default and leverages GitHub's OIDC provider to sign the provenance file.
You can also configure it to use key-based signing if you prefer.

Running the `actions/attest-build-provenance@v2` action generates a provenance file and can optionally push 
it to your container registry. In GitHub, to see the generated provenance as attestation, go to the "Actions" 
tab, in the menu on the left, select "Attestations". There you will see all the attestations for your repository.

A provenance file isn't just something you generate and forget about. It's something anyone consuming your software
can use to verify its integrity. SLSA not just describes that provenace should be generated, but also that it should be
distributed alongside the artifact. The Cosign signing action in the GitHub workflow adds a record of what was signed to 
the public [Rekor transparency log](https://rekor.sigstore.dev/).

### Example: Full GitHub Actions Workflow with Provenance and Attestation
To see a complete setup of a GitHub Actions workflow that builds a .NET application, generates provenance, and adds attestation,
[check out this example](https://github.com/tom171296/CraftedSpecially/blob/issues/revamp-setup/.github/workflows/catalog-service.yml).

## Get started today
You don't need to wait for perfect security to start using provenance and attestation. Start small and iterate. Here are some steps to get started:
1. **Review your build pipeline**: Identify areas where you can improve security.
2. **Implement provenance generation**: Use the `actions/attest-build-provenance` action in your GitHub workflows.
3. **Adopt attestation**: Start with keyless signing using OIDC.
4. **Educate your team**: Make sure everyone understands the importance of supply chain security.

## Next Steps: Verifying Provenance as a Consumer
As a consumer, you should verify the provenance and attestation of any software you use. This ensures that the software
was built securely and has not been tampered with. In my next blog post, I'll cover how to set up verification in your deployment process.

Sneak peek: Verifying provenance can be done using the GitHub CLI

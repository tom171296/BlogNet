---
title: "If You Can’t Prove It, Don’t Ship It: Provenance and Attestation Explained"
date: 2026-01-06
excerpt: Learn how to secure your software supply chain with provenance and attestation using GitHub Actions
tags: [security, slsa, devsecops, csharp, dotnet, github-actions, provenance, attestation]
published: true
cover-img: /assets/images/2026/provenance-and-attestation/header.png
thumbnail-img: /assets/images/2026/provenance-and-attestation/header.png
share-img: /assets/images/2026/provenance-and-attestation/header.png
---

# If You Can’t Prove It, Don’t Ship It: Provenance and Attestation Explained

There is a hard truth most developers still underestimate: **your build pipeline is now one of the easiest ways for 
attackers to compromise your software.** Building trust in your supply chain is a guarantee you can no longer afford
to ignore.

You can run linters, unit tests, SAST, DAST, and dependency scans but still ship malware.
If you can't prove **what you built**, **how it was built** and that **it hasn't been tampered** with, you're 
asking your users to trust you on blind faith.

With the current state of software supply chain attacks, this is no longer acceptable, 
not for customers, not for regulators and certainly not for critical systems.
This is why developers need to start generating **provenance** and adding **attestation** to their build artifacts.

With these in place, your build artifacts become verifiable, traceable and tamper-evident.
This isn't future-state security, it's the new baseline for responsible software development.

In this blogpost, I'll explain what provenance and attestation are, why they matter, and how you can implement them 
in your build pipelines using GitHub Actions.

## Introduction to SLSA: Why Your Software Supply Chain Needs a Guardian

[SolarWinds](https://www.crowdstrike.com/en-us/blog/sunspot-malware-technical-analysis/),
[Codecov](https://about.codecov.io/apr-2021-post-mortem/), these attacks blew the doors off supply chain security.  

The scary part? Most folks never see it coming. It’s not just about bugs in code; it’s about every step from source to
shipped software. Scanning for vulnerabilities is great, but it’s not enough. Code can change after you scan it, and
every link in the chain is a chance for trouble.

**SLSA** (Supply-chain Levels for Software Artifacts) is a set of guidelines to protect you against this. It:  
- Gives us a **common vocabulary** for discussing supply chain security.  
- Helps you evaluate **the trustworthiness of what you consume**.  
- Provides a **checklist** to improve how you produce software.  

The SLSA framework defines different tracks and levels per track that define increasing requirements for software 
supply chain security. This blog post focuses on the **Build** track, specifically the producing artifacts section of the track.
The entire requirements for this section can be found on the [SLSA website](https://slsa.dev/spec/v1.2/build-requirements).

## The Producer's Responsibility: Building with Integrity

As a producer, your job is to prove that your software was built securely and consistently. That boils down to:

### Provenance, The Birth Certificate for Your Software
The build platform is responsible for generating provenance, the “birth certificate” that explains where your software 
came from and how it was produced.

Provenance is the verifiable record of where, when, and how a software artifact was created. In modern supply chains, 
where countless tools, dependencies, and build steps interact, provenance must exist from the very beginning. It traces 
an artifact back to its exact source and build process, making it possible to understand every moving part involved in 
producing it.

The purpose of provenance is simple but powerful:

- It describes how an artifact (or set of artifacts) was produced so that:

  - Consumers can verify that it was built according to expectations.
  - Others can reliably rebuild it if needed.

For higher SLSA levels and stronger integrity guarantees, provenance becomes stricter and more detailed. This often requires a
deeper, more technical understanding of the provenance predicate,\ the structured data describing the build, environment, and 
verification details.

SLSA build level describes the overall provenance integrity according to the minimum requirements on its:
- **Completeness**: What information is contained in the provenance?
- **Authenticity**: How strongly can the provenance be tied back to the builder?
- **Accuracy**: How resistant is the provenance to tampering?

Provenance gives consumers the ability to trace an artifact back to its exact source
and build process and detect tampering. If an attacker swaps your artifact in the registry,
consumers can detect the mismatch by verifying the provenance against your repository and commit.

From there, the levels build on each other:

- **Provenance exists** (required for all SLSA levels)
  The build process must produce provenance that cryptographically identifies the artifact and describes how it was built.

- **Provenance is authentic** (SLSA Level 2+)
  Consumers must be able to validate signatures, trust the builder, and confirm integrity.

- **Provenance is unforgeable** (SLSA Level 3)
  Secrets are isolated, protected from user builds, and every field in the provenance is generated or verified by the build platform.

An example of a provenance file looks like this:
```json
{
    "_type": "https://in-toto.io/Statement/v1",
    "subject": [
        {
            "name": "ghcr.io/tom171296/crafted-specially/catalog-api",
            "digest": {
                "sha256": "b9f3e0c79a5b1c675c88d0f33abcacae3d78dcdca2e7ffb0c88f3bbea3829e38"
            }
        }
    ],
    "predicateType": "https://slsa.dev/provenance/v1",
    "predicate": {
        "buildDefinition": {
            "buildType": "https://actions.github.io/buildtypes/workflow/v1",
            "externalParameters": {
                "workflow": {
                    "ref": "refs/heads/main",
                    "repository": "https://github.com/tom171296/CraftedSpecially",
                    "path": ".github/workflows/catalog-service.yml"
                }
            },
            "internalParameters": {
                "github": {
                    "event_name": "workflow_dispatch",
                    "repository_id": "500348243",
                    "repository_owner_id": "12030148",
                    "runner_environment": "github-hosted"
                }
            },
            "resolvedDependencies": [
                {
                    "uri": "git+https://github.com/tom171296/CraftedSpecially@refs/heads/main",
                    "digest": {
                        "gitCommit": "2d91881fdf25611154fd4ae801730ac2049ec0c6"
                    }
                }
            ]
        },
        "runDetails": {
            "builder": {
                "id": "https://github.com/tom171296/CraftedSpecially/.github/workflows/catalog-service.yml@refs/heads/main"
            },
            "metadata": {
                "invocationId": "https://github.com/tom171296/CraftedSpecially/actions/runs/20581805085/attempts/1"
            }
        }
    }
}
```

So now that we have covered what provenance is and why it matters, let's make it more concrete.

###  Generating provenance in GitHub Actions
Provenance is a detailed record of how your software was built. It includes:  
- **Source details**: Commit hashes, branch names, tags.
- **Build environment**: OS, tools, dependencies.
- **Build steps**: Commands run, configurations used.
- **Outputs**: Artifacts produced, their hashes.

This info is usually stored in a **provenance file** (e.g., in [in-toto](https://in-toto.io/) format), an industry standard for supply chain metadata.

SLSA created a [provenance generator action](https://github.com/slsa-framework/slsa-github-generator) to help 
automate this process. This action supports several ecosystems but the docker container support is still work in progress.
Github published an [official action](https://github.com/actions/attest-build-provenance) that can be used to generate
provenance for both generic artifacts and container images. I'll focus on this action in the example below.

Firstly, you need to give the build more permissions to write the provenance file:
```yaml
permissions:
    id-token: write
    contents: read
    packages: write
    attestations: write # required to push attestation to registry
    artifact-metadata: write # Allow writing artifact metadata
```

Creating provenance can be done for both container images and generic artifacts.
Generating and adding the build provenance is as simple as adding the following step to your build job:

```yaml
# generic artifact
- name: Attest
  uses: actions/attest-build-provenance@v3
  with:
    subject-path: '${{ github.workspace }}/my-app'
```

```yaml
# Container image
- name: Generate artifact attestation
  uses: actions/attest-build-provenance@v3
  with:
      subject-name: ${{ env.ARTIFACT_NAME }}
      subject-digest: ${{ needs.build.outputs.artifact-digest }}
      push-to-registry: true
```

There is a step earlier in the process that builds the docker image and has a digest output that is used as input to the
provenance generation step.
```yaml
  - name: Build and push Docker image
    id: build_and_push
    uses: docker/build-push-action@v3
    with:
      context: ./Services
      file: ./Services/Catalog/dockerfile
      push: true
      tags: ${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest # never use latest in production!
    
outputs:
  digest: ${{ steps.build_and_push.outputs.digest }}
```

### Adding Attestation: The Digital Signature of Trust
Without a signature, anyone could generate fake provenance. With [attestation](https://docs.docker.com/build/metadata/attestations/), 
consumers can cryptographically verify that the provenance really came from your build pipeline, has not been tampered with,
and is explicitly bound to a specific artifact. Unsigned provenance may provide useful context, but it is not authoritative and 
provides no guarantee against tampering or misassociation. Signed provenance, by contrast, serves as verifiable **evidence**.

Attestation is the act of cryptographically signing provenance and associating it with a particular artifact (for example, by digest), 
creating a tamper-evident and artifact-scoped seal. This is typically done using tools such as [Cosign](https://github.com/sigstore/cosign), 
which ensure that the attestation cannot be reused for a different artifact. 

There are two primary approaches to signing:

- **Key-based signing**: You manage private keys to sign the provenance. This requires secure key storage and rotation.
- **Keyless signing**: Uses OIDC tokens to sign without managing keys. This is more secure and easier to manage.

Key-based signing may be required in highly regulated or air-gapped environments, but it adds operational overhead (secure storage, rotation).
Keyless signing (OIDC-based) is simpler and reduces risk of key leaks, but it depends on a trusted identity provider.

In the example above, the `actions/attest-build-provenance` uses [sigstore](https://sigstore.dev/) signing tools to sign the provenance file. 

- [Cosign](https://github.com/sigstore/cosign) is used under the hood to sign the provenance file.
- [Fulcio](https://github.com/sigstore/fulcio) is used as the certificate authority to issue short-lived certificates.
- [Rekor](https://github.com/sigstore/rekor) is used as the transparency log to record the signature and certificate.

The action uses keyless signing by default and leverages GitHub's OIDC provider to sign the provenance file.
You can also configure it to use key-based signing if you prefer.

### Distributing Provenance
Producing provenance is only useful if consumers can actually find and verify it. In SLSA, provenance is distributed as attestations: 
signed records that connect a specific artifact to the build that produced it. These attestations should travel with the artifact 
wherever it is published so that verification remains possible at any point in the supply chain.

Attestations belong to individual artifacts, not whole releases. A release may contain multiple artifacts produced on different
platforms or at different times, and each artifact may have its own provenance. Ecosystems need predictable ways to map an artifact
to its attestation, whether through naming conventions, registry metadata, or artifact directories. Once published, attestations
should not change; if something needs correction, a new artifact and new provenance must be created.

Running the `actions/attest-build-provenance` action generates a provenance file and can optionally push 
it to your container registry. In GitHub, to see [the generated provenance as attestation](https://github.com/tom171296/CraftedSpecially/attestations), 
go to the "Actions" tab, in the menu on the left, select "Attestations". 
There you will see all the attestations for your repository.

![GitHub Attestations Tab](/assets/images/2025/provenance-and-attestation/attestation-tab.png)

A provenance file isn't just something you generate and forget about. It's something anyone consuming your software
can use to verify its integrity. SLSA doesn't just require that provenance be generated, but also that it be distributed. 
The action in the GitHub workflow adds a record of what was signed to the public [Rekor transparency log](https://rekor.sigstore.dev/).

At the time of writing, there is an open [issue](https://github.com/actions/attest-build-provenance/issues/781) where the support for 
creating an [artifact metadata storage record](https://docs.github.com/en/rest/orgs/artifact-metadata?apiVersion=2022-11-28#create-artifact-metadata-storage-record)
is not working as expected. This means that there is no meta data record created currently.

### Example: Full GitHub Actions Workflow with Provenance and Attestation
To see a complete setup of a GitHub Actions workflow that builds a .NET application, generates provenance, and adds attestation,
[see the CraftedSpecially repo’s catalog service workflow as an example.](https://github.com/tom171296/CraftedSpecially/blob/main/.github/workflows/catalog-service.yml).

## Verifying artifacts: The Consumer's Duty
Generating provenance is only half the equation. As a consumer of software artifacts, whether you're deploying third-party containers, using open-source packages, or running your own internal services, verification is your responsibility.
Without verification, attestations are just nice-to-have metadata. With verification, they become enforceable security controls
that prevent compromised or tampered artifacts from reaching your systems.

Verification should happen at three layers: manual inspection during security reviews, automated checks in CI/CD pipelines,
and runtime enforcement at deployment. Each layer provides defense-in-depth against supply chain attacks.

### What Verification Actually Checks

When you verify an attestation, you're validating three things:

1. **Authenticity** - The attestation was cryptographically signed by a trusted builder
2. **Integrity** - The artifact's digest matches what's in the attestation (preventing artifact swapping)
3. **Policy compliance** - The build meets your security requirements

The digest binding is critical. Without it, an attacker could reuse a legitimate attestation for a malicious artifact.
Verification tools automatically compute the artifact's digest and confirm it matches the signed attestation.

### Manual Verification: Security Reviews and Incident Response

The GitHub CLI makes verification straightforward for security reviews and investigations:

```bash
# Basic verification - checks signature and digest
gh attestation verify oci://ghcr.io/tom171296/crafted-specially/catalog-api:latest \
  --owner tom171296

# Enforce specific security properties
gh attestation verify oci://ghcr.io/tom171296/crafted-specially/catalog-api:latest \
  --owner tom171296 \
  --signer-workflow tom171296/CraftedSpecially/.github/workflows/catalog-service.yml \
  --source-ref refs/heads/main \
  --deny-self-hosted-runners
```

The `--deny-self-hosted-runners` flag is a critical security control. Self-hosted runners can be compromised to inject
malicious code during builds, so enforcing GitHub-hosted runners ensures builds happen in isolated, ephemeral environments.

For deeper investigation, download and inspect the provenance content:

```bash
# Download attestation
gh attestation download oci://ghcr.io/tom171296/crafted-specially/catalog-api:latest \
  --owner tom171296 -o attestation.json

# Inspect key properties
cat attestation.json | jq '.predicate.buildDefinition.externalParameters.workflow.repository'
cat attestation.json | jq '.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit'
cat attestation.json | jq '.predicate.buildDefinition.internalParameters.github.runner_environment'
```

This is invaluable during incident response - the provenance tells you exactly which workflow, commit, and runner produced
an artifact, helping you identify the attack vector.

### Pipeline Validation: Automated Verification in CI/CD

Manual verification doesn't scale. For production deployments, integrate verification into your pipelines to automatically
reject unverified artifacts:

```yaml
name: Deploy to Production

jobs:
  verify-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Verify image attestation
        run: |
          gh attestation verify "oci://${{ env.IMAGE }}" \
            --owner tom171296 \
            --signer-workflow tom171296/CraftedSpecially/.github/workflows/catalog-service.yml \
            --source-ref refs/heads/main \
            --deny-self-hosted-runners
```

This ensures no unverified artifact reaches production. If an attacker compromises your container registry and swaps an
image, deployment fails because the attestation won't match.

For complex policies, download the provenance and validate it programmatically. This lets you enforce custom rules like
"must be from main branch" or "must use specific build configuration" before deployment.

### Runtime Validation: Admission Control with Kyverno

The final defense layer is runtime enforcement. [Kyverno](https://kyverno.io/) is a Kubernetes policy engine that verifies
attestations when pods are created. Even if an unverified image bypasses your CI/CD checks, Kyverno blocks it at runtime.

A basic policy requiring SLSA provenance attestations:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-provenance
spec:
  validationFailureAction: Enforce
  rules:
    - name: verify-provenance
      match:
        any:
        - resources:
            kinds: [Pod]
      verifyImages:
      - imageReferences:
        - "ghcr.io/tom171296/*"
        attestations:
        - predicateType: https://slsa.dev/provenance/v1
          attestors:
          - entries:
            - keyless:
                subject: "https://github.com/tom171296/*"
                issuer: "https://token.actions.githubusercontent.com"
```

For production workloads, enforce stricter policies by validating provenance content:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: production-policy
spec:
  validationFailureAction: Enforce
  rules:
    - name: verify-provenance-content
      match:
        any:
        - resources:
            kinds: [Pod]
            namespaces: [production]
      verifyImages:
      - imageReferences:
        - "ghcr.io/tom171296/crafted-specially/*"
        attestations:
        - predicateType: https://slsa.dev/provenance/v1
          attestors:
          - entries:
            - keyless:
                subject: "https://github.com/tom171296/CraftedSpecially/.github/workflows/*@refs/heads/main"
                issuer: "https://token.actions.githubusercontent.com"
          conditions:
          - all:
            # Must be from main branch
            - key: "{{ buildDefinition.externalParameters.workflow.ref }}"
              operator: Equals
              value: "refs/heads/main"
            # Must use GitHub-hosted runners
            - key: "{{ buildDefinition.internalParameters.github.runner_environment }}"
              operator: Equals
              value: "github-hosted"
```

When introducing these policies, start with `validationFailureAction: Audit` to identify violations without blocking
deployments, then switch to `Enforce` once your images have valid attestations.

### Defense in Depth: Why All Three Layers Matter

The most effective approach combines all three verification layers:

- **Manual verification** for security reviews and incident investigation
- **Pipeline verification** catches issues before deployment
- **Runtime enforcement** as the final safeguard

If an attacker compromises your container registry and swaps an image:
- Your CI/CD pipeline rejects it during deployment (verification fails)
- If the pipeline is bypassed, Kyverno blocks the pod from starting
- Manual verification commands provide forensic evidence

Each layer provides redundancy. No single failure point allows a compromised artifact through.

## What Happens If You Skip Provenance?  
Without provenance and attestation, you’re left with a big blind spot: you can’t prove how or where your software was built. That means:  

- **Artifact swapping risk** → An attacker could upload a malicious artifact to your registry, and consumers would have no way to tell it didn’t come from your pipeline.  
- **Silent tampering** → Even if you scanned your code and dependencies, a compromised build system could inject malware *after* those checks.  
- **No chain of custody** → In an incident, you can’t trace an artifact back to the source commit, build environment, or who signed off on it.  

Put simply: skipping provenance and attestation means trusting your supply chain on blind faith. With them, you gain evidence that your artifacts are verifiable and tamper-evident.

## Wrapping up
Provenance and attestation transform your artifacts from "trust me" to "verify me." The practices
covered here, generating cryptographically signed build records and distributing them alongside
your artifacts, establish a verifiable chain of custody from source to deployment.

You don't need to wait for perfect security to start using provenance and attestation. Start small and iterate. Here are some steps to get started:
1. **Review your build pipeline**: Identify areas where you can improve security.
2. **Implement provenance generation**: Use the `actions/attest-build-provenance` action in your GitHub workflows.
3. **Adopt attestation**: Start with keyless signing using OIDC.
4. **Educate your team**: Make sure everyone understands the importance of supply chain security.

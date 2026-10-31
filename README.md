# FDR-Sentinel

**Evidence-first Fixed Deposit Receipt lifecycle assurance for AICTE-style regulatory workflows**

> **Hackathon prototype status:** This project is a functional frontend beta for demonstration with synthetic data. It is not connected to real banks, not a legal compliance system, and not approved by AICTE. Never treat a demo result as proof that an FDR was issued or remains valid.

## What is this project?

An **FDR** (Fixed Deposit Receipt) is a financial document issued by a bank or institution. FDR-Sentinel is designed to help institutions track, review, and monitor these documents throughout their lifecycle instead of handling scattered PDFs, spreadsheets, emails, and phone confirmations.

This prototype combines:

- A dashboard for viewing many FDR records
- An upload area for a PDF or image
- Demonstration OCR/extraction fields
- A simulated bank verification comparison
- A digital passport for one instrument
- Duplicate-review suggestions with readable reasons
- Maturity and renewal reminders
- An audit trail showing important actions

The prototype is based on a research review supplied for the project, with the main idea that an FDR should be assessed using **separate and traceable evidence sources** rather than one combined “verified/not verified” label.

## Beginner-friendly explanation

Imagine a regulatory office receives hundreds of fixed deposit documents from colleges or institutions.

Today, a reviewer may need to:

1. Download a PDF.
2. Check a depositor name manually.
3. Compare a maturity date on a spreadsheet.
4. Phone a bank or check a bank portal.
5. Search old submissions for a possible duplicate.
6. Record who approved or rejected the case.
7. Notice approaching maturity dates before an institution forgets to renew.

FDR-Sentinel gives reviewers one interface for these activities. In the beta, the information is synthetic and some actions are simulated, but the user workflow demonstrates how a complete system would operate.

## The most important design principle

FDR-Sentinel keeps three kinds of evidence separate:

| Evidence type | Meaning | Example |
|---|---|---|
| Institution-declared field | Value entered or stated by the institution | The depositor name in the submitted form |
| OCR-extracted field | Value extracted by an OCR/AI tool | The name detected from a scanned PDF |
| Bank-confirmed field | Value returned by an authorized bank source | The principal and maturity status on a bank ledger |

These sources must not be blended without explanation. They may disagree, and disagreement should create a review case—not an automatic fraud conclusion.

## Features included in this beta

### 1. Dashboard

The main dashboard provides:

- Portfolio value
- Number of records
- Verification coverage
- Renewal count
- Risk/flag count
- Navigation to every major workflow section

The values are seeded into the frontend and are clearly sample data.

### 2. PDF upload and OCR demonstration

Users can select a PDF or image with a file picker. The interface shows:

- The selected filename
- Depositor name
- FDR number
- Principal amount
- Issue date
- Maturity date
- Document-seal status

In this beta, upload does not send the file to an OCR engine. Selecting a file updates the demo status; the visible extracted fields use deterministic synthetic values.

### 3. Digital FDR passport

A passport is an evidence-linked record view for an individual FDR. It includes:

- Record ID
- Owner
- Bank/institution
- Principal
- Interest rate
- Issue date
- Maturity date
- Phone/contact fingerprint
- Branch
- Lifecycle status

Users can switch among the seeded records to view their passport data.

### 4. Bank verification comparison

The verification section shows institution-declared evidence beside bank-ledger evidence. This avoids presenting one score as proof and makes mismatches understandable.

This beta uses a simulated bank response. It must not be described as a live verification.

### 5. Duplicate detection explanation

The beta displays candidate duplicate pairs and a match score. It also lists the reasons for the score, such as:

- Similar depositor information
- Matching amount
- Matching maturity window
- Similar branch/ledger information
- Renewal or replacement relationships

A possible duplicate is only a review lead. It is never automatically labelled fraud.

### 6. Maturity and renewal monitoring

The interface contains:

- Timeline from issue to maturity
- Renewal reminders
- Rollover-review warning
- Institution renewal watchlist

These deadlines must be configured only from applicable AICTE requirements and approved procedures in a real deployment.

### 7. Audit history

The audit area lists actor, time, and action descriptions. A real product should append events immutably and link each significant action to its source evidence and authorization record.

## Demo data disclaimer

The following names, amounts, IDs, bank references, verification results, renewal states, and dashboard totals are synthetic:

- Ravindra Nair — FDR-20481
- Ananya Menon — FDR-19872
- Suhas Raman — FDR-18734

The bank responses are not from SBI, HDFC, Canara Bank, or any other real institution. The figures and verification outcomes only demonstrate UI behavior.

Do not paste real financial documents or personal information into this demo.

## Concept architecture

```text
User or institution
        |
        v
Submission UI
        |
        +--> PDF/image validation
        +--> OCR and normalized fields
        +--> Document tamper screening
        |
        v
Evidence record
Declared fields + OCR fields + source documents
        |
        +-----------------------------+
        |                             |
        v                             v
Authorized bank adapter         Duplicate and relationship engine
(Bank result is time-bound)     (Matching rules, renewal links)
        |                             |
        +-------------+---------------+
                      v
              Human review case
      Explainable conflict / candidate flag
                      |
                      v
          Role-authorized decision
                      |
                      v
             Append-only audit event
                      |
                      v
         Dashboard, report, and reminders
```

The UI currently represents parts of this architecture. A complete beta would place document processing, storage, verification, matching, workflow authorization, and audit controls on a backend.

## Why not rely on a single AI score?

OCR, document-image analysis, and duplicate matching are useful screening tools, but they have limits:

- OCR may make mistakes.
- A “similar” bank seal does not prove real bank issuance.
- A high duplicate score does not prove fraud.
- A hash proves that bytes have not changed since hashing; it does not prove the current issuer validity or bank balance.
- A file can be authentic yet contain incorrect data.
- Only an authorized institution response can confirm current bank status.

Therefore FDR-Sentinel should show evidence, confidence, source, time, and human review status. Consequential decisions should remain under authorized human control.

## Technology stack

### Current prototype

- Vite
- Vanilla TypeScript
- HTML and CSS
- Browser-side rendering
- Seeded synthetic in-memory data

### Recommended production stack from the supplied research

- Frontend/API: React and a Python FastAPI backend
- Database: PostgreSQL
- Secure files: encrypted object storage such as MinIO or a cloud equivalent
- OCR: Tesseract, PaddleOCR, or an approved OCR provider
- Image processing: OpenCV
- Matching: deterministic normalized-field comparison and fingerprints
- Relationship view: NetworkX initially; Neo4j only if relationship querying requires it
- Workflow: explicit state machine plus scheduled worker/Redis or Celery
- Security: HTTPS/TLS, encryption at rest, role-based access control, and append-only event records

Do not add a blockchain or graph neural network merely to make the demo look advanced. A simple, well-tested process is usually more defensible and easier to evaluate.

## How to run the project

### Requirements

- Windows, macOS, or Linux
- Node.js 20 or newer
- npm 10 or newer

### Installation

```bash
cd e:\fdr
npm install
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

For a fixed local port:

```bash
npx vite --host 0.0.0.0 --port 3000
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm run preview
```

The production output is written to the `dist/` directory.

## Deploying the beta on Render

This version is a static frontend. It does not require Render PostgreSQL, a web-service backend, or a Docker container.

### Before deployment: create a Git repository

Render must obtain the project from GitHub, GitLab, or Bitbucket. If the project is not yet in Git:

```bash
cd e:\fdr
git init
git add .
git commit -m "Create FDR-Sentinel beta"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with your GitHub/GitLab/Bitbucket repository URL. Never commit `node_modules/`, real PDF files, credentials, API keys, or personal financial data.

### Option 1: Deploy with a Blueprint

The repository includes `render.yaml`, which defines a static site named `fdr-sentinel-beta`.

1. Sign in to Render: <https://dashboard.render.com/>
2. Click **New +**.
3. Select **Blueprint**.
4. Choose the Git repository containing this project.
5. Confirm the repository branch, normally `main`.
6. Apply or create the blueprint.
7. Wait until the build finishes.

Render will run:

```bash
npm ci && npm run build
```

It will publish:

```text
dist/
```

You will receive a URL such as:

```text
https://fdr-sentinel-beta.onrender.com
```

### Option 2: Create a Static Site manually

Use this option if you do not want to use the Blueprint file.

1. In Render, click **New +**.
2. Select **Static Site**.
3. Connect the project repository.
4. Enter the following settings:

| Setting | Value |
|---|---|
| Name | `fdr-sentinel-beta` |
| Branch | `main` |
| Root Directory | Leave blank if the repository root is `e:\fdr` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Auto-Deploy | Yes |

5. Click **Create Static Site**.

The static service does not need environment variables in the current version because it uses synthetic in-browser data.

### SPA routing

The app uses same-page navigation anchors such as `#duplicates` and `#audit`, so server rewrites are not required for its current navigation.

The included Blueprint also contains a rewrite from `/*` to `/index.html`, which preserves compatibility if future React Router or pathname-based routes are added.

### Verify deployment

After the deployment succeeds:

1. Open the Render URL.
2. Confirm the dashboard title is visible.
3. Switch between passport records.
4. Select a local sample PDF or image in the upload control.
5. Confirm the filename and OCR demonstration update.
6. Open duplicate, maturity, verification, and audit sections.
7. Verify the page works on desktop and mobile widths.
8. Check the Render build log for TypeScript or Vite errors.

Do not open the deployment URL as proof of real bank verification. The hosted prototype is simulated unless a real authorized backend is added.

### Rendering through `render.yaml`

The deployment configuration is stored in `render.yaml`:

```yaml
services:
  - type: web
    name: fdr-sentinel-beta
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

If Render reports a configuration/schema problem, create the Static Site manually using the settings in Option 2 instead.

### Common deployment failures

#### Build fails during TypeScript checking

Run locally first:

```bash
npm ci
npm run build
```

Fix every compiler error before redeploying. Do not add an unrelated `--ignore` flag because it hides real defects.

#### Render cannot find `package.json`

Set **Root Directory** to the repository directory containing `package.json`. It should be blank if `package.json` is at the repository root.

#### Page opens but asset files do not load

Confirm **Publish Directory** is exactly:

```text
dist
```

Do not use `src`, `public`, or the repository root.

#### Upload does not process a real PDF

The beta only reads the browser filename and updates synthetic extraction fields. It does not contain OCR, PDF parsing, server upload, or real file storage. Real OCR requires a backend, usually Python FastAPI plus Tesseract/PaddleOCR, and an approved secure object-store integration.

#### It works locally but not on Render

- Push your latest commits.
- Confirm Render has started a new deploy.
- Clear browser cache or open a private window.
- Inspect browser console errors and Render build logs.
- Confirm the deployed branch contains `package.json` and `render.yaml`.

### Custom domain

For a later presentation or pilot domain:

1. Open the Static Site settings in Render.
2. Select **Custom Domains**.
3. Add the intended domain or subdomain.
4. Add the DNS records shown by Render at the domain provider.
5. Wait for DNS validation and the HTTPS certificate.
6. Test both HTTP redirection and HTTPS access.

### Current production limitations

A Render static deployment does not become a production FDR system. It still lacks:

- Backend API and database persistence
- Real OCR/PDF processing
- Secure file storage
- Authentication and role-based authorization
- Authorized bank-adapter integration
- Real duplicate matching
- Workflow state enforcement
- Tamper analysis
- Encryption, retention, incident response, and signed audit controls

For real-data deployment, place credentials and secrets only on Render's server-side service, never in browser JavaScript or repository files.

## Usage walkthrough

1. Open the dashboard.
2. Scroll to **PDF upload and OCR**.
3. Select any PDF or image to demonstrate the file upload state.
4. Review the synthetic extracted fields.
5. Open **Digital FDR passport** and switch between records.
6. Compare **Institution declaration** against **Bank ledger match**.
7. Review the **Duplicate detection with explainable matching** cards.
8. Open the maturity and audit sections.
9. Explain in the demo that the bank, OCR, matching, and document data are simulated.

## Suggested demo script for judges

> Our problem is that FDR management is fragmented across PDFs, spreadsheets, bank calls, email threads, and manual maturity reminders. FDR-Sentinel creates one evidence-linked record for the entire lifecycle. We explicitly separate institution declarations, OCR results, and simulated bank confirmation. Duplicate candidates include reasons and remain human-reviewed. Renewal deadlines trigger visible monitoring, and audit events preserve who performed each action. The current prototype demonstrates the complete user workflow using synthetic data; it does not claim real bank verification.

### Important beta speech

You should say:

- “This is a prototype.”
- “Bank verification is simulated.”
- “OCR is represented but not production-connected.”
- “The duplicate engine uses seed rules/demo records.”
- “No real FDR or personal data is used.”
- “Final consequential decisions require an authorized officer.”

## Evaluation plan

### OCR

Compare the system against manually labelled synthetic PDFs.

Suggested initial target: 95% exact match on clean synthetic documents. Report results separately for each field and document type instead of publishing one combined accuracy claim.

### Duplicate matching

Create labelled pairs for:

- Exact duplicates
- Near duplicates
- Unrelated instruments
- Renewals/replacements

Report precision, recall, false positives, and false negatives. Possible duplicates should not automatically trigger adverse action.

### Temporal rules

Test:

- Before maturity
- Within reminder window
- On maturity day
- After maturity
- Renewal/replacement state change

Every synthetic deadline test should produce the configured state.

### Role security

Add an automated test for every forbidden workflow transition, such as an institution user trying to approve its own submission or an unauthorized role exporting restricted evidence.

### Audit completeness

For every state-changing event, verify that the event records:

- Actor
- Timestamp
- Event/action
- Evidence source
- Rationale or authorization reference

### Administrative effort

Time the same review task manually and with the prototype. Only report a time reduction if you collect real measurements. Do not claim savings without evidence.

## Security and privacy requirements before real-data use

- Use least-privilege role-based access.
- Use HTTPS/TLS for every connection.
- Encrypt documents and database fields at rest.
- Do not put raw financial identifiers in browser logs or analytics.
- Keep uploaded documents in restricted object storage.
- Separate user roles: institution uploader, reviewer, approver, administrator, and auditor.
- Record every state-changing action.
- Use authorized bank interfaces only.
- Obtain consent and approval for real personal/financial data.
- Define retention, deletion, backup, incident-response, and access-review policies.
- Add secure session management, CSRF protection, content validation, malware scanning, and rate limits.
- Never expose synthetic/demo flags as real verification in production.

## Beta suitability assessment

### Suitable as a national-hackathon beta: Yes, with qualification

The prototype is suitable for a **hackathon proof-of-concept presentation** because it demonstrates:

- A clear regulatory problem
- A coherent end-user dashboard
- Multiple connected lifecycle stages
- Evidence separation instead of a misleading single score
- Explainable duplicate candidates
- Human-review-oriented workflow
- Responsible labeling of simulations
- A roadmap grounded in a literature review

### Suitable as an operational banking product: No

It is not operationally ready because the current code has:

- No real backend
- No real OCR engine
- No real PDF parsing
- No file storage
- No bank adapter or authenticated source
- No database persistence
- No user accounts or role enforcement
- No tamper model
- No real duplicate engine
- No workflow state machine
- No production audit database
- No encryption and privacy controls
- No automated test suite

A strong hackathon submission can present these as **next-stage implementation goals**, not hide them as completed features.

## Recommended improvements before submission

### Priority 1 — Make the prototype honest

- Add visible “Demo data” and “Simulated” labels.
- Add an architecture slide showing what is prototype versus planned.
- Ensure the presentation does not imply live bank verification.

### Priority 2 — Add one real backend workflow

- Create a FastAPI or Node API.
- Accept a real synthetic PDF.
- Store metadata in SQLite for a demo or PostgreSQL for a full prototype.
- Run OCR using Tesseract or PaddleOCR.
- Save extracted fields separately with confidence values.

### Priority 3 — Implement one complete test scenario

Recommended: **bank mismatch case**.

1. Upload a synthetic PDF.
2. Extract fields.
3. Create an unverified passport.
4. Let a mock adapter return a conflicting amount.
5. Create a scrutiny case.
6. Require a reviewer role.
7. Record the decision and rationale.

This is more convincing than multiple screens with no connected backend.

### Priority 4 — Demonstrate persistence and audit

- Store records in a database.
- Restart the server and confirm records still exist.
- Add one append-only audit log view.
- Display exact timestamps and actors.

### Priority 5 — Add role controls

Start with three roles:

- Institution uploader
- Scrutiny officer
- Auditor

Demonstrate that the uploader cannot approve their own submission.

### Priority 6 — Add automated validation

Add tests for:

- File type acceptance
- Required OCR fields
- Maturity-window calculations
- Forbidden workflow transitions
- Audit event creation

## Judging narrative

### Problem

FDR review is document-heavy, fragmented, and slow. Mature instruments can also be missed without effective reminders.

### Innovation

The project proposes an evidence-first lifecycle workflow rather than a simple document approval button. It links declared values, OCR values, bank evidence, relationships, renewal history, and human decisions.

### User

Primary users are institution staff, regulatory reviewers, approvers, and auditors. The prototype is designed around the regulator’s review workflow while preserving source separation.

### Feasibility

The frontend is functional and the MVP can begin with deterministic OCR rules and transparent matching. A real deployment can adopt infrastructure incrementally and authenticate against approved bank/registry sources.

### Impact

Potential benefits include better administrative visibility, faster case preparation, fewer repeated searches, earlier maturity monitoring, and more traceable decisions. These are proposed benefits, not measured outcomes.

### Ethics and governance

All signals are review leads. Consequential decisions require human authorization, and real bank verification must be performed through approved mechanisms.

## Safest wording for the presentation and README

Use:

- “Functional frontend beta”
- “Synthetic evidence demonstration”
- “Simulated bank adapter”
- “Candidate duplicate match”
- “Human-review workflow”
- “Lifecycle-assurance concept”

Avoid:

- “AI detects fraud”
- “Live bank verification”
- “99% accuracy”
- “Blockchain-verified”
- “Guaranteed duplicate detection”
- “Regulation-ready”

## Useful project links

- Live prototype: `http://localhost:3000`
- Source entry point: `src/main.ts`
- Styling: `src/style.css`
- Supplied concept research PDF: `FDR_SENTINEL_Updated_Research_Review_2021-2026.pdf`

## Disclaimer

FDR-Sentinel is an educational and hackathon prototype. It does not provide legal advice, financial advice, real bank verification, fraud judgments, or an official representation of AICTE systems. Applicable laws, regulations, authorized procedures, data protection requirements, and approved institutional processes must control any future real-world implementation.

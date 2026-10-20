# Rejection Audit — Ntwanano A Hlungwane Portfolio
*Honest, role-agnostic review. Every point below is a reason a real hiring manager could pass.*

---

## 1. Education — auto-fail at many companies

**National Diploma, not a degree.**
Many ATS systems at large tech companies (banks, consultancies, multinationals) have a minimum of a Bachelor's degree hard-coded. A diploma from Vaal University of Technology does not pass that filter, regardless of what is on the rest of the CV. The filter never sees the AWS savings.

Counterargument: most South African startups and product companies don't enforce this. But government, banking, and consulting pipeline work does.

---

## 2. No AWS certification for someone claiming AWS as a core skill

The Credly badges shown are vendor-accreditation badges (Anthropic/partner program), not AWS certifications. The skills section lists EC2, VPC, RDS/Aurora, Lambda, ECS, API Gateway, Elastic Beanstalk, S3, Bedrock, Cost Explorer, OpenTofu/Terraform.

A senior engineer reviewing this CV will ask: "If you really do this much AWS work, why is there no AWS Certified Solutions Architect, Developer, or SysOps badge?" The absence suggests either the depth is thinner than the list looks, or the candidate hasn't invested in validation.

Fix: SAA-C03 (Solutions Architect Associate) is the minimum expected. DVA-C02 or SOA-C02 would close the gap entirely.

---

## 3. Junior title for almost two years at the current company

Start: Dec 2024. Role change to "Junior Full-stack Developer": Jan 2026. Still junior as of Oct 2026.
That is 22 months at the same company without a mid-level promotion. A hiring manager reading this asks: "Why haven't they been promoted? Is Skywalk small enough that there are no mid-level slots, or is there a performance reason?" Either way, the candidate has to explain it in a call — it doesn't sell itself.

---

## 4. The savings ledger is a janitorial task, not an architecture portfolio

Deleting idle databases, removing unused VPC endpoints, and right-sizing Fargate containers are standard AWS hygiene. Every DevOps or cloud engineer does this quarterly. The work is real and the numbers are real, but the question a senior engineer asks is: "What did you design? What did you build from scratch? What would break if you left?"

None of the savings rows show a new system that was conceived, designed, and shipped. The ECS-to-Lambda migration is the strongest entry, but it still describes a migration of existing work, not a greenfield architecture.

This section would be more convincing if it included: initial architecture diagram, constraints considered, migration risk, the code change, and a traffic graph before/after.

---

## 5. The main project is not live

BringDvibes — "September 2026 · not live yet."

A booking app described as the primary project should be live. "Not live yet" reads as: either there are customers who haven't paid, or the project stalled. Neither reads well. A recruiter who clicks the GitHub link and finds a private repo, and then visits the app URL and finds nothing, has nothing to verify the claims.

---

## 6. Both GitHub repositories are currently private

As of Oct 2026, `bringdvibes` and `agent-office` are both private. The GitHub link on the portfolio goes to a profile with no visible public work. For a candidate claiming "built Stripe and Paystack payment flows … covered by Playwright end-to-end tests", the code should be readable.

---

## 7. GitHub username does not match the professional name

`Mr-OxMorningstar` is the GitHub handle. The CV says Ntwanano A Hlungwane. There is no visible alias bridge. A recruiter who Googles "Ntwanano Hlungwane GitHub" does not find the account. A recruiter who searches GitHub for `ntwanano-hlungwane` finds nothing. The username is a minor brand inconsistency that becomes a discovery failure.

---

## 8. No production-scale evidence

Nothing on the page answers: how many users? How much traffic? How much data? A booking app, a 3D office, and cloud cost cuts are all described at the feature and task level, not at the scale level. "Our React/TypeScript SaaS product" — how many paying tenants? 3? 3,000?

Senior roles at companies with real traffic want to know if the candidate has operated at load.

---

## 9. "Where a number is an estimate rather than a measurement, the page says so."

This sentence, meant as a transparency signal, also flags uncertainty in the mind of the reader. The subtext the reader hears is: "some of these numbers might be estimates." If every row is measured (which they are), the sentence is unnecessary. It introduces doubt it was meant to pre-empt.

---

## 10. No system design or architectural ownership shown

The experience reads as: feature delivery, maintenance, migrations, and cost cleanup. There is no entry that says "I designed the system" or "I chose this architecture over the alternatives and here is why." No ADRs, no diagrams, no constraints, no trade-offs.

For a "full-stack engineer" title without a degree, architectural thinking is the differentiator. It is not shown.

---

## 11. The "random advice" section

On a job-hunting portfolio, asking visitors to "leave a piece of random advice" is charming in person and ambiguous in text. A conservative hiring manager at a bank or consultancy might read it as immature. The advice stays in the browser and is never sent — so the candidate gets nothing from it either.

This section has low upside and nonzero downside depending on audience.

---

## 12. Short total experience for the seniority the portfolio implies

2023 to Oct 2026 = roughly 3 years and 9 months. The portfolio does not say "junior" anywhere except the job history, but the headline ("Full-stack engineer"), the stat callout (US$1,300+/mo), and the three-project layout are positioning at a mid-level. In markets outside South Africa — EU, US — mid-level typically means 4–6 years with a degree or 6–8 without one. This candidate is below both thresholds.

---

## 13. Python listed as a language; evidence is scripts only

Two Python entries: a CV parser (AWS Bedrock + Python) and "Python scripts that automated spreadsheet and admin work." Neither shows a production Python service, a tested module, or anything beyond scripting. Listing Python as a core language next to TypeScript and Java invites questions the evidence does not support.

---

## 14. Aions Creative Technology work is vague

Four highlights from Aions, none of which name a specific product, outcome, or metric. "Built responsive web applications" — how many? For which clients? "Refactored legacy code to current standards" — whose standards? "Drafted technical proposals for prospective clients" — were any won?

The Aions section is the first two years of the career. Leaving it vague makes the most formative period invisible.

---

## 15. Location and time zone (double-edged)

Johannesburg is UTC+2. For EU roles, the overlap is excellent. For US roles, the overlap is 2–5 hours depending on the coast — workable but limited. For US employers who have never hired in SA, there is also unfamiliarity with local employment law and payment logistics (no SWIFT in some smaller companies, EFT timing, etc.).

This is not a fatal issue for remote-first companies with SA experience, but it is a friction point that some hiring managers use as a tiebreaker when choosing between two otherwise equal candidates.

---

## Summary table

| # | Issue | Who rejects on this |
|---|-------|---------------------|
| 1 | Diploma, not degree | Banks, consultancies, multinationals with ATS filters |
| 2 | No AWS cert for AWS-heavy role | Mid-to-senior cloud/DevOps reviewers |
| 3 | Still junior after 22 months | Hiring managers asking why no promotion |
| 4 | Savings = janitorial, not architecture | Senior engineers reviewing for depth |
| 5 | Main project not live | Any recruiter who checks the link |
| 6 | Both repos private | Any engineer who tries to read the code |
| 7 | GitHub username mismatch | Anyone searching the name |
| 8 | No production-scale evidence | Companies with real traffic |
| 9 | Estimate disclaimer creates doubt | Detail-focused reviewers |
| 10 | No system design shown | Senior roles, staff-level hiring |
| 11 | Random advice section | Conservative or formal employers |
| 12 | 3.75 years for mid-level positioning | International/EU/US hiring managers |
| 13 | Python listed but only scripts shown | Technical reviewers |
| 14 | Aions section is vague | Anyone who reads the first two years closely |
| 15 | SA location friction for US roles | US employers unfamiliar with SA remote work |

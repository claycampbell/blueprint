# 8. CI/CD & Release Practices

## 8.1 Required CI Stages

Every PR triggers this pipeline:

1. **Build:** Compile/bundle, verify dependencies
2. **Lint:** Code style, formatting, type checking
3. **Test:** Unit, integration, contract tests
4. **Security:** Dependency scanning, secret detection, SAST
5. **Quality:** Coverage check, complexity metrics

**Rule:** All stages must pass. No "merge anyway" culture.

---

## 8.2 Deployment Pipeline

Default promotion model (adapt per client):

```
PR merged → Deploy to staging (auto) → Smoke tests pass → Deploy to prod (auto or manual gate)
```

### Deployment Strategies

- **Default:** Rolling deployment with health checks
- **Risky changes:** Canary (10% → 50% → 100%)
- **Database migrations:** Blue/green with traffic shift
- **Feature flags:** Use for incomplete features, A/B tests, gradual rollouts

---

## 8.3 Rollback Requirements

Every deployment must be rollback-ready.

- One-command rollback in runbook (documented and tested)
- Database migrations must be backward-compatible
- Zero-downtime deployments required for production services
- **Rollback decision:** If error rate spikes >2x baseline, rollback immediately

---

## 8.4 AI-Assisted CI/CD

- **Failing pipeline:** Paste logs into AI, ask for diagnosis and fix
- **New pipeline:** Describe requirements, let AI draft GitHub Actions/GitLab CI config
- **Optimization:** Share pipeline config, ask "How can this be faster without sacrificing safety?"

```
Prompt: "This GitHub Actions workflow is failing. Here's the log.
        What's the root cause and how do I fix it?"
```

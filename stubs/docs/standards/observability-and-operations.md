# 9. Observability, Reliability & Operations

## 9.1 Observability Requirements

Every production service must have:

### Logging

- Structured JSON logs (not plain text)
- Request ID correlation across services
- Log levels: DEBUG (dev only), INFO, WARN, ERROR
- Sensitive data redaction (PII, secrets)

### Metrics

- Request rate, error rate, latency (RED metrics)
- Business metrics relevant to the service
- Resource utilization (CPU, memory, connections)
- Dashboard with key metrics visible

### Tracing

- Distributed tracing enabled (OpenTelemetry preferred)
- Trace ID propagated across service boundaries
- Critical paths instrumented

---

## 9.2 SLOs and Reliability

Every service defines:

- **Availability SLO:** e.g., 99.9% uptime (allows ~8 hours downtime/year)
- **Latency SLO:** e.g., p99 response time <500ms
- **Error rate SLO:** e.g., <0.1% 5xx responses

**Alerting rule:** Alert when approaching SLO budget consumption, not just on individual errors.

---

## 9.3 Incident Response

1. **Detect:** Alert fires or user report received
2. **Acknowledge:** On-call responds within 15 minutes
3. **Diagnose:** Use logs, metrics, traces to identify issue
4. **Mitigate:** Rollback, feature flag off, or hotfix
5. **Communicate:** Update status page, notify stakeholders
6. **Resolve:** Confirm issue is fixed, monitor for recurrence
7. **Review:** Blameless postmortem within 48 hours for major incidents

---

## 9.4 AI-Assisted Operations

- **Log analysis:** "Summarize errors in the last hour. What's the common pattern?"
- **What changed:** "Compare deployments from yesterday vs today. What changed that could cause this?"
- **Incident timeline:** "Based on these logs and metrics, draft a timeline of what happened."
- **Postmortem drafting:** "Generate a postmortem document from this incident. Include: summary, timeline, root cause, action items."

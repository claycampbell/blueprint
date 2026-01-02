Let me sketch this out:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                            │
│  THE ENGINE: A COLLECTION OF COMPOSABLE SERVICES                                                                                                           │
│  ───────────────────────────────────────────────────                                                                                                       │
│                                                                                                                                                            │
│                                                                                                                                                            │
│                                    ┌─────────────────────────────────────┐                                                                                 │
│                                    │                                     │                                                                                 │
│                                    │      UI / BUTTON ACTIONS            │                                                                                 │
│                                    │                                     │                                                                                 │
│                                    └───────────────┬─────────────────────┘                                                                                 │
│                                                    │                                                                                                       │
│                                                    ▼                                                                                                       │
│     ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│     │                                                                                                                                                  │  │
│     │                                         EVENT BUS / ACTION DISPATCHER                                                                            │  │
│     │                                                                                                                                                  │  │
│     │    "Designer uploaded floor_plan to property 123 in VS4"                                                                                         │  │
│     │                                                                                                                                                  │  │
│     └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                    │                                                                                                       │
│                    ┌───────────────┬───────────────┼───────────────┬───────────────┬───────────────┐                                                       │
│                    │               │               │               │               │               │                                                       │
│                    ▼               ▼               ▼               ▼               ▼               ▼                                                       │
│             ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                                                │
│             │             │ │             │ │             │ │             │ │             │ │             │                                                │
│             │  Checklist  │ │ Notification│ │   Access    │ │   Status    │ │   Audit     │ │   Gate      │                                                │
│             │  Service    │ │  Service    │ │  Service    │ │  Service    │ │  Service    │ │  Service    │                                                │
│             │             │ │             │ │             │ │             │ │             │ │             │                                                │
│             └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                                                │
│                    │               │               │               │               │               │                                                       │
│                    │               │               │               │               │               │                                                       │
│                    └───────────────┴───────────────┴───────────────┴───────────────┴───────────────┘                                                       │
│                                                    │                                                                                                       │
│                                                    ▼                                                                                                       │
│                                    ┌─────────────────────────────────────┐                                                                                 │
│                                    │                                     │                                                                                 │
│                                    │           DATABASE                  │                                                                                 │
│                                    │                                     │                                                                                 │
│                                    └─────────────────────────────────────┘                                                                                 │
│                                                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                            │
│  THE CORE SERVICES                                                                                                                                         │
│  ─────────────────                                                                                                                                         │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  1. DOCUMENT SERVICE                                                                                                                                       │
│  ───────────────────                                                                                                                                       │
│  • upload(property_id, value_stream_id, category, file, user)                                                                                              │
│  • replace(document_id, file, user)                                                                                                                        │
│  • get_for_property(property_id, filters)                                                                                                                  │
│  • set_status(document_id, status, user)                                                                                                                   │
│                                                                                                                                                            │
│  Emits: document_uploaded, document_replaced, document_status_changed                                                                                      │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  2. CHECKLIST SERVICE                                                                                                                                      │
│  ─────────────────────                                                                                                                                     │
│  • evaluate(property_id, value_stream_id)  → recalculates all checklist items                                                                              │
│  • mark_complete(property_id, checklist_item_id, user)                                                                                                     │
│  • mark_incomplete(property_id, checklist_item_id, user)                                                                                                   │
│  • get_progress(property_id, value_stream_id) → { completed: 5, total: 8, pct: 62 }                                                                        │
│                                                                                                                                                            │
│  Listens: document_uploaded, document_status_changed                                                                                                       │
│  Emits: checklist_item_completed, progress_changed                                                                                                         │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  3. GATE SERVICE                                                                                                                                           │
│  ───────────────                                                                                                                                           │
│  • evaluate_property(property_id)  → checks all VS gates, updates statuses                                                                                 │
│  • can_unlock(property_id, value_stream_id) → bool                                                                                                         │
│  • get_blockers(property_id, value_stream_id) → [what's preventing unlock]                                                                                 │
│                                                                                                                                                            │
│  Listens: progress_changed, vs_marked_complete                                                                                                             │
│  Emits: value_stream_unlocked, value_stream_completed                                                                                                      │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  4. ACCESS SERVICE                                                                                                                                         │
│  ─────────────────                                                                                                                                         │
│  • can_view_property(user, property_id) → bool                                                                                                             │
│  • can_edit_document(user, document_id) → bool                                                                                                             │
│  • can_upload_category(user, category_id) → bool                                                                                                           │
│  • get_visible_properties(user, value_stream_id) → [properties]                                                                                            │
│  • get_visible_value_streams(user) → [value_streams]                                                                                                       │
│                                                                                                                                                            │
│  Pure query service - no events                                                                                                                            │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  5. ASSIGNMENT SERVICE                                                                                                                                     │
│  ─────────────────────                                                                                                                                     │
│  • assign(property_id, user_id, value_stream_id, assigned_by)                                                                                              │
│  • unassign(property_id, user_id, value_stream_id)                                                                                                         │
│  • get_assignees(property_id, value_stream_id) → [users]                                                                                                   │
│  • get_assignments(user_id) → [property assignments]                                                                                                       │
│                                                                                                                                                            │
│  Emits: user_assigned, user_unassigned                                                                                                                     │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  6. NOTIFICATION SERVICE                                                                                                                                   │
│  ───────────────────────                                                                                                                                   │
│  • Listens to events and determines who needs to know                                                                                                      │
│  • notify(user_id, notification_type, data)                                                                                                                │
│  • get_notifications(user_id) → [notifications]                                                                                                            │
│  • mark_read(notification_id)                                                                                                                              │
│                                                                                                                                                            │
│  Listens: document_uploaded, user_assigned, value_stream_unlocked, etc.                                                                                    │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  7. AUDIT SERVICE                                                                                                                                          │
│  ────────────────                                                                                                                                          │
│  • log(property_id, action, actor, details)                                                                                                                │
│  • get_history(property_id, filters) → [audit entries]                                                                                                     │
│                                                                                                                                                            │
│  Listens: ALL events - logs everything                                                                                                                     │
│                                                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                            │
│  EXAMPLE FLOW: Designer Uploads Floor Plan                                                                                                                 │
│  ─────────────────────────────────────────────                                                                                                             │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  1. UI: Designer clicks upload, selects floor_plan.pdf                                                                                                     │
│         ↓                                                                                                                                                  │
│  2. API endpoint calls:                                                                                                                                    │
│         access_service.can_upload_category(user, "floor_plan")  → True                                                                                     │
│         document_service.upload(property_id, vs4, "floor_plan", file, user)                                                                                │
│         ↓                                                                                                                                                  │
│  3. Document Service:                                                                                                                                      │
│         • Saves file                                                                                                                                       │
│         • Creates document record                                                                                                                          │
│         • Emits: document_uploaded { property_id, document_id, category, user, vs }                                                                        │
│         ↓                                                                                                                                                  │
│  4. Checklist Service (listening):                                                                                                                         │
│         • Sees document_uploaded for category "floor_plan"                                                                                                 │
│         • Finds checklist item: "Floor plan uploaded" (completion_type: document_exists)                                                                   │
│         • Marks it complete                                                                                                                                │
│         • Recalculates progress: 60% → 70%                                                                                                                 │
│         • Emits: checklist_item_completed, progress_changed { property_id, vs4, 70% }                                                                      │
│         ↓                                                                                                                                                  │
│  5. Gate Service (listening):                                                                                                                              │
│         • Sees progress_changed                                                                                                                            │
│         • Checks: is VS4 now 100%? No (70%)                                                                                                                │
│         • No action                                                                                                                                        │
│         ↓                                                                                                                                                  │
│  6. Notification Service (listening):                                                                                                                      │
│         • Sees document_uploaded                                                                                                                           │
│         • Looks up: who should be notified of floor_plan uploads?                                                                                          │
│         • Finds: Design Manager for this property                                                                                                          │
│         • Creates notification: "Jane uploaded Floor Plan to 123 Main St"                                                                                  │
│         ↓                                                                                                                                                  │
│  7. Audit Service (listening):                                                                                                                             │
│         • Sees document_uploaded                                                                                                                           │
│         • Logs: { property: 123, action: "document_uploaded", actor: Jane, details: {...} }                                                                │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  ALL OF THIS FROM ONE BUTTON CLICK.                                                                                                                        │
│  The services handle the cascade.                                                                                                                          │
│                                                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                            │
│  THE AI / CONFIGURATION LAYER                                                                                                                              │
│  ────────────────────────────────                                                                                                                          │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  Business person writes a document like:                                                                                                                   │
│  ───────────────────────────────────────                                                                                                                   │
│                                                                                                                                                            │
│      VALUE STREAM: VS4 Design & Entitlement                                                                                                                │
│                                                                                                                                                            │
│      CHECKLIST:                                                                                                                                            │
│      - Floor plan uploaded (auto: when floor_plan document exists)                                                                                         │
│      - Site plan uploaded (auto: when site_plan document exists)                                                                                           │
│      - Civil engineer docs received (auto: when civil document exists)                                                                                     │
│      - Floor plan approved (auto: when floor_plan document status = approved)                                                                              │
│      - Builder sign-off received (manual)                                                                                                                  │
│      - Permit packet assembled (manual)                                                                                                                    │
│                                                                                                                                                            │
│      NOTIFICATIONS:                                                                                                                                        │
│      - When floor_plan uploaded → notify design_manager                                                                                                    │
│      - When any document needs_revision → notify uploader                                                                                                  │
│      - When VS4 complete → notify underwriting_manager                                                                                                     │
│                                                                                                                                                            │
│      ROLES:                                                                                                                                                │
│      - design_manager: can upload all, can approve all, sees all properties                                                                                │
│      - designer: can upload floor_plan/site_plan/rendering, sees assigned only                                                                             │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  AI parses this into:                                                                                                                                      │
│  ────────────────────                                                                                                                                      │
│                                                                                                                                                            │
│      checklist_items: [                                                                                                                                    │
│        { key: "floor_plan_uploaded", name: "Floor plan uploaded",                                                                                          │
│          completion_type: "document_exists", config: { category: "floor_plan" } },                                                                         │
│        { key: "floor_plan_approved", name: "Floor plan approved",                                                                                          │
│          completion_type: "document_approved", config: { category: "floor_plan" } },                                                                       │
│        { key: "builder_signoff", name: "Builder sign-off received",                                                                                        │
│          completion_type: "manual", config: {} },                                                                                                          │
│        ...                                                                                                                                                 │
│      ]                                                                                                                                                     │
│                                                                                                                                                            │
│      notification_rules: [                                                                                                                                 │
│        { event: "document_uploaded", filter: { category: "floor_plan" },                                                                                   │
│          notify_role: "design_manager" },                                                                                                                  │
│        { event: "document_status_changed", filter: { status: "needs_revision" },                                                                           │
│          notify: "uploader" },                                                                                                                             │
│        ...                                                                                                                                                 │
│      ]                                                                                                                                                     │
│                                                                                                                                                            │
│      role_document_category_access: [                                                                                                                      │
│        { role: "design_manager", category: "floor_plan", can_upload: true, can_approve: true },                                                            │
│        { role: "designer", category: "floor_plan", can_upload: true, can_approve: false },                                                                 │
│        ...                                                                                                                                                 │
│      ]                                                                                                                                                     │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  The SERVICES don't change.                                                                                                                                │
│  The DATA drives the behavior.                                                                                                                             │
│  AI helps translate business intent → data.                                                                                                                │
│                                                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                            │
│  THE ENGINE CONCEPT                                                                                                                                        │
│  ──────────────────                                                                                                                                        │
│                                                                                                                                                            │
│                                                                                                                                                            │
│                         ┌─────────────────────────────────────────────────────────────────────────┐                                                        │
│                         │                                                                         │                                                        │
│                         │   CONFIGURATION (Data)                                                  │                                                        │
│                         │                                                                         │                                                        │
│                         │   • Checklist items & completion rules                                  │                                                        │
│                         │   • Notification rules                                                  │                                                        │
│                         │   • Role permissions                                                    │                                                        │
│                         │   • Gate definitions                                                    │                                                        │
│                         │   • Document categories                                                 │                                                        │
│                         │                                                                         │                                                        │
│                         │   ↑ AI CAN GENERATE THIS FROM BUSINESS DOCS                            │                                                        │
│                         │                                                                         │                                                        │
│                         └─────────────────────────────────────────────────────────────────────────┘                                                        │
│                                                    │                                                                                                       │
│                                                    │ drives                                                                                                │
│                                                    ▼                                                                                                       │
│                         ┌─────────────────────────────────────────────────────────────────────────┐                                                        │
│                         │                                                                         │                                                        │
│                         │   ENGINE (Services)                                                     │                                                        │
│                         │                                                                         │                                                        │
│                         │   • Document Service                                                    │                                                        │
│                         │   • Checklist Service                                                   │                                                        │
│                         │   • Gate Service                                                        │                                                        │
│                         │   • Access Service                                                      │                                                        │
│                         │   • Assignment Service                                                  │                                                        │
│                         │   • Notification Service                                                │                                                        │
│                         │   • Audit Service                                                       │                                                        │
│                         │                                                                         │                                                        │
│                         │   ↑ DEVS BUILD ONCE, RARELY CHANGE                                      │                                                        │
│                         │                                                                         │                                                        │
│                         └─────────────────────────────────────────────────────────────────────────┘                                                        │
│                                                    │                                                                                                       │
│                                                    │ operates on                                                                                           │
│                                                    ▼                                                                                                       │
│                         ┌─────────────────────────────────────────────────────────────────────────┐                                                        │
│                         │                                                                         │                                                        │
│                         │   RUNTIME STATE (Data)                                                  │                                                        │
│                         │                                                                         │                                                        │
│                         │   • Properties                                                          │                                                        │
│                         │   • Documents                                                           │                                                        │
│                         │   • Property VS statuses                                                │                                                        │
│                         │   • Property checklist statuses                                         │                                                        │
│                         │   • Assignments                                                         │                                                        │
│                         │   • Audit log                                                           │                                                        │
│                         │                                                                         │                                                        │
│                         └─────────────────────────────────────────────────────────────────────────┘                                                        │
│                                                                                                                                                            │
│                                                                                                                                                            │
│  The beauty:                                                                                                                                               │
│  ───────────                                                                                                                                               │
│  • Business changes requirements → AI updates configuration → Engine just works                                                                            │
│  • New value stream → add config data → no code changes                                                                                                    │
│  • New document category → add config data → no code changes                                                                                               │
│  • New notification rule → add config data → no code changes                                                                                               │
│                                                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

This is the pattern you're describing: **data-driven services**. The services are the engine, the configuration is the fuel. AI becomes the translator from business intent to configuration.


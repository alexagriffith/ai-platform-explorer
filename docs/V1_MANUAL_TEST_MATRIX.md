# V1 manual checks (lib + flows)

Use after `npm run build` and when touching workshop logic. Automated coverage lives in `src/lib/libPureFunctions.test.js` (`npm test`).

## `reconcileContainerAiPlatform`

- Pick RHOAI with **Kubernetes** as container → runtime becomes **OpenShift** (OpenShift-only AI wins first).
- Pick **RHAI** with **Kubernetes** → unchanged valid pair.
- **RHEL hosts + RHAI** → AI becomes **`rhel-ai`**.
- **RHEL hosts + RHOAI** → runtime is coerced to **OpenShift** first (RHOAI precedence); does **not** produce RHEL AI + RHEL hosts in one step.

## `capabilityMapToFlowShape` / `collectFlowLayersFromNested`

- Flat map with only `model-serving: ai-inference` → flow shape has `services.model-serving`; layers collection non-empty when infra+platform+serving exist together.

## `export stack` (Build Your Stack)

- Configure a stack → **Export Stack** saves the layer canvas (selected cards and legend) as shown.

## UI smoke

- Build Your Stack: configure modal backdrop closes without change; header ✕ removes capability.
- Data flow modal: focus mode dims non-neighbors; solid vs dashed edges visible when multiple layers exist.
- Data flow modal: **Copy summary** puts plain text on the clipboard (no Markdown file export).

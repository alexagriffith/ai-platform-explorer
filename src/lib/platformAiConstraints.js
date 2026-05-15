/**
 * Workshop alignment with planning/FINAL_V1_SCOPE.md (Decision 12–13):
 * - RHOAI / RHAIE assume Red Hat OpenShift as the container platform.
 * - "Existing Kubernetes" (non-OCP) maps the AI/ML platform choice to Red Hat AI (RHAI) only.
 * - "RHEL servers" is the primary runtime for Red Hat Enterprise Linux AI in this explorer (bare metal / VMs).
 */

export const CONTAINER_PLATFORM_CAPABILITY_ID = 'container-platform';
export const AI_PLATFORM_CAPABILITY_ID = 'ai-platform';
export const MCP_CAPABILITY_ID = 'mcp';
export const LLAMA_STACK_CAPABILITY_ID = 'llama-stack';

const OPENSHIFT = 'openshift';
const KUBERNETES = 'kubernetes';
const RHEL_HOSTS = 'rhel-hosts';

/** Red Hat MCP SKUs in this explorer are modeled on OpenShift operators, not the RHEL-server-only path. */
const MCP_REDHAT_OPTION_IDS = new Set(['rh-mcp-full', 'rh-mcp-catalog', 'rh-mcp-registry']);

/** RHOAI and bundled RHAIE are OpenShift products; not offered on generic Kubernetes in this tool. */
const OPENSHIFT_ONLY_AI = new Set(['rhoai', 'rhaie']);

/** RHEL AI is positioned for single-server / edge; primary pairing is the RHEL-servers runtime, not Kubernetes. */
const KUBERNETES_AI_ONLY = 'rhai';
const RHEL_SERVER_AI = 'rhel-ai';

/**
 * Returns a new flat capability map with incompatible container ↔ AI combinations removed or coerced.
 */
export function reconcileContainerAiPlatform(flatMap) {
  const out = { ...flatMap };
  let infra = out[CONTAINER_PLATFORM_CAPABILITY_ID];
  let ai = out[AI_PLATFORM_CAPABILITY_ID];

  if (OPENSHIFT_ONLY_AI.has(ai)) {
    out[CONTAINER_PLATFORM_CAPABILITY_ID] = OPENSHIFT;
    infra = OPENSHIFT;
  }

  if (infra === RHEL_HOSTS) {
    out[AI_PLATFORM_CAPABILITY_ID] = RHEL_SERVER_AI;
    ai = RHEL_SERVER_AI;
  }

  if (infra === KUBERNETES) {
    if (OPENSHIFT_ONLY_AI.has(ai) || ai === RHEL_SERVER_AI) {
      out[AI_PLATFORM_CAPABILITY_ID] = KUBERNETES_AI_ONLY;
    }
    ai = out[AI_PLATFORM_CAPABILITY_ID];
  }

  if (infra === OPENSHIFT && ai === KUBERNETES_AI_ONLY) {
    delete out[AI_PLATFORM_CAPABILITY_ID];
  }

  const infraFinal = out[CONTAINER_PLATFORM_CAPABILITY_ID];
  const mcpSel = out[MCP_CAPABILITY_ID];
  if (mcpSel && MCP_REDHAT_OPTION_IDS.has(mcpSel) && infraFinal !== OPENSHIFT) {
    delete out[MCP_CAPABILITY_ID];
  }

  const llamaSel = out[LLAMA_STACK_CAPABILITY_ID];
  if (llamaSel === 'llama-stack-distribution' && infraFinal === KUBERNETES) {
    delete out[LLAMA_STACK_CAPABILITY_ID];
  }

  return out;
}

/**
 * Returns true when this option is not valid for the current flat map (show disabled / greyed out).
 */
export function isCapabilityOptionDisabled(capability, optionId, flatMap) {
  const map = flatMap && typeof flatMap === 'object' ? flatMap : {};
  const infra = map[CONTAINER_PLATFORM_CAPABILITY_ID];
  const ai = map[AI_PLATFORM_CAPABILITY_ID];

  if (capability.id === AI_PLATFORM_CAPABILITY_ID) {
    if (infra === KUBERNETES) return optionId !== KUBERNETES_AI_ONLY;
    if (infra === RHEL_HOSTS) return optionId !== RHEL_SERVER_AI;
    if (infra === OPENSHIFT) return optionId === KUBERNETES_AI_ONLY;
    return false;
  }

  if (capability.id === CONTAINER_PLATFORM_CAPABILITY_ID) {
    if (OPENSHIFT_ONLY_AI.has(ai)) return optionId !== OPENSHIFT;
    if (ai === KUBERNETES_AI_ONLY) return optionId !== KUBERNETES;
    if (ai === RHEL_SERVER_AI) return optionId !== OPENSHIFT && optionId !== RHEL_HOSTS;
    return false;
  }

  if (capability.id === MCP_CAPABILITY_ID) {
    if (MCP_REDHAT_OPTION_IDS.has(optionId)) return infra !== OPENSHIFT;
    return false;
  }

  if (capability.id === LLAMA_STACK_CAPABILITY_ID) {
    if (optionId === 'llama-stack-distribution') return infra === KUBERNETES;
    return false;
  }

  return false;
}

/**
 * Options still valid for the current pairing (subset of capability.options).
 * @deprecated Prefer rendering all options and using {@link isCapabilityOptionDisabled}.
 */
export function filterCapabilityOptions(capability, flatMap) {
  return capability.options.filter((o) => !isCapabilityOptionDisabled(capability, o.id, flatMap));
}

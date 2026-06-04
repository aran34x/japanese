// Svelte action: move a node to document.body (or another target) so it escapes
// any ancestor stacking context / overflow clipping. Useful for overlays,
// dropdowns and modals that must blur or cover the ENTIRE page.
export function portal(node: HTMLElement, target: HTMLElement | string = document.body) {
  let targetEl: HTMLElement | null = null;

  function mount(t: HTMLElement | string) {
    targetEl = typeof t === 'string' ? document.querySelector<HTMLElement>(t) : t;
    targetEl?.appendChild(node);
  }
  mount(target);

  return {
    update: mount,
    destroy() {
      node.parentNode?.removeChild(node);
    }
  };
}

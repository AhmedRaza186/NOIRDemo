// Shared handle to the page's Lenis instance so components (e.g. the mobile menu)
// can pause smooth scrolling. Null until App mounts it.
let instance = null;

export const setLenis = (lenis) => { instance = lenis; };
export const getLenis = () => instance;

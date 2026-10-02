/**
 * Escape special regex characters in a string so it can be safely
 * used inside `new RegExp(...)` as a literal pattern.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default escapeRegex;

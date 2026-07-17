/**
 * layout.js — shared layout helpers (Spacing law + grid discipline, docs/DESIGN-LAW.md).
 * Complete Tailwind class string literals only — no template-built strings (JIT rule).
 */

/**
 * Return a responsive grid-cols class for N equal siblings.
 *
 * Columns are chosen from {4, 3, 2} to maximise balance (trailing row as full as possible).
 * A single-orphan trailing row is avoided wherever integer arithmetic allows it; when no
 * cols value in the set yields a clean division (e.g. n=13 is prime, 13 mod 2/3/4 all =1),
 * we pick the cols value that maximises trailing-row fill (items mod cols / cols).
 *
 * Mapping table (n → target cols at md+, with trailing-row fill):
 *   n=1  → 1  (trivial)
 *   n=2  → 2  (1 full row)
 *   n=3  → 3  (1 full row)
 *   n=4  → 4  (1 full row)
 *   n=5  → 3  (3+2: trailing 2/3)      — 4 cols would leave 1 orphan
 *   n=6  → 3  (3+3: 2 full rows)
 *   n=7  → 4  (4+3: trailing 3/4)
 *   n=8  → 4  (4+4: 2 full rows)
 *   n=9  → 3  (3+3+3: 3 full rows)     — 4 cols would leave 1 orphan
 *   n=10 → 4  (4+4+2: 2/4 trailing, better than 3→3+3+3+1 orphan)
 *           actually 10 mod 4=2 (4+4+2), 10 mod 3=1 (3+3+3+1 orphan) → 4 wins
 *   n=11 → 4  (4+4+3: trailing 3/4)    — 3 cols: 3+3+3+2 trailing 2/3 → tie; pick 4 (fewer rows)
 *   n=12 → 4  (4+4+4: 3 full rows)
 *   n=13 → 4  (4+4+4+1 orphan)         — all cols in set leave an orphan (13 is prime mod 2/3/4);
 *           4 cols maximises trailing fill (1/4 is worst but rows are fewest); document the exception
 *   n>=14→ 4  (general cap; worst-case remainder=3 with n=15, n=19, etc.)
 *
 * The responsive base is always grid-cols-1 below md (mobile-safe).
 * Complete literals are required so Tailwind JIT can detect all class names.
 */
export function distributingGridCols(count) {
  if (count <= 1) return 'grid-cols-1 md:grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  if (count === 3) return 'grid-cols-1 md:grid-cols-3';
  if (count === 4) return 'grid-cols-1 md:grid-cols-4';
  if (count === 5) return 'grid-cols-1 md:grid-cols-3'; // 3+2, avoids orphan
  if (count === 6) return 'grid-cols-1 md:grid-cols-3'; // 3+3
  if (count === 7) return 'grid-cols-1 md:grid-cols-4'; // 4+3
  if (count === 8) return 'grid-cols-1 md:grid-cols-4'; // 4+4
  if (count === 9) return 'grid-cols-1 md:grid-cols-3'; // 3+3+3, avoids orphan
  if (count === 10) return 'grid-cols-1 md:grid-cols-4'; // 4+4+2; 3→orphan
  if (count === 11) return 'grid-cols-1 md:grid-cols-4'; // 4+4+3
  if (count === 12) return 'grid-cols-1 md:grid-cols-4'; // 4+4+4
  if (count === 13) return 'grid-cols-1 md:grid-cols-4'; // 4+4+4+1 (unavoidable: 13 is prime mod 2/3/4)
  return 'grid-cols-1 md:grid-cols-4'; // n>=14: 4-col cap; remainder in [0,3]
}

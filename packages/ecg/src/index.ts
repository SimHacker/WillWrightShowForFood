/**
 * @wwsff/ecg — Embedded Constraint Graphics, as courseware.
 *
 * One file per lesson; read them in order. ../COURSE.md is the lesson ladder and ../DESIGN.md
 * the plan. Implemented so far: Blend two pictures through Hitting walls, one zone (no gluing yet).
 */

export * from "./lerp.js";
export * from "./barycentric.js";
export * from "./drive.js";
export * from "./linear-algebra.js";
export * from "./tug.js";
export * from "./walls.js";

export const status = "single zone" as const;

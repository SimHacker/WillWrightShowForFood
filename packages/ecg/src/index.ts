/**
 * @wwsff/ecg — Embedded Constraint Graphics, as courseware.
 *
 * One file per lesson; read them in order. ../COURSE.md is the lesson ladder and ../DESIGN.md
 * the plan. Implemented so far: lessons 0–5, one zone (no gluing yet).
 */

export * from "./lerp.js";
export * from "./barycentric.js";
export * from "./drive.js";
export * from "./linear-algebra.js";
export * from "./tug.js";
export * from "./walls.js";

export const status = "lessons 0-5" as const;

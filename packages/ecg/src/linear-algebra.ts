/**
 * Lesson: The pseudo-inverse, by hand.
 *
 * The matrices in ECG are small: a few rows per grabbed handle, a column per example. So the
 * operations are written here in plain loops instead of pulled from a library, because reading
 * them is part of the course.
 *
 *     solve:   A·x = b                    Gaussian elimination with partial pivoting
 *     damped least squares:
 *              Δμ = Jᵀ (J Jᵀ + d²I)⁻¹ r   when J is wide (more unknowns than targets)
 *              Δμ = (JᵀJ + d²I)⁻¹ Jᵀ r    when J is tall (more targets than unknowns)
 *
 * Both forms give the same answer: the change Δμ that best meets the targets r while staying
 * small. With d = 0 that is the Moore-Penrose pseudo-inverse. A little d keeps it calm when two
 * examples put a handle in almost the same place, at the cost of the handle lagging the cursor.
 */

export type Matrix = number[][];
export type Vector = number[];

export function transpose(a: Matrix): Matrix {
	const rows = a.length;
	const cols = a[0]?.length ?? 0;
	const t: Matrix = Array.from({ length: cols }, () => new Array<number>(rows).fill(0));
	for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) t[j][i] = a[i][j];
	return t;
}

export function multiply(a: Matrix, b: Matrix): Matrix {
	const n = a.length;
	const k = b.length;
	const m = b[0]?.length ?? 0;
	const out: Matrix = Array.from({ length: n }, () => new Array<number>(m).fill(0));
	for (let i = 0; i < n; i++) {
		for (let p = 0; p < k; p++) {
			const aip = a[i][p];
			if (aip === 0) continue;
			for (let j = 0; j < m; j++) out[i][j] += aip * b[p][j];
		}
	}
	return out;
}

export function multiplyVector(a: Matrix, v: Vector): Vector {
	return a.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
}

/** Solve A·x = b for square A. Throws if A is singular. */
export function solve(a: Matrix, b: Vector): Vector {
	const n = a.length;
	const m = a.map((row, i) => [...row, b[i]]);
	for (let col = 0; col < n; col++) {
		let pivot = col;
		for (let r = col + 1; r < n; r++) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
		if (Math.abs(m[pivot][col]) < 1e-12) throw new Error("singular matrix");
		[m[col], m[pivot]] = [m[pivot], m[col]];
		for (let r = col + 1; r < n; r++) {
			const f = m[r][col] / m[col][col];
			if (f === 0) continue;
			for (let c = col; c <= n; c++) m[r][c] -= f * m[col][c];
		}
	}
	const x = new Array<number>(n).fill(0);
	for (let r = n - 1; r >= 0; r--) {
		let s = m[r][n];
		for (let c = r + 1; c < n; c++) s -= m[r][c] * x[c];
		x[r] = s / m[r][r];
	}
	return x;
}

function addDiagonal(a: Matrix, value: number): Matrix {
	return a.map((row, i) => row.map((x, j) => (i === j ? x + value : x)));
}

/**
 * Damped least squares: the Δμ minimizing |J·Δμ − r|² + d²|Δμ|².
 * Inverts whichever of J Jᵀ and JᵀJ is smaller.
 */
export function dampedLeastSquares(j: Matrix, r: Vector, damping: number): Vector {
	const rows = j.length;
	const cols = j[0]?.length ?? 0;
	if (cols === 0) return [];
	if (rows === 0) return new Array<number>(cols).fill(0);
	const jt = transpose(j);
	// The floor keeps a zero Jacobian (a handle that doesn't move in this zone) solvable: no change.
	const d2 = Math.max(damping * damping, 1e-10);
	if (rows <= cols) {
		const y = solve(addDiagonal(multiply(j, jt), d2), r);
		return multiplyVector(jt, y);
	}
	return solve(addDiagonal(multiply(jt, j), d2), multiplyVector(jt, r));
}

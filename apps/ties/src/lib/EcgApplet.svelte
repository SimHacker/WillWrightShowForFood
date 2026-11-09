<script>
	/**
	 * An Embedded Constraint Graphics playground, from an ```ecg fence. The model is the
	 * @wwsff/ecg model format (loadModel), plus how to draw and play with it:
	 *
	 *     examples:                         each example is the whole drawing, as points
	 *       - { id: A, points: [[0, 0]], fill: "#f00" }
	 *     zones: [[A, B, C], [B, C, D]]     optional; default one zone of everything
	 *     edges: [{ from: C, to: A, translate: [6, 0] }]     optional automatic transforms
	 *     start: A
	 *     strokes: [[0, 1, 2], { path: [3, 4, 5], closed: true, fill: true }]
	 *       fill: true blends the examples' fills; fill: "#hex" is fixed. color, width,
	 *       stroke: false style the outline.
	 *     decor: [{ circle: [x, y, r], fill: "#hex" }, { line: [x1, y1, x2, y2] }]     fixed parts
	 *     handles: dots                     small handles, for drawings with many points
	 *     say: { rest: M, ms: 110, letters: { a: AY }, pairs: { th: L } }
	 *       a text box: each letter (or pair) names an example, and the state is driven
	 *       through them in time, the way Mouther's speech recognizer drove its face
	 *     characters:                       optional: several drawings of the same examples,
	 *       - { name: smiley, examples: [...], strokes: [...] }     sharing one state
	 *     importance: { 0: 5 }              per point, how hard its handle pulls
	 *     feel: { damping, snap, spring, inertia, overshoot, sticky, chooser }
	 *     knobs: [damping, snap, ...]       which feel knobs to show (true: all)
	 *     presets: { rubber: { ... } }      named feel settings, one button each
	 *     view: [x, y, w, h]                optional, y up; default fits the examples
	 *     ghosts: all | zone | none         faint examples behind the drawing
	 *     layout: { A: [0, 0], ... }        where examples sit in the complex view
	 *     record: true                      record and play buttons
	 *
	 * Drag any point and the engine walks the state to put it under the cursor (@wwsff/ecg
	 * walk). Every number the solver uses is on screen. Several fingers drag several points.
	 * Shift-click pins a point where it is; arrow keys nudge a focused point.
	 */
	import { SvelteMap } from 'svelte/reactivity';
	import {
		coast,
		configurationOf,
		loadModel,
		mix,
		mixColors,
		AXIS_VIEWS,
		gluedFace,
		nearestOnSheet,
		oppositeFace,
		pullWeight,
		register,
		sheetsOf,
		stateOnSheet,
		TETRAHEDRON,
		tetraPoint,
		tetraWeights,
		nearestExample,
		normalizeWeights,
		placedExamples,
		pointTargets,
		record,
		sample,
		settled,
		snap,
		springStep,
		startState,
		vertexWeights,
		walk
	} from '@wwsff/ecg';

	let { spec } = $props();

	const FEEL = { damping: 0, snap: 0, spring: 0, inertia: 0, overshoot: 0, sticky: 0, chooser: 'state' };
	const KNOBS = {
		damping: { label: 'damping', max: 0.5 },
		snap: { label: 'snap', max: 0.3 },
		spring: { label: 'spring', max: 300 },
		inertia: { label: 'inertia', max: 1 },
		overshoot: { label: 'overshoot', max: 0.5 },
		sticky: { label: 'sticky', max: 0.5 }
	};

	const characters = $derived.by(() => {
		const list = Array.isArray(spec?.characters) ? spec.characters : [spec ?? {}];
		return list.map((c, i) => {
			const loaded = loadModel({
				examples: c?.examples,
				zones: c?.zones ?? spec?.zones,
				edges: c?.edges ?? spec?.edges,
				start: spec?.start
			});
			const strokes = (c?.strokes ?? spec?.strokes ?? []).map((s) => {
				const o = Array.isArray(s) ? { path: s } : s;
				const path = (o.path ?? []).map((p) => (typeof p === 'number' ? p : loaded.pointNames.indexOf(String(p))));
				return {
					path,
					closed: !!o.closed || !!o.fill,
					fill: o.fill === true ? 'blend' : typeof o.fill === 'string' ? o.fill : null,
					color: typeof o.color === 'string' ? o.color : null,
					width: Number.isFinite(o.width) ? o.width : null,
					outline: o.stroke !== false
				};
			});
			const decor = (c?.decor ?? spec?.decor ?? []).filter((d) => Array.isArray(d?.circle) || Array.isArray(d?.line));
			return { name: c?.name ?? `character ${i + 1}`, ...loaded, strokes, decor };
		});
	});
	const lead = $derived(characters[0]);
	const n = $derived(lead.ids.length);
	const zones = $derived(lead.model.zones);
	const problem = $derived.by(() => {
		if (spec?.error) return 'The ecg block is not valid YAML.';
		for (const c of characters) {
			if (c.errors.length) return `${characters.length > 1 ? c.name + ': ' : ''}${c.errors[0]}.`;
			if (c.ids.join() !== lead.ids.join()) return `${c.name} must name the same examples as ${lead.name}, in the same order.`;
		}
		return null;
	});
	const warnings = $derived(problem ? [] : lead.warnings);

	const initialFeel = () => ({ ...FEEL, ...(spec?.feel ?? {}) });
	let feel = $state(initialFeel());
	const shownKnobs = $derived(
		spec?.knobs === true ? [...Object.keys(KNOBS), 'chooser'] : Array.isArray(spec?.knobs) ? spec.knobs : ['damping']
	);

	// Writable derived: the start state whenever the model changes; the handlers overwrite it.
	let ecg = $derived(startState(lead.model, lead.start));
	let result = $state(null);
	let pins = $state([]); // { character, point, at }
	let marks = $state([]); // { character, at }
	let frames = $state([]); // { time, state }
	let recording = $state(false);
	let space = $state('oklab');

	const configs = $derived(characters.map((c) => (problem ? [] : configurationOf(c.model, ecg))));
	const fillColors = $derived(
		characters.map((c) => (c.fills.every((f) => f) ? mixColors(c.fills, ecg.weights, space) : null))
	);

	const sy = (y) => -y;
	const pos = (c, p) => [c[2 * p], c[2 * p + 1]];

	function boundsOf(c) {
		if (Array.isArray(spec?.view) && spec.view.length === 4) {
			const [x, y, w, h] = spec.view.map(Number);
			return { x, y: -(y + h), w, h, span: Math.sqrt(w * h) / 1.36 };
		}
		const all = c.model.examples;
		const xs = all.flatMap((e) => e.filter((_, i) => i % 2 === 0));
		const ys = all.flatMap((e) => e.filter((_, i) => i % 2 === 1).map(sy));
		if (!xs.length) return { x: 0, y: 0, w: 1, h: 1, span: 1 };
		const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
		const span = Math.max(x1 - x0, y1 - y0, 1e-6);
		const pad = span * 0.18;
		const cx = (x0 + x1) / 2;
		const cy = (y0 + y1) / 2;
		const half = span / 2 + pad;
		return { x: cx - half, y: cy - half, w: 2 * half, h: 2 * half, span };
	}
	const bounds = $derived(characters.map(boundsOf));
	const radii = $derived(bounds.map((b) => b.span * 0.035));

	function pathOf(c, stroke) {
		const pts = stroke.path.filter((p) => p >= 0).map((p) => `${c[2 * p]},${sy(c[2 * p + 1])}`);
		return pts.length ? `M${pts.join(' L')}${stroke.closed ? ' Z' : ''}` : '';
	}

	const ghostMode = $derived(spec?.ghosts ?? (lead.model.edges.size ? 'zone' : 'all'));
	const ghosts = $derived(
		characters.map((c) => {
			if (problem || ghostMode === 'none') return [];
			const placed = placedExamples(c.model.examples, ecg.placements);
			const zone = zones[ecg.zone];
			return placed
				.map((x, k) => ({ k, x }))
				.filter(({ k }) => ghostMode === 'all' || zone.includes(k));
		})
	);

	/** Each point's positions across a zone's examples: the handle's own simplex, out in the drawing. */
	const handleEdges = $derived.by(() => {
		const c = characters[0];
		const count = c.pointNames.length;
		if (problem || characters.length > 1 || count > 3 || n > 8) return [];
		const placed = placedExamples(c.model.examples, ecg.placements);
		const which = lead.model.edges.size ? [zones[ecg.zone]] : zones;
		const edges = [];
		for (const z of which)
			for (let a = 0; a < z.length; a++)
				for (let b = a + 1; b < z.length; b++)
					for (let p = 0; p < count; p++) edges.push([pos(placed[z[a]], p), pos(placed[z[b]], p)]);
		return edges;
	});

	const svgs = $state([]);
	const grabs = new SvelteMap(); // pointerId -> { character, point, offset, cursor, trail }
	let animation = 0;

	function toData(ci, event) {
		const m = svgs[ci]?.getScreenCTM();
		if (!m) return [0, 0];
		const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
		return [p.x, -p.y];
	}

	const importanceOf = (c, p) => {
		const table = spec?.importance ?? {};
		return Number(table[p] ?? table[c.pointNames[p]] ?? 1);
	};

	function solve(ci, wants) {
		const c = characters[ci];
		const targets = [];
		const held = new Set(wants.map((w) => w.point));
		for (const w of wants) targets.push(...pointTargets(w.point, w.at[0], w.at[1], importanceOf(c, w.point)));
		for (const pin of pins) {
			if (pin.character === ci && !held.has(pin.point))
				targets.push(...pointTargets(pin.point, pin.at[0], pin.at[1], importanceOf(c, pin.point)));
		}
		const r = walk(c.model, ecg, targets, {
			damping: Number(feel.damping) * bounds[ci].span,
			chooser: feel.chooser,
			overshoot: Number(feel.overshoot),
			sticky: Number(feel.sticky)
		});
		let next = r.state;
		if (Number(feel.snap) > 0) next = { ...next, weights: snap(next.weights, Number(feel.snap), zones[next.zone]) };
		ecg = next;
		result = { ...r, crossings: r.crossings.length ? r.crossings : (result?.crossings ?? []) };
		marks = wants.map((w) => ({ character: ci, at: w.at }));
		if (recording) frames = [...frames, { time: performance.now(), state: next }];
	}

	function wantsFor(ci) {
		return [...grabs.values()]
			.filter((g) => g.character === ci)
			.map((g) => ({ point: g.point, at: [g.cursor[0] + g.offset[0], g.cursor[1] + g.offset[1]] }));
	}

	function stop() {
		cancelAnimationFrame(animation);
		animation = 0;
	}

	function animate(step) {
		stop();
		let then = performance.now();
		const tick = (now) => {
			const dt = Math.min(0.05, (now - then) / 1000);
			then = now;
			if (step(dt, now)) animation = requestAnimationFrame(tick);
			else animation = 0;
		};
		animation = requestAnimationFrame(tick);
	}

	function onPointDown(event, ci, p) {
		if (event.button !== 0) return;
		event.preventDefault();
		stop();
		speaking = -1;
		settleIntoZone();
		if (event.shiftKey) {
			const at = pos(configs[ci], p);
			const has = pins.some((q) => q.character === ci && q.point === p);
			pins = has ? pins.filter((q) => !(q.character === ci && q.point === p)) : [...pins, { character: ci, point: p, at }];
			return;
		}
		try {
			svgs[ci].setPointerCapture(event.pointerId);
		} catch {
			// Synthetic pointers can't be captured; the drag still works while over the drawing.
		}
		const cursor = toData(ci, event);
		const at = pos(configs[ci], p);
		grabs.set(event.pointerId, {
			character: ci,
			point: p,
			offset: [at[0] - cursor[0], at[1] - cursor[1]],
			cursor,
			trail: [{ t: performance.now(), at }]
		});
	}

	function onMove(event, ci) {
		const g = grabs.get(event.pointerId);
		if (!g || g.character !== ci) return;
		g.cursor = toData(ci, event);
		const at = [g.cursor[0] + g.offset[0], g.cursor[1] + g.offset[1]];
		g.trail = [...g.trail.filter((s) => performance.now() - s.t < 120), { t: performance.now(), at }];
		solve(ci, wantsFor(ci));
	}

	function onUp(event, ci) {
		const g = grabs.get(event.pointerId);
		if (!g) return;
		grabs.delete(event.pointerId);
		if (grabs.size) return;
		marks = [];
		release(ci, g);
	}

	/** Let go: coast if there's inertia, then spring back if there's a spring or an overshoot. */
	function release(ci, g) {
		const trail = g.trail;
		const first = trail[0];
		const last = trail[trail.length - 1];
		const dt = (last.t - first.t) / 1000;
		const inertia = Number(feel.inertia);
		if (inertia > 0 && dt > 0.01) {
			let position = last.at;
			let velocity = [(last.at[0] - first.at[0]) / dt, (last.at[1] - first.at[1]) / dt];
			const friction = 0.5 + 12 * (1 - inertia);
			const still = bounds[ci].span * 0.02;
			animate((step) => {
				({ position, velocity } = coast(position, velocity, friction, step));
				solve(ci, [{ point: g.point, at: position }]);
				if (Math.hypot(...velocity) > still) return true;
				marks = [];
				settle();
				return false;
			});
			return;
		}
		settle();
	}

	function settle() {
		const stiffness = Number(feel.spring);
		const zone = zones[ecg.zone];
		const negative = ecg.weights.some((w) => w < -1e-9);
		if (!(stiffness > 0) && !negative) return;
		const target =
			stiffness > 0 ? vertexWeights(n, nearestExample(ecg.weights, zone)) : normalizeWeights(ecg.weights);
		const k = stiffness > 0 ? stiffness : 160;
		const friction = 2 * Math.sqrt(k) * 0.45;
		let velocity = ecg.weights.map(() => 0);
		animate((dt) => {
			const s = springStep(ecg.weights, velocity, target, k, friction, dt);
			velocity = s.velocity;
			ecg = { ...ecg, weights: s.weights };
			if (!settled(s.weights, velocity, target)) return true;
			ecg = { ...ecg, weights: target };
			return false;
		});
	}

	function onPointKey(event, ci, p) {
		const step = bounds[ci].span * (event.shiftKey ? 0.1 : 0.02);
		const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[event.key];
		if (!delta) return;
		event.preventDefault();
		stop();
		const at = pos(configs[ci], p);
		solve(ci, [{ point: p, at: [at[0] + delta[0], at[1] + delta[1]] }]);
		marks = [];
	}

	/** Driving, not tugging: ease the weights to one example of this zone; elsewhere, jump. */
	function goTo(k) {
		stop();
		result = null;
		if (!zones[ecg.zone].includes(k)) {
			ecg = startState(lead.model, k);
			return;
		}
		const from = [...ecg.weights];
		const to = vertexWeights(n, k);
		const t0 = performance.now();
		animate((_, now) => {
			const t = Math.min(1, (now - t0) / 350);
			ecg = { ...ecg, weights: mix(from, to, t * t * (3 - 2 * t)) };
			return t < 1;
		});
	}

	function reset() {
		stop();
		ecg = startState(lead.model, lead.start);
		feel = initialFeel();
		pins = [];
		marks = [];
		result = null;
	}

	function toggleRecord() {
		stop();
		recording = !recording;
		if (recording) frames = [{ time: performance.now(), state: ecg }];
	}

	function play() {
		if (frames.length < 2) return;
		recording = false;
		const motion = frames.reduce((m, f) => record(m, f.time, f.state.weights), { ids: lead.ids, frames: [] });
		const t0 = performance.now();
		const length = frames[frames.length - 1].time - frames[0].time;
		animate((_, now) => {
			const t = now - t0;
			const at = frames[0].time + t;
			let k = 0;
			while (k + 1 < frames.length && frames[k + 1].time <= at) k++;
			ecg = { ...frames[k].state, weights: sample(motion, t) };
			return t < length;
		});
	}

	const dots = $derived(spec?.handles === 'dots');

	/** Letters to examples: pairs first ("th", "oo"), then single letters, the rest at rest. */
	function sayScript(text) {
		const cfg = spec?.say ?? {};
		const index = (id) => lead.ids.indexOf(String(id));
		const rest = Math.max(0, index(cfg.rest ?? lead.ids[lead.start]));
		const pairs = cfg.pairs ?? {};
		const letters = cfg.letters ?? {};
		const script = [rest];
		const at = [0]; // where in the text each step starts
		const lower = String(text).toLowerCase();
		for (let i = 0; i < lower.length; ) {
			const two = lower.slice(i, i + 2);
			const hit = pairs[two] !== undefined ? pairs[two] : null;
			const id = hit ?? letters[lower[i]];
			const k = id === undefined || id === null ? rest : index(id);
			script.push(k < 0 ? rest : k);
			at.push(i);
			i += hit !== null ? 2 : 1;
		}
		script.push(rest);
		at.push(lower.length);
		return { script, at };
	}

	// Writable derived: the spec's sample sentence, until the reader types their own.
	let sayText = $derived(String(spec?.say?.text ?? ''));
	let speaking = $state(-1);
	const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

	/**
	 * Driving, Mouther style: through each example in turn, easing between them. Aloud, the
	 * synthesizer's word boundaries pull the script back into step with the voice.
	 */
	function say() {
		stop();
		stopListening();
		result = null;
		const { script, at } = sayScript(sayText);
		const ms = Number(spec?.say?.ms ?? 110);
		let t0 = performance.now();
		let voiceDone = true;
		if (spec?.say?.aloud && canSpeak) {
			speechSynthesis.cancel();
			const u = new SpeechSynthesisUtterance(sayText);
			voiceDone = false;
			let started = false;
			u.onstart = () => {
				started = true;
				t0 = performance.now();
			};
			setTimeout(() => {
				if (!started) voiceDone = true;
			}, 1000);
			u.onboundary = (e) => {
				const k = at.findIndex((c) => c >= e.charIndex);
				if (k > 0) t0 = performance.now() - (k - 0.5) * ms;
			};
			u.onend = u.onerror = () => (voiceDone = true);
			speechSynthesis.speak(u);
		}
		const zoneOf = (a, b) => {
			const z = zones.findIndex((zone) => zone.includes(a) && zone.includes(b));
			return z >= 0 ? z : Math.max(0, zones.findIndex((zone) => zone.includes(b)));
		};
		animate((_, now) => {
			const t = Math.max(0, (now - t0) / ms);
			const last = script.length - 1;
			if (t > last * 3) voiceDone = true;
			const k = Math.min(voiceDone ? last : last - 1, Math.floor(t));
			const a = script[k];
			const b = script[Math.min(last, k + 1)];
			const f = Math.min(1, (t - k) * 1.6);
			const e = f * f * (3 - 2 * f);
			speaking = b;
			ecg = { ...ecg, zone: zoneOf(a, b), weights: mix(vertexWeights(n, a), vertexWeights(n, b), e) };
			if (k < last || !voiceDone) return true;
			speaking = -1;
			return false;
		});
	}

	/**
	 * Listening: the microphone as a hand on the map. Loudness pushes the dot from the rest
	 * example out to the ring; the spectral centroid, dark to bright, picks where on the ring.
	 */
	let listening = $state(false);
	let voiceAt = $state(null);
	let audio = null; // { context, stream, analyser }

	function stopListening() {
		if (!audio) return;
		audio.stream.getTracks().forEach((t) => t.stop());
		audio.context.close();
		audio = null;
		listening = false;
		voiceAt = null;
		stop();
	}

	async function listen() {
		if (listening) {
			stopListening();
			settle();
			return;
		}
		stop();
		speechSynthesis?.cancel?.();
		const cfg = spec?.listen ?? {};
		const index = (id) => lead.ids.indexOf(String(id));
		const rest = Math.max(0, index(cfg.rest ?? lead.ids[lead.start]));
		const ring = (cfg.ring ?? []).map(index).filter((k) => k >= 0);
		if (ring.length < 2 || !sheets.length) return;
		let stream;
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch {
			problemNote = 'No microphone: the browser said no.';
			return;
		}
		const context = new AudioContext();
		const analyser = context.createAnalyser();
		analyser.fftSize = 2048;
		analyser.smoothingTimeConstant = 0.5;
		context.createMediaStreamSource(stream).connect(analyser);
		audio = { context, stream, analyser };
		listening = true;
		problemNote = '';
		result = null;
		const wave = new Float32Array(analyser.fftSize);
		const spectrum = new Float32Array(analyser.frequencyBinCount);
		const hz = context.sampleRate / analyser.fftSize;
		let floor = null; // the room's noise level: starts at the first frame, creeps up to steady noise
		let loud = 0;
		let bright = 0.5;
		animate(() => {
			if (!audio) return false;
			analyser.getFloatTimeDomainData(wave);
			analyser.getFloatFrequencyData(spectrum);
			const rms = Math.sqrt(wave.reduce((s, x) => s + x * x, 0) / wave.length);
			const db = 20 * Math.log10(rms + 1e-9);
			floor = floor === null ? db : Math.min(db, floor + 0.03);
			const open = Math.max(0, Math.min(1, (db - floor - 6) / 30));
			let sum = 0;
			let moment = 0;
			for (let i = Math.floor(250 / hz); i < Math.min(spectrum.length, 8000 / hz); i++) {
				const m = 10 ** (spectrum[i] / 20);
				sum += m;
				moment += m * i * hz;
			}
			const centroid = sum > 0 ? moment / sum : 1000;
			const b = Math.max(0, Math.min(1, Math.log(centroid / 600) / Math.log(4500 / 600)));
			loud += (open - loud) * 0.35;
			if (open > 0.05) bright += (b - bright) * 0.25;
			const along = bright * (ring.length - 1);
			const i = Math.min(ring.length - 2, Math.floor(along));
			const f = along - i;
			const [p, q] = [corners[ring[i]], corners[ring[i + 1]]];
			const edge = [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
			const r = corners[rest];
			const target = [r[0] + (edge[0] - r[0]) * loud, r[1] + (edge[1] - r[1]) * loud];
			voiceAt = target;
			let best = null;
			for (const sheet of sheets) {
				const near = nearestOnSheet(sheet, target);
				if (!best || near.distance < best.near.distance) best = { sheet, near };
			}
			if (best) {
				enterZone(
					best.sheet.zone,
					best.sheet.verts.filter((v) => zones[ecg.zone].includes(v))
				);
				setWeights(best.sheet.verts, best.near.local);
			}
			return true;
		});
	}
	let problemNote = $state('');

	/** After driving, the weights may sit across zones; settle into one before a drag. */
	function settleIntoZone() {
		const support = ecg.weights.map((w, k) => (w > 1e-9 ? k : -1)).filter((k) => k >= 0);
		if (support.every((k) => zones[ecg.zone].includes(k))) return;
		const z = zones.findIndex((zone) => support.every((k) => zone.includes(k)));
		if (z >= 0) {
			ecg = { ...ecg, zone: z };
			return;
		}
		const k = nearestExample(ecg.weights);
		ecg = { ...ecg, zone: Math.max(0, zones.findIndex((zone) => zone.includes(k))), weights: vertexWeights(n, k) };
	}

	/** Dragging the map: the pointer's place on a sheet is the weights, no solver. */
	let mapSvg = $state();
	const viewSvgs = $state([]);
	let mapGrab = null; // { pointerId, sheet } or { pointerId, view }

	function toSvg(svg, event) {
		const m = svg?.getScreenCTM();
		if (!m) return [0, 0];
		const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
		return [p.x, p.y];
	}

	function setWeights(verts, local) {
		const w = ecg.weights.map(() => 0);
		verts.forEach((v, j) => (w[v] = local[j]));
		ecg = { ...ecg, weights: w };
		if (recording) frames = [...frames, { time: performance.now(), state: ecg }];
	}

	function enterZone(z, face) {
		if (z === ecg.zone) return;
		ecg = { ...ecg, zone: z, placements: register(ecg.placements, zones[z], face, lead.model.edges) };
	}

	function grabMap(event, start) {
		if (event.button !== 0) return;
		event.preventDefault();
		stop();
		speaking = -1;
		result = null;
		marks = [];
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic pointers can't be captured.
		}
		mapGrab = { pointerId: event.pointerId, ...start };
	}

	function onSheetDown(event, i) {
		const s = sheets[i];
		settleIntoZone();
		enterZone(
			s.zone,
			s.verts.filter((v) => Math.abs(ecg.weights[v]) > 1e-9)
		);
		grabMap(event, { sheet: i });
		dragSheet(event);
	}

	/** A pointer never lands exactly on an edge: within a few pixels of a face, put it on the face. */
	function snapToFaces(s, local) {
		const [a, b, c] = s.at;
		const heights =
			s.at.length === 2
				? [Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(b[0] - a[0], b[1] - a[1])]
				: s.at.map((_, j) => {
						const [p, q] = [s.at[(j + 1) % 3], s.at[(j + 2) % 3]];
						const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
						return area / (Math.hypot(q[0] - p[0], q[1] - p[1]) || 1);
					});
		const out = local.map((w, j) => (w * heights[j] < 3 ? 0 : w));
		const sum = out.reduce((t, w) => t + w, 0);
		return sum > 1e-9 ? out.map((w) => w / sum) : local;
	}

	/** Clamp to the sheet; if the pointer is past a glued face, cross onto the sheet across it. */
	function dragSheet(event) {
		const p = toSvg(mapSvg, event);
		let i = mapGrab.sheet;
		for (let hop = 0; hop < 16; hop++) {
			const s = sheets[i];
			const near = nearestOnSheet(s, p);
			setWeights(s.verts, snapToFaces(s, near.local));
			if (near.distance < 1e-6) break;
			let best = -1;
			let bestFace = [];
			let bestDistance = near.distance - 1e-6;
			sheets.forEach((t, j) => {
				const face = s.verts.filter((v) => t.verts.includes(v));
				if (j === i || !face.length || !gluedFace(s, t, face)) return;
				const d = nearestOnSheet(t, p).distance;
				if (d < bestDistance) [best, bestFace, bestDistance] = [j, face, d];
			});
			if (best < 0) break;
			const onFace =
				bestFace.length === 1
					? [1]
					: nearestOnSheet({ zone: s.zone, verts: bestFace, at: bestFace.map((v) => s.at[s.verts.indexOf(v)]) }, p)
							.local;
			setWeights(bestFace, onFace);
			enterZone(sheets[best].zone, bestFace);
			i = best;
		}
		mapGrab.sheet = i;
	}

	function onViewDown(event, view) {
		settleIntoZone();
		grabMap(event, { view });
		dragView(event);
	}

	/** Move in the view's plane, keep the coordinate it looks along. */
	function dragView(event) {
		if (!tetra) return;
		const [x, y] = toSvg(viewSvgs[mapGrab.view], event);
		const [a, b] = AXIS_VIEWS[mapGrab.view];
		const p = [...tetraAt];
		p[a] = Math.max(-1, Math.min(1, x));
		p[b] = Math.max(-1, Math.min(1, -y));
		setWeights(tetra, tetraWeights(p));
	}

	function onMapMove(event) {
		if (mapGrab?.pointerId !== event.pointerId) return;
		if (mapGrab.view !== undefined) dragView(event);
		else dragSheet(event);
	}

	function onMapUp(event) {
		if (mapGrab?.pointerId !== event.pointerId) return;
		mapGrab = null;
		settle();
	}

	/** Weight sliders: drag one weight along the line from its example; the rest keep their ratios. */
	const faceMemory = new SvelteMap(); // example -> the others' proportions, last time they had any
	let barGrab = null; // { pointerId, k, face, cell }

	function pullFace(k) {
		stop();
		speaking = -1;
		result = null;
		settleIntoZone();
		if (!zones[ecg.zone].includes(k)) {
			const support = ecg.weights.map((w, v) => (w > 1e-9 ? v : -1)).filter((v) => v >= 0);
			let z = -1;
			let shared = [];
			zones.forEach((zone, i) => {
				if (!zone.includes(k)) return;
				const s = support.filter((v) => zone.includes(v));
				if (z < 0 || s.length > shared.length) [z, shared] = [i, s];
			});
			if (z < 0) return null;
			if (!shared.length) {
				ecg = startState(lead.model, k);
				return oppositeFace(ecg.weights, k, zones[ecg.zone], faceMemory.get(k));
			}
			setWeights(shared, normalizeWeights(shared.map((v) => ecg.weights[v])));
			enterZone(z, shared);
		}
		const face = oppositeFace(ecg.weights, k, zones[ecg.zone], faceMemory.get(k));
		faceMemory.set(k, face);
		return face;
	}

	function pullTo(k, face, value) {
		const w = pullWeight(face, k, value);
		ecg = { ...ecg, weights: w };
		if (recording) frames = [...frames, { time: performance.now(), state: ecg }];
	}

	const barValue = (cell, event) => {
		const r = cell.getBoundingClientRect();
		return (event.clientX - r.left) / Math.max(1, r.width);
	};

	function onBarDown(event, k) {
		if (event.button !== 0) return;
		event.preventDefault();
		const face = pullFace(k);
		if (!face) return;
		const cell = event.currentTarget;
		try {
			cell.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic pointers can't be captured.
		}
		barGrab = { pointerId: event.pointerId, k, face, cell };
		pullTo(k, face, barValue(cell, event));
	}

	function onBarMove(event) {
		if (barGrab?.pointerId !== event.pointerId) return;
		pullTo(barGrab.k, barGrab.face, barValue(barGrab.cell, event));
	}

	function onBarUp(event) {
		if (barGrab?.pointerId !== event.pointerId) return;
		barGrab = null;
		settle();
	}

	function onBarKey(event, k) {
		const step = event.shiftKey ? 0.1 : 0.02;
		const delta = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		const face = pullFace(k);
		if (face) pullTo(k, face, ecg.weights[k] + delta);
	}

	$effect(() => () => {
		cancelAnimationFrame(animation);
		stopListening();
		if (spec?.say?.aloud && canSpeak) speechSynthesis.cancel();
	});

	const S = $derived(Number(spec?.map?.size ?? 160));
	const corners = $derived.by(() => {
		const layout = spec?.layout;
		if (layout && lead.ids.every((id) => Array.isArray(layout[id]))) {
			const pts = lead.ids.map((id) => [Number(layout[id][0]), -Number(layout[id][1])]);
			const xs = pts.map((p) => p[0]);
			const ys = pts.map((p) => p[1]);
			const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1e-6);
			const scale = (S - 44) / span;
			const ox = (S - (Math.max(...xs) - Math.min(...xs)) * scale) / 2;
			const oy = (S - (Math.max(...ys) - Math.min(...ys)) * scale) / 2;
			return pts.map(([x, y]) => [ox + (x - Math.min(...xs)) * scale, oy + (y - Math.min(...ys)) * scale]);
		}
		return Array.from({ length: n }, (_, k) => {
			const a = -Math.PI / 2 + (2 * Math.PI * k) / n;
			return [S / 2 + (S / 2 - 22) * Math.cos(a), S / 2 + (S / 2 - 22) * Math.sin(a)];
		});
	});
	const complexEdges = $derived.by(() => {
		const seen = new Set();
		const out = [];
		for (const z of zones)
			for (let a = 0; a < z.length; a++)
				for (let b = a + 1; b < z.length; b++) {
					const key = [z[a], z[b]].sort((x, y) => x - y).join('-');
					if (seen.has(key)) continue;
					seen.add(key);
					const moved = lead.model.edges.has(`${z[a]}>${z[b]}`) || lead.model.edges.has(`${z[b]}>${z[a]}`);
					out.push({ a: z[a], b: z[b], moved });
				}
		return out;
	});
	const sheets = $derived(problem ? [] : sheetsOf(zones, corners));
	const looseEdges = $derived(
		complexEdges.filter((e) => !sheets.some((s) => s.verts.includes(e.a) && s.verts.includes(e.b)))
	);
	const sheetEdges = $derived(
		sheets.flatMap((s, i) =>
			s.verts.flatMap((a, j) =>
				s.verts.slice(j + 1).map((b, l) => ({
					key: `${i}:${a}-${b}`,
					p: s.at[j],
					q: s.at[j + 1 + l],
					moved: lead.model.edges.has(`${a}>${b}`) || lead.model.edges.has(`${b}>${a}`)
				}))
			)
		)
	);
	const mapCorners = $derived.by(() => {
		const seen = new Map();
		const add = (k, at) => seen.set(`${k}@${at[0].toFixed(1)},${at[1].toFixed(1)}`, { k, at });
		sheets.forEach((s) => s.verts.forEach((k, j) => add(k, s.at[j])));
		looseEdges.forEach((e) => {
			add(e.a, corners[e.a]);
			add(e.b, corners[e.b]);
		});
		if (!seen.size) corners.forEach((c, k) => add(k, c));
		return [...seen.values()];
	});
	const mapBox = $derived.by(() => {
		const pts = mapCorners.map((c) => c.at);
		const xs = pts.map((p) => p[0]);
		const ys = pts.map((p) => p[1]);
		const x = Math.min(...xs) - 28;
		const y = Math.min(...ys) - 18;
		return { x, y, w: Math.max(...xs) - x + 28, h: Math.max(...ys) - y + 22 };
	});
	const mapMiddle = $derived([
		corners.reduce((s, c) => s + c[0], 0) / corners.length,
		corners.reduce((s, c) => s + c[1], 0) / corners.length
	]);
	/** Labels sit outside the corner, away from the middle; a corner in the middle gets its label below. */
	function labelAt(at) {
		const d = [at[0] - mapMiddle[0], at[1] - mapMiddle[1]];
		const len = Math.hypot(...d);
		return len < 8 ? [at[0], at[1] + 18] : [at[0] + (d[0] / len) * 13, at[1] + (d[1] / len) * 13 + 4];
	}
	const stateDots = $derived(
		sheets
			.map((s, i) => ({ i, at: stateOnSheet(s, ecg.weights), current: s.zone === ecg.zone }))
			.filter((d) => d.at)
	);
	const tetra = $derived(!problem && zones[ecg.zone]?.length === 4 ? zones[ecg.zone] : null);
	const tetraAt = $derived(tetra ? tetraPoint(tetra.map((k) => ecg.weights[k])) : [0, 0, 0]);
	const VIEW_NAMES = ['front', 'top', 'side'];
	const label = (k) => lead.labels[k] ?? String(k);
	const zoneName = (z) => zones[z]?.map(label).join('–') ?? '';
	const faceName = (face) => face.map(label).join('–');
	const shape = (z) =>
		({ 1: 'a single example', 2: 'a line segment', 3: 'a triangle', 4: 'a tetrahedron' })[zones[z]?.length] ??
		`a ${zones[z].length - 1}-simplex`;
	const jShape = $derived(
		!result
			? null
			: result.cols <= 0
				? 'nothing left to solve: the state is at a corner'
				: result.rows === result.cols
					? 'square: one exact answer'
					: result.rows < result.cols
						? 'wide: many answers, the smallest change wins'
						: 'tall: no exact answer, least squares gets closest'
	);
	const lastCrossing = $derived(result?.crossings?.[result.crossings.length - 1] ?? null);
	const walls = $derived(result?.walls ?? []);
	const inZone = (k) => zones[ecg.zone]?.includes(k);
	const knobValue = (key) => Number(feel[key]).toFixed(key === 'spring' ? 0 : 2);
</script>

<figure class="ecg">
	{#if spec?.title}<figcaption>{spec.title}</figcaption>{/if}
	{#if problem}
		<p class="problem">{problem}</p>
	{:else}
		<div class="stage">
			<div class="drawings">
				{#each characters as c, ci (ci)}
					{@const b = bounds[ci]}
					{@const r = radii[ci]}
					{@const config = configs[ci]}
					<svg
						bind:this={svgs[ci]}
						class="drawing"
						viewBox="{b.x} {b.y} {b.w} {b.h}"
						style:aspect-ratio="{b.w} / {b.h}"
						onpointermove={(e) => onMove(e, ci)}
						onpointerup={(e) => onUp(e, ci)}
						onpointercancel={(e) => onUp(e, ci)}
						role="application"
						aria-label="{characters.length > 1 ? c.name : 'Drawing'}: drag a point"
					>
						{#each c.decor as d, i (i)}
							{#if d.circle}
								<circle
									class="decor"
									style:fill={d.fill}
									style:stroke={d.color}
									style:stroke-width={d.width}
									cx={d.circle[0]}
									cy={sy(d.circle[1])}
									r={d.circle[2]}
								/>
							{:else}
								<line
									class="decor"
									style:stroke={d.color}
									style:stroke-width={d.width}
									x1={d.line[0]}
									y1={sy(d.line[1])}
									x2={d.line[2]}
									y2={sy(d.line[3])}
								/>
							{/if}
						{/each}
						{#each handleEdges as [p, q], i (i)}
							<line class="handle-edge" x1={p[0]} y1={sy(p[1])} x2={q[0]} y2={sy(q[1])} />
						{/each}
						{#each ghosts[ci] as g (g.k)}
							<g class="ghost">
								{#each c.strokes as stroke, s (s)}<path d={pathOf(g.x, stroke)} />{/each}
								{#each c.pointNames as _, p (p)}
									<circle cx={g.x[2 * p]} cy={sy(g.x[2 * p + 1])} r={r * 0.45} />
								{/each}
								<text x={g.x[0] + r * 1.2} y={sy(g.x[1]) - r * 1.2} font-size={r * 2.2}>{label(g.k)}</text>
							</g>
						{/each}
						{#each c.strokes as stroke, s (s)}
							<path
								class="live"
								style:fill={stroke.fill === 'blend' ? (fillColors[ci] ?? 'var(--flash)') : (stroke.fill ?? 'none')}
								style:stroke={stroke.outline ? stroke.color : 'none'}
								style:stroke-width={stroke.width}
								d={pathOf(config, stroke)}
							/>
						{/each}
						{#each marks.filter((m) => m.character === ci) as m, i (i)}
							<g class="mark">
								<line x1={m.at[0] - r} y1={sy(m.at[1])} x2={m.at[0] + r} y2={sy(m.at[1])} />
								<line x1={m.at[0]} y1={sy(m.at[1]) - r} x2={m.at[0]} y2={sy(m.at[1]) + r} />
							</g>
						{/each}
						{#each c.pointNames as name, p (p)}
							<circle
								class={['point', { pinned: pins.some((q) => q.character === ci && q.point === p), dot: dots }]}
								cx={config[2 * p]}
								cy={sy(config[2 * p + 1])}
								r={dots ? r * 0.55 : r}
								role="button"
								tabindex="0"
								aria-label="Point {name} at {config[2 * p].toFixed(2)}, {config[2 * p + 1].toFixed(2)}: drag, or use the arrow keys"
								onpointerdown={(e) => onPointDown(e, ci, p)}
								onkeydown={(e) => onPointKey(e, ci, p)}
							/>
						{/each}
					</svg>
				{/each}
			</div>

			<div class="panel" style:flex-basis="{Math.max(260, S + 90)}px">
				{#if tetra}
					<div class="views">
						{#each AXIS_VIEWS as [a, b], v (v)}
							<svg
								bind:this={viewSvgs[v]}
								class="view"
								viewBox="-1.7 -1.75 3.4 3.5"
								role="application"
								aria-label="The tetrahedron seen from the {VIEW_NAMES[v]}: drag the dot"
								onpointerdown={(e) => onViewDown(e, v)}
								onpointermove={onMapMove}
								onpointerup={onMapUp}
								onpointercancel={onMapUp}
							>
								{#each TETRAHEDRON as p, i (i)}
									{#each TETRAHEDRON.slice(i + 1) as q, j (j)}
										<line class="edge" x1={p[a]} y1={-p[b]} x2={q[a]} y2={-q[b]} />
									{/each}
								{/each}
								{#each tetra as k, i (k)}
									{@const p = TETRAHEDRON[i]}
									<circle class={['corner', { wall: walls.includes(k) }]} cx={p[a]} cy={-p[b]} r="0.09" />
									<text x={p[a] * 1.32} y={-p[b] * 1.32 + 0.1} text-anchor="middle">{label(k)}</text>
								{/each}
								<circle class="state" cx={tetraAt[a]} cy={-tetraAt[b]} r="0.13" />
								<text class="view-name" x="0" y="1.68" text-anchor="middle">{VIEW_NAMES[v]}</text>
							</svg>
						{/each}
					</div>
				{:else}
					<svg
						bind:this={mapSvg}
						class="simplex"
						viewBox="{mapBox.x} {mapBox.y} {mapBox.w} {mapBox.h}"
						style:width="{mapBox.w}px"
						style:aspect-ratio="{mapBox.w} / {mapBox.h}"
						role="application"
						aria-label="The state in the zone {zoneName(ecg.zone)}: drag the dot"
						onpointermove={onMapMove}
						onpointerup={onMapUp}
						onpointercancel={onMapUp}
					>
						{#each sheets as s, i (i)}
							{@const holds = stateDots.some((d) => d.i === i)}
							<polygon
								class={['sheet', { current: s.zone === ecg.zone && zones.length > 1, holds }]}
								points={s.at.map((p) => p.join(',')).join(' ')}
								role="button"
								tabindex="-1"
								aria-label="Zone {zoneName(s.zone)}"
								onpointerdown={holds ? (e) => onSheetDown(e, i) : undefined}
							/>
						{/each}
						{#each looseEdges as e (e.a + '-' + e.b)}
							<line
								class={{ moved: e.moved }}
								x1={corners[e.a][0]}
								y1={corners[e.a][1]}
								x2={corners[e.b][0]}
								y2={corners[e.b][1]}
							/>
						{/each}
						{#each sheetEdges as e (e.key)}
							<line class={{ moved: e.moved }} x1={e.p[0]} y1={e.p[1]} x2={e.q[0]} y2={e.q[1]} />
						{/each}
						{#each mapCorners as c (c.k + '@' + c.at.join(','))}
							{@const t = labelAt(c.at)}
							<circle class={['corner', { wall: walls.includes(c.k), out: !inZone(c.k) }]} cx={c.at[0]} cy={c.at[1]} r="4" />
							<text x={t[0]} y={t[1]} text-anchor="middle">{label(c.k)}</text>
						{/each}
						{#each stateDots as d (d.i)}
							<circle
								class={['state', { other: !d.current }]}
								cx={d.at[0]}
								cy={d.at[1]}
								r="6"
								role="button"
								tabindex="-1"
								aria-label="The state in {zoneName(sheets[d.i].zone)}"
								onpointerdown={(e) => onSheetDown(e, d.i)}
							/>
						{/each}
						{#if voiceAt}<circle class="voice" cx={voiceAt[0]} cy={voiceAt[1]} r="9" />{/if}
					</svg>
				{/if}
				<p class="note">
					{#if zones.length > 1}In zone {zoneName(ecg.zone)}, {shape(ecg.zone)}, one of {zones.length}.
					{:else}The state in {shape(0)}{tetra ? ', seen down three axes' : n > 3 ? ', flattened' : ''}.{/if}
				</p>

				<table class="weights">
					<tbody>
						{#each ecg.weights as w, k (k)}
							<tr class={{ wall: walls.includes(k), out: !inZone(k), speaking: speaking === k }}>
								<td>
									<button
										type="button"
										onclick={() => goTo(k)}
										title={inZone(k) ? `Drive to ${label(k)}` : `Jump to ${label(k)}`}>{label(k)}</button
									>
								</td>
								<td
									class="bar"
									role="slider"
									tabindex="0"
									aria-label="Weight of {label(k)}"
									aria-valuemin="0"
									aria-valuemax="1"
									aria-valuenow={Number(w.toFixed(3))}
									onpointerdown={(e) => onBarDown(e, k)}
									onpointermove={onBarMove}
									onpointerup={onBarUp}
									onpointercancel={onBarUp}
									onkeydown={(e) => onBarKey(e, k)}
								>
									<span style:width="{Math.max(0, Math.min(1, w)) * 100}%"></span>
								</td>
								<td class="num">{w.toFixed(3)}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				{#each shownKnobs as key (key)}
					{#if KNOBS[key]}
						<label class="knob">
							<span>{KNOBS[key].label}</span>
							<input type="range" min="0" max={KNOBS[key].max} step={KNOBS[key].max / 100} bind:value={feel[key]} />
							<span class="num">{knobValue(key)}</span>
						</label>
					{:else if key === 'chooser'}
						<label class="knob">
							<span>chooser</span>
							<select bind:value={feel.chooser}>
								<option value="state">least state movement</option>
								<option value="unheld">least movement of unheld points</option>
							</select>
						</label>
					{/if}
				{/each}
				{#if fillColors[0]}
					<label class="knob">
						<span>blend in</span>
						<select bind:value={space}>
							<option value="oklab">OKLab</option>
							<option value="srgb">raw sRGB</option>
						</select>
					</label>
				{/if}
				{#if spec?.presets}
					<p class="presets">
						{#each Object.entries(spec.presets) as [name, values] (name)}
							<button type="button" onclick={() => (feel = { ...FEEL, ...values })}>{name}</button>
						{/each}
					</p>
				{/if}

				<p class="readout">
					{#if result}
						J is {result.rows}×{Math.max(0, result.cols)}, {jShape}.
						{#if walls.length}Walls: {walls.map(label).join(', ')} pinned at zero.{/if}
						{#if result.residual > 1e-3 * bounds[0].span}Out of reach by {result.residual.toFixed(2)}.{/if}
					{:else}
						Drag a point, or the dot on the map. Shift-click pins a point. The buttons drive to an example.
					{/if}
				</p>
				{#if lastCrossing}
					<p class="readout">
						Crossed {zoneName(lastCrossing.from)} → {zoneName(lastCrossing.to)} through {faceName(lastCrossing.face)}.
						{#if lastCrossing.candidates.length > 1}
							Candidates: {lastCrossing.candidates.map((x) => `${zoneName(x.zone)} ${x.score.toFixed(2)}`).join(', ')}.
						{/if}
					</p>
				{/if}
				{#each warnings as w (w)}<p class="warning">{w}.</p>{/each}
				{#if spec?.say}
					<form
						class="say"
						onsubmit={(e) => {
							e.preventDefault();
							say();
						}}
					>
						<input type="text" bind:value={sayText} aria-label="Something to say" />
						<button type="submit">Say</button>
					</form>
				{/if}
				{#if spec?.listen}
					<p class="buttons">
						<button type="button" class={{ on: listening }} onclick={listen}>{listening ? '■ Stop listening' : '🎤 Listen'}</button>
					</p>
					{#if problemNote}<p class="warning">{problemNote}</p>{/if}
				{/if}
				<p class="buttons">
					<button type="button" onclick={reset}>Reset</button>
					{#if spec?.record}
						<button type="button" class={{ on: recording }} onclick={toggleRecord}>{recording ? '■ Stop' : '● Record'}</button>
						<button type="button" onclick={play} disabled={frames.length < 2 || recording}>▶ Play</button>
					{/if}
				</p>
			</div>
		</div>
	{/if}
</figure>

<style>
	.ecg {
		margin: 1.5em 0;
		border: 1px solid var(--ink);
		background: var(--panel);
		padding: 0.75em;
	}
	figcaption {
		font-weight: bold;
		margin-bottom: 0.5em;
	}
	.problem,
	.warning {
		color: var(--ink);
		font-style: italic;
	}
	.stage {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		align-items: flex-start;
	}
	.drawings {
		flex: 1 1 320px;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		max-width: 520px;
	}
	.drawing {
		flex: 1 1 200px;
		max-height: 420px;
		border: 1px solid var(--ink);
		background: var(--paper);
		touch-action: none;
		user-select: none;
	}
	.decor {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
	}
	.handle-edge {
		stroke: var(--ink);
		stroke-opacity: 0.18;
		stroke-dasharray: 4 4;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.ghost path {
		fill: none;
		stroke: var(--ink);
		stroke-opacity: 0.22;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.ghost circle {
		fill: var(--ink);
		fill-opacity: 0.25;
	}
	.ghost text {
		fill: var(--ink);
		fill-opacity: 0.55;
		font-family: ui-monospace, monospace;
	}
	.live {
		stroke: var(--ink);
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.mark line {
		stroke: var(--flash);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}
	.point {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
		cursor: grab;
	}
	.point:focus-visible {
		outline: none;
		fill: var(--flash);
	}
	.point.pinned {
		fill: var(--ink);
	}
	.point.dot {
		fill: var(--ink);
		fill-opacity: 0.35;
		stroke: none;
	}
	.point.dot:hover,
	.point.dot:focus-visible {
		fill: var(--flash);
		fill-opacity: 1;
		stroke: var(--ink);
	}
	.panel {
		flex: 0 1 260px;
		font-size: 0.9em;
	}
	.simplex {
		max-width: 100%;
		display: block;
		touch-action: none;
		user-select: none;
	}
	.simplex line,
	.view .edge {
		stroke: var(--ink);
		stroke-opacity: 0.35;
		vector-effect: non-scaling-stroke;
		pointer-events: none;
	}
	.simplex line.moved {
		stroke-opacity: 0.8;
		stroke-dasharray: 3 2;
	}
	.sheet {
		fill: var(--ink);
		fill-opacity: 0.03;
		stroke: none;
	}
	.sheet.current {
		fill: var(--flash);
		fill-opacity: 0.25;
	}
	.sheet.holds {
		cursor: pointer;
	}
	.simplex text,
	.view text {
		font-family: ui-monospace, monospace;
		font-size: 11px;
		pointer-events: none;
	}
	.views {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.3em;
		max-width: 260px;
	}
	.view {
		display: block;
		width: 100%;
		border: 1px solid var(--ink);
		background: var(--paper);
		touch-action: none;
		user-select: none;
		cursor: crosshair;
	}
	.view text {
		font-size: 0.36px;
		font-weight: bold;
	}
	.view .view-name {
		font-size: 0.28px;
		font-weight: normal;
	}
	.view-name {
		fill-opacity: 0.55;
	}
	.view .state,
	.view .corner {
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
	}
	.state {
		cursor: grab;
	}
	.voice {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-dasharray: 3 2;
		pointer-events: none;
	}
	.state.other {
		fill: var(--paper);
	}
	.corner {
		fill: var(--ink);
	}
	.corner.out {
		fill-opacity: 0.35;
	}
	.corner.wall {
		fill: var(--paper);
		stroke: var(--ink);
		stroke-dasharray: 2 2;
	}
	.state {
		fill: var(--flash);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.note {
		margin: 0.2em 0 0.6em;
		font-style: italic;
	}
	.weights {
		border-collapse: collapse;
		width: 100%;
	}
	.weights td {
		padding: 1px 4px 1px 0;
	}
	.weights tr.out {
		opacity: 0.45;
	}
	.weights tr.speaking button {
		background: var(--flash);
	}
	.say {
		display: flex;
		gap: 0.4em;
		margin: 0.6em 0;
	}
	.say input {
		flex: 1;
		min-width: 0;
		font: inherit;
		border: 1px solid var(--ink);
		padding: 0.2em 0.4em;
	}
	.weights tr.wall .num {
		text-decoration: line-through;
	}
	.panel button {
		font-family: ui-monospace, monospace;
		min-width: 2.5em;
		background: var(--paper);
		border: 1px solid var(--ink);
		cursor: pointer;
	}
	.panel button.on {
		background: var(--flash);
	}
	.bar {
		width: 100%;
		cursor: ew-resize;
		touch-action: none;
		user-select: none;
		box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--ink) 25%, transparent);
	}
	.bar:focus-visible {
		outline: 2px solid var(--flash);
	}
	.bar span {
		display: block;
		height: 0.8em;
		background: var(--ink);
	}
	.num {
		font-family: ui-monospace, monospace;
		text-align: right;
	}
	.knob {
		display: grid;
		grid-template-columns: 5.5em 1fr 3em;
		align-items: center;
		gap: 0.4em;
		margin: 0.3em 0;
	}
	.knob select {
		grid-column: 2 / 4;
	}
	.presets,
	.buttons {
		display: flex;
		gap: 0.4em;
		flex-wrap: wrap;
	}
	.readout {
		min-height: 1.5em;
		margin: 0.4em 0;
	}
</style>

import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { Char, cons, Hunk, elements, fromJson, fromYaml, list, Pair, print, read, readAll, sym, toJson, toYaml, Vec } from "./sexp.js";

test("sexp: MACLISP's reader", () => {
	const x = read("(HAS-ACTION EATS (PEOPLE/'S) MINDS |'BLEEP'| 10 10. ; a comment\n foo)");
	assert.equal(print(x), "(HAS-ACTION EATS (|PEOPLE'S|) MINDS |'BLEEP'| 8. 10. FOO)");
	assert.equal(read("(A . B)") instanceof Pair, true);
	assert.equal(print(read("(A B . C)")), "(A B . C)");
	assert.equal(read("()"), null);
	assert.equal(read("nil"), null);
	assert.equal(sym("DOG"), read("dog"));
	assert.equal(print(read("'X")), "(QUOTE X)");
});

test("sexp: Common Lisp's reader and printer", () => {
	const o = { dialect: "cl" } as const;
	const x = read("(defun f (x) #| block #| nested |# |# `(a ,x ,@(list 1/2 1.5e1)) #'car #\\a #\\Space #(1 2) :key \"s\\\"q\" a\\ b)", o);
	assert.equal(print(x, o), "(DEFUN F (X) `(A ,X ,@(LIST 0.5 15)) #'CAR #\\a #\\Space #(1 2) :KEY \"s\\\"q\" |A B|)");
	assert.equal(read("10", o), 10);
	const els = elements(x).items;
	assert.ok(els[5] instanceof Char && els[6] instanceof Char && els[7] instanceof Vec);
});

test("sexp: MACLISP hunks, as ANIMAL keeps its sentences", () => {
	const x = read("(HAS-WOOL ((ON IT) . STATEMENT . NIL .))");
	assert.equal(print(x), "(HAS-WOOL ((ON IT) . STATEMENT . NIL .))");
	assert.ok(elements(x).items[1] instanceof Hunk);
	assert.equal(print(fromJson(toJson(x))), print(x));
});

test("sexp: Franz Lisp keeps case", () => {
	const o = { dialect: "franz" } as const;
	const x = read("(setq Foo 'bar nil)", o);
	assert.equal(print(x, o), "(setq Foo 'bar nil)");
	assert.notEqual(read("foo", o), read("Foo", o));
});

test("sexp: shared and circular structure print as labels and read back", () => {
	const tail = list(sym("C"));
	const x = list(tail, tail);
	assert.equal(print(x), "(#1=(C) #1#)");
	const ring = cons(sym("A"), null);
	ring.cdr = ring;
	assert.equal(print(ring), "#1=(A . #1#)");
	const back = read("#1=(A . #1#)") as Pair;
	assert.equal(back.cdr, back);
	assert.equal(print(read(print(x))), print(x));
	assert.equal(print(list(1, list(2, list(3, list(4)))), { depth: 2 }), "(1. (2. (...)))");
	assert.equal(print(list(1, 2, 3, 4, 5), { length: 3 }), "(1. 2. 3. ...)");
});

test("sexp: JSON and YAML say the same structure", () => {
	const x = read('((HAS-STATE FURRY) RWG (DOG RWG) ("a string" . 3))');
	const json = toJson(x, 0);
	assert.equal(json, '[[{"symbol":"HAS-STATE"},{"symbol":"FURRY"}],{"symbol":"RWG"},[{"symbol":"DOG"},{"symbol":"RWG"}],{"car":"a string","cdr":3}]');
	assert.equal(print(fromJson(json)), print(x));
	assert.equal(print(fromYaml(toYaml(x))), print(x));
	const ring = read("#1=(A B . #1#)");
	const back = fromJson(toJson(ring)) as Pair;
	assert.equal(print(back), "#1=(A B . #1#)");
});

const save = join(process.env.ITS_SRC ?? join(homedir(), "GroundUp/git/its/src"), "games/animal.save");

test("sexp: KMP's ANIMAL save file reads as one tree", { skip: !existsSync(save) && "no PDP-10/its checkout" }, () => {
	const forms = readAll(readFileSync(save, "latin1"));
	assert.equal(forms.length, 1);
	let questions = 0;
	let animals = 0;
	const walk = (node: Pair): void => {
		const { items } = elements(node);
		if (items[0] instanceof Pair) {
			questions++;
			walk(items[2] as Pair);
			walk(items[3] as Pair);
		} else animals++;
	};
	walk(forms[0] as Pair);
	assert.equal(animals, questions + 1);
	assert.ok(questions > 500, `${questions} questions`);
	assert.equal(print(readAll(print(forms[0] ?? null))[0] ?? null), print(forms[0] ?? null));
});

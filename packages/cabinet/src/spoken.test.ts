import assert from "node:assert/strict";
import { test } from "node:test";
import { spokenNumbers } from "./spoken.js";

test("spoken numbers: words and dictation punctuation become digits", () => {
	assert.equal(spokenNumbers("ninety nine"), "99");
	assert.equal(spokenNumbers("Ninety-nine."), "99");
	assert.equal(spokenNumbers("99."), "99");
	assert.equal(spokenNumbers("fifty"), "50");
	assert.equal(spokenNumbers("zero"), "0");
	assert.equal(spokenNumbers("a hundred and five"), "105");
	assert.equal(spokenNumbers("one hundred"), "100");
	assert.equal(spokenNumbers("guess forty two"), "guess 42");
	assert.equal(spokenNumbers("7"), "7");
});

test("spoken numbers: digit by digit, and digits misheard as words", () => {
	assert.equal(spokenNumbers("zero one two"), "12");
	assert.equal(spokenNumbers("one two"), "12");
	assert.equal(spokenNumbers("1 2 3"), "123");
	assert.equal(spokenNumbers("oh five"), "5");
	assert.equal(spokenNumbers("twenty one"), "21");
	assert.equal(spokenNumbers("one twenty"), "120");
	assert.equal(spokenNumbers("to"), "2");
	assert.equal(spokenNumbers("for to"), "42");
	assert.equal(spokenNumbers("go to fifty"), "go to 50");
});

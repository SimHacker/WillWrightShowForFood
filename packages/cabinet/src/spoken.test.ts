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

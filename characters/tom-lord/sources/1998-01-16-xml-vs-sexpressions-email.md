# XML vs S-expressions — Don to Tom Lord and RMS, January 16, 1998

Don's reply to a message from Tom arguing that GNU should standardize on S-expression syntax for
all structured text. Preserved from Don's website archive. Don's words are his own; Tom's words
appear only as the quoted passages Don was replying to, exactly as quoted in the original email.

This is the substrate argument in miniature, four years after the Tcl War: Tom pushing the
parenthesized universal core, Don defending the messy standard that ships. See
[the dossier](../the-tcl-war-and-guile.md) for context.

---

**From:** Hopkins, Don
**Sent:** Friday, January 16, 1998 1:27 AM
**To:** 'Tom Lord'; rms@gnu.org
**Subject:** RE: markup languages (XML)

> Tom Lord wrote:
>
> Whenever possible, people should use plain ASCII text and stick to 7 bit characters.
>
> People commonly think they want a larger character set, but in every case they are wrong. The
> correct answer is to invent spellings for all other languages using the existing standard 7
> bit character set.

Are you saying that just to be a luddite? I had a professor who looked like Garrison Keeler (the
Prarie Home Companion guy), and who for the life of him couldn't understand why anyone would
want a non-rectangular window. To each his own. However many billion Chinese can't be all wrong.

> Sometimes plain text isn't good enough -- you need something with more structure. Whenever
> possible, your language for describing structured text should be isomorphic to the
> S-expression language of Scheme.

As opposed to the S-expression syntax of Lisp? (Do atoms have properties or are they just
internalized strings?) Scheme S-expressions and atoms don't have properties. All XML elements
do, and they can contain plain text and other entities (references to other documents, or
special "user defined" characters like &CompanyLogo; or &TheArtistFormerlyKnownAsPrince; ... So
XML is a superset of Scheme S-expressions. Scheme doesn't have anything like a document type
defintion, or standard metadata.

In XML, as opposed to SGML, the DTD is optional -- you can have a "well formed" document without
a DTD that is syntactically correct and can be parsed, and you can also have a document that
refers to (or contains, or elaborates) a DTD, which is "valid". One of SGML's problems is that
there are ambiguities that prevent it from parsing any document without knowing the DTD. The
&lt;p&gt; seperator in HTML is an example of an un-nested token that is ambiguous (it doesn't
require an end tag), so an SGML tool can't parse HTML without a DTD. In XML, a naked &lt;p&gt;
is illegal, but it can be written either as a self-terminating tag &lt;p/&gt;, or
&lt;p&gt;paragraph&lt;/p&gt;, or even &lt;p&gt;paragraph&lt;/&gt; because the parser always
knows which tag the &lt;/&gt; balances.

> For applications where people have to type structured text directly, and there is more text
> than structuring annotation, a convenient surface syntax is needed. Wherever possible,
> standard S-expression syntax should be a subset of that surface syntax. For example, the
> surface syntax might look like texinfo or troff, except that when a formatting command
> requires arguments, those arguments would be written as s-expressions.
>
> There should be a generic library for reading and writing s-expressions. It should have two
> modes of operation: garbage collected and batch-allocated (for applications that don't link
> with a GC).

Microsoft provides the source code in Java to a generic XML parser library on their web site,
for free. You should take a look at the copyright notice and source code, and make up your own
mind if it's good or evil, unless your preconcieved notions allow you to short-circuit that
exercise. They ship two XML parsers (the Java one and a C++ one) with IE4.0, as ActiveX
components (the non-visual kind, that you just use as a library, from any language). Now you can
write web pages with vbscript and javascript that read XML documents from the net, munch them
however you like, fart the data out into a dynamic web page, and even edit it and send it back
to the server.

> Now if you want to do something like express invariants over the allowable set of structured
> texts for some application, you should state those invariants strictly in terms of the
> s-expression reading of the strutured text -- not in terms of the surface syntax.

That's what DTD's are for. XML doesn't require that you type documents in as text, you can
convert them from other syntaxes, and edit them in a graphical drag-and-drop pointy clicky
environment, of which there are a bunch for SGML (and most of them have been updated to work
with XML).

> Programs such as texinfo, groff, tex, whatever -- can be drasticly improved by stripping them
> of their horrible parsers and having them read the generic s-expression syntax (or convenient
> surface syntax) instead.
>
> I don't necessarily want my strutured documents to conform to just _one_ set of invariants
> (e.g. HTML). So, there shouldn't be any such thing as a document "in HTML". Documents would be
> in "generic structured text format" -- each representing a big s-expression. Some documents
> would "conform to HTML invariants" -- and that might mean, for example, that all lists and
> sublists in the S-expression begin with a symbol which is a valid HTML tag name, and that
> those lists have an appropriately long tail with elements of the correct types. There is
> nothing to prevent the same document from "conforming to the groff/texinfo invariants".

That's what XML is all about. It's not at all HTML++, it's SGML--.

> RMS should put his foot down and insist on the development and implementation of such a syntax
> in all GNU applications, in my opinion.
>
> -t

I hope RMS has better things to do with his foot and his time than start global flame wars about
surface syntax standards.

The last thing the world needs now is an alternative to XML. I'm glad the SGML people finally
cleaned up their act and reached completion on XML, because the HTML weenies, who didn't realize
that HTML was an *application* of the much more general purpose SGML meta-language that they
never heard of, kept inventing short sighted half assed kludges, proprietary tags, and dead end
shoehorn schemes in a million attempts to nickle-and-dime away problems that a lot of smart
people already solved a long time ago. SGML is an industrial strength overkill, but XML is a
rational simplification of it that solves the problems neatly and on purpose in a pre-meditated
fashion, and arguing about the syntax at this point is an outlandish waste of time, that would
make anyone who's been following the situation for more than a few years roll their eyeballs up
into the back of their head in dismay. What's needed are good free tools to create and
manipulate XML, not alternative syntaxes that don't address the real problems which have already
been solved. If you like the copyright notice on Microsoft's free XML parser, then use that, or
if not, use another one or write your own. But don't try to invent GnuML just because you think
parenthesis are a better syntax than angled brackets. But if you must do it, do it simply to fan
your ego, not to save the world.

XML is certainly as general as S-Expressions. Elements can nest, and they can also have
properties and contain text. The DTD (document type definition) defines the rules about which
elements are allowed and required, how they are allowed to nest, what properties are required or
optional, which external entities are referenced, etc. So any XML editor worth its salt can read
in the DTD, validate documents, and provide structured editing of the data with ammenities like
menus for enumerated types, etc. S-expressions were not designed to solve the same problems as
XML. How do you link to external entities? How do you assign IDs to S-expressions and atoms so
you can link to them internally or externally? At least ScriptX had a way to write out and read
back in circular lists and arbitrary graph structures. How do you deal with text? Is there a
standard format for meta-data?

-Don

---

*Preserved verbatim from Don's website archive, including all 1998 typos on both sides.
The irony that Don now works in YAML with semantic comments — structured text with properties,
readable surface syntax, and an S-expression heart — is noted for the record.*

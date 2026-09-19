---
title: data structure
synonyms:
  - overview of the data structure
definition: A description of the file structure of a Hyperties database.
source: doc/datastructure.st0
---

The Hyperties database system is implemented in the standard file systems available in most operating systems (though UNIX and MS-DOS are of primary concern).

A Hyperties database is made of a collection of articles.

In general, a document (i.e. a node in the hypertext network) is represented by a collection of files. The only necessary file is the ~storyboard~  which serves as the primary description of the article's format and content.  It is a text-only file, therefore human readable.

Other ~associated files~  contain picture description (or other data, such as digitized sound, that will not normally be represented as human-readable text) and information used to allow rapid presentation of the document at browsing time.

One special file, the ~master index~, exists to provide the association between the article files and the database as a whole.

A special directory, ~ties/global~, contains all the defaults settings and initializations.

The new Hyperties database format permits great freedom in the organization of a database's component files.  An author can impose a hierarchical structure (or any other that is suitably mnemonic), using the features of the standard filesystem found in UNIX and MS-DOS, to simplify access to components of the database when a fully-integrated authoring environment is not available, and to "flatten" the structure of a database to optimize use of storage when authoring is fully supported.

Also, the new format will allow spreading the component files of a database across multiple devices, allowing larger databases to be used on floppy-based systems.

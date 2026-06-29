# Sims Content Catalog in Laszlo and Python

*Submitted by Don Hopkins · Sun, 2005-09-18 07:30*
*Tags: Laszlo · Pie Menus · Python · SimFreaks · The Sims Content Catalog · Transmogrifier*
*Source: <http://www.donhopkins.com/drupal/node/44>* (companion to node/148 SimFreaks CMS narrative)

---

This is a large project I'm developing in OpenLaszlo: creating a rich web application for browsing, searching, exploring, collecting, personalizing, shopping and downloading Sims content.

I'm working with **SimFreaks** to put their entire catalog of thousands of Sims objects and characters into this database driven catalog. I'm using **Transmogrifier** to automatically export pictures of all the Sims objects.

Besides simply searching the catalog for interesting objects, you can navigate and explore collections of objects, and even interactively compose your own scenes.

It's like a cross between colorforms playsets, Hypercard and graphical adventures, with Sims room backgrounds, objects and characters, including interlinked image maps and text annotations.

The front-end is implemented in **OpenLaszlo**, and the back-end is implemented in **Python**, using **SQLObject**.

It also includes an administrative database interface for browsing and editing the SQL database that is used to model the site, and keep track of the users, objects, collections, pictures, etc. It's extensible by plugging in customizable Laszlo widgets for displaying and editing special data types, like pictures, checkboxes, color selectors, date pickers, pie menus, OPML editors, etc.

## Interface (from Don's Drupal post)

Along the top edge are the main site navigation buttons, which switch pages and reconfigure the interface for different tasks, by smoothly resizing the panels and scaling the views.

Along the left edge is the category selector and search interface, which lets you browse the tree of categories and search by keywords. The data driven category selector widget is configured with an XML file specifying search id, SQL query, icon, tooltip documentation, category tree structure, etc. The dynamic text search field filters the search to objects containing the given keywords in their titles or descriptions. It responds live as you're typing, by asynchronously querying the server for the first 20 search results.

When you click on an object in the search results list, it displays its title, picture and description in the middle pane. You can press the buttons to rotate the object around, zoom in and out, and select different graphical states and illustrations.

The big panel on the right is for **collections**. Objects in a collection start out with the same title and description as the object in the catalog, but you can customize each item in the collection to have its own title and description, for storytelling purposes. You can link objects to other collections, like doors to other rooms.

The collection view can zoom out to a **map** of collections in two-dimensional space. In edit mode (like Hypercard) you add and remove objects, move them around, change layering, and link collections. When you save, the server composes layered images into a flat picture plus a SWF with target shapes for efficient hit-testing.

Along the bottom is your **basket** — carry objects found by search or exploration, download them, and use them in other collections.

To start with, only administrators could use edit mode to showcase content. The plan was to let users create, edit and share their own collections — like Amazon user lists and **The Sims Exchange** — for comic-book stories and downloadable digital content.

## Why this matters for WWSFF

Don was building this for **love not money** for Heather / SimFreaks; real life intervened before finish. The Repo Show thesis: **non-extractive publishing** so independent creators (SimFreaks, SimSlice, families making Transmogrifier objects) can thrive across generations — grandmother learns Photoshop/XML for grandkids, parents teach Blender to kids.

## Related

- [Heather & Steve Alvey show](../../../heather-steve-alvey/)
- [Transmogrifier story](../../assets/sims-series/transmogrifier-story.md)
- [Laszlo database interface](../../drupal-node-38/article.md)

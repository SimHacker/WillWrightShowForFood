# Sims Content Catalog in Laszlo and Python

*Submitted by Don Hopkins · Sun, 2005-09-18 07:30*
*Tags: Laszlo Applications Pie Menu Applications Python SimFreaks The Sims Content Catalog Transmogrifier*
*Source: <http://www.donhopkins.com/drupal/node/43>*
*Extracted from Don Hopkins archival prompts (2026-06-29). Cleaned for republishing in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).*

---

This is a large project I'm developing in OpenLaszlo: creating a rich web application for browsing, searching, exploring, collecting, personalizing, shopping and downloading Sims content.

I'm working with SimFreaks to put their entire catalog of thousands of Sims objects and characters into this database driven catalog. I'm using Transmogrifier to automatically export pictures of all the Sims objects.

Besides simply searching the catalog for interesting objects, you can navigate and explore collections of objects, and even interactivally compose your own scenes.

It's like a cross between colorforms playsets, hypercard and graphical adventures, with Sims room backgrounds, objects and characters, including interlinked image maps and text annotations.

The front-end is implemented in OpenLaszlo, and the back-end is implemented in Python, using SQLObject.

It also includes an administrative database interface for browsing and editing the SQL database that is used to model the site, and keep track of the users, objects, collections, pictures, etc. It's extensible by plugging in customizable Laszlo widgets for displaying and editing special data types, like pictures, checkboxes, color selectors, date pickers, pie menus, OPML editors, etc.



The image above shows the user's view of the system (the administrator also has a database interface).

Along the top edge are the main site navigation buttons, which switch pages and reconfigure the inteface for different tasks, by smoothly resizing the panels and scaling the views.

Along the left edge is the category selector and search interface, which lets you browse the tree of categories and search by keywords. The data driven category selector widget is configured with an XML file specifying search id, SQL query, icon, tooltip documentation, category tree structure, etc. The dynamic text search field filters the search to objects containing the given keywords in their titles or descriptions. It responds live as you're typing, by asynchronously querying the server for the first 20 search results. It first quickly downloads enough results to fill the screen, then it continues to download larger batches of search results in the background, caching the object descriptions the first time they're downloaded, so subsequent searches can return larger batches by sending short references to previously downloaded objects.

When you click on an object in the search results list, it displays its title, picture and description in the middle pane. You can press the buttons to rotate the object around, zoom in and out, and select different graphical states and illustrations.

The big panel on the right is for collections. The top part has a list of collection icons, which you can point at to read their title and description, and click to select. Under that is a list of items in the collection, which you can point at to read their title and description.

Objects in a collection start out with the same title and description as the object in the catalog, but you can customize each item in the collection to have its own title and description, to use for storytelling purposes or whatever you like, and you can link objects to other collections, like doors to other rooms, or links to collections of related objects. You can drag the icons around to change their order, which effects the layering of the graphics in the collection composition, below.

The collection view in the picture above is zoomed into a collection, but you can press the "Map" button to zoom out to an overall map view, showing all collections in a two dimensional space, where you can drag them around. When you click on a collection in the map, it zooms in, downloads the more detailed view, and then it becomes live! The zoomed in view starts out in read-only view mode, but you can press a button to go into edit mode (like Hypercard), add and remove objects, move them around, change their layering, title, description, and link them to other collections. The bar separating the item list and the composition view has buttons for switching between view and edit mode, copying and deleting collections and items, saving or canceling changes, etc.

When you edit and save your changes to a collection, the server composes all the layered images into a flat picture, makes a thumbnail and an icon, and creates a special SWF file containing the flat image plus all the target shapes, which can be used to efficiently display the collection and track the mouse, without loading all the layered graphics. So you can look at a collection and point at the items in it, without downloading a bunch of stuff -- only when you go into edit mode does it download all the shaped graphics with transparency, so you can slide them around and change their layering.

When you point at an object in a collection, it pops up the title and description, which may be customized. When you click, it pops up a pie menu that lets you put the object in your basket, or display more details about the objects. Also, any object in a collection may be linked to any other collection, so you can navigate the collections by selecting the name of the linked collection from the pie menu.

Along the bottom of the screen is your basket, which you can use to carry around a bunch of objects you've found by searching or exploring collections, download them, and use them in other collections. You can double click on an object in the search results, or click on a picture in the object details, or select "To Basket" from a pie menu on an object in a collection, to add it to the basket. You can click on an icon in the basket to see its details, remove it from the basket, etc. You can also drag and drop the icons in the basket to change their order, if you like. The objects in the basket will be used by other parts of the site in various ways, like games, slide shows, personalization and downloading.

To start with, only the system adminstrators will be allowed to use edit mode to create collections that showcase the available content. But once we've tested and refined the interface and optimized the server, we'll let users create, edit and share their own collections, like Amazon's user book recommendation lists, and make comic-book stories, like The Sims Exchange. Obviously this would also be useful for composing and sharing collections of other kinds of content than Sims objects, like photos and other downloadable digital content.

» Login or register to post comments

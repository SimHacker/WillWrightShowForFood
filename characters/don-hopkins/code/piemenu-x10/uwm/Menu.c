#ifndef lint
static char *rcsid_Menu_c = "$Header: Menu.c,v 10.3 86/02/01 16:23:11 tony Rel $";
#endif	lint

/************************************************************************
 *									*
 *			Copyright (c) 1986 by				*
 *		Digital Equipment Corporation, Maynard, MA		*
 *		         All Rights Reserved.				*
 *									*
 *	Permission to use, copy, modify, and distribute this software	*
 *	and its documentation is hereby granted only to licensees of 	*
 *	The Regents of the University of California pursuant to their	*
 *	license agreement for the Berkeley Software Distribution 	*
 *	provided that the following appears on all copies.		*
 *									*
 *            "LICENSED FROM DIGITAL EQUIPMENT CORPORATION		*
 *                      COPYRIGHT (C) 1986				*
 *                 DIGITAL EQUIPMENT CORPORATION			*
 *                         MAYNARD, MA					*
 *                     ALL RIGHTS RESERVED.				*
 *									*
 *      THE INFORMATION IN THIS SOFTWARE IS SUBJECT TO CHANGE WITHOUT	*
 *	NOTICE AND SHOULD NOT BE CONSTRUED AS A COMMITMENT BY DIGITAL	*
 *	EQUIPMENT CORPORATION.  DIGITAL MAKES NO REPRESENTATIONS	*
 *	ABOUT SUITABILITY OF THIS SOFTWARE FOR ANY PURPOSE. IT IS	*
 *	SUPPLIED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY.		*
 *									*
 * 	IF THE UNIVERSITY OF CALIFORNIA OR ITS LICENSEES MODIFY 	*
 *	THE SOFTWARE IN A MANNER CREATING DERIVATIVE COPYRIGHT 		*
 *	RIGHTS APPROPRIATE COPYRIGHT LEGENDS MAY BE PLACED ON THE	*
 *	DERIVATIVE WORK IN ADDITION TO THAT SET FORTH ABOVE."		*
 *									*
 ************************************************************************
 *									*
 *	Pie Menu enhancements Copyright (C) 1987 by Don Hopkins,	*
 *	University of Maryland.						*
 *									*
 ************************************************************************/
 

/*
 * MODIFICATION HISTORY
 *
 * 000 -- M. Gancarz, DEC Ultrix Engineering Group
 *
 * Don Hopkins, University of Maryland.
 * Added Pie Menus.
 *
 */

#ifndef lint
static char *sccsid = "@(#)Menu.c	3.8	1/24/86";
#endif

#include "uwm.h"

#define PI 3.1415926535897932
#define TWO_PI 6.2831853071795865

#define DisplayLine(w, pane, width, height, str, fg, bg) \
         XPixSet(w, 0, pane, width, height, bg); \
         XTextMask(w, HMenuPad, pane + VMenuPad, str, strlen(str), MFont, fg);

#define NVERTS	5			/* Number of vertices for hi-liter. */

static Vertex vlist[NVERTS];		/* Vertex list for hi-liter. */

#ifdef FUWM
extern int (*F_exec)();
extern char *F_exec_string;
#endif

Pie_Hi_Lite(menu, item)
MenuInfo *menu;
int item;
{
    int x, y;
    MenuLine *ml;

    for (ml = menu->line; --item; ml = ml->next);

    XPixFill(menu->w,
	     menu->center_x + ml->x_offset - 2,
	     menu->center_y + ml->y_offset - 2,
	     ml->width + 4, menu->iheight + 4,
	     1, NULL, GXinvert, 
	     AllPlanes);
}

int less_than(quadrant1, slope1, quadrant2, slope2)
int quadrant1;
double slope1;
int quadrant2;
double slope2;
{
    switch ((quadrant1 - quadrant2) & 3) {
	case 0:
	    return(slope1 < slope2);
	case 1:
	    return(0);
	case 2:
	    return(slope1 > slope2);
	case 3:
	    return(1);
    }
}

int in_between(quadrant1, slope1, quadrant2, slope2, quadrant3, slope3)
int quadrant1;
double slope1;
int quadrant2;
double slope2;
int quadrant3;
double slope3;
{
    int result;

    result = !less_than(quadrant2, slope2, quadrant1, slope1) &&
             less_than(quadrant2, slope2, quadrant3, slope3);

    return(result);
}

int Pie_Cur_Item(menu, x, y)
     MenuInfo *menu;
     int x, y;
{
    double slope, last_slope;
    int quadrant, last_quadrant, i;
    MenuLine *ml;

    x -= menu->center_x;
    y -= menu->center_y;

    if (abs(x) <= Delta && abs(y) <= Delta)
	return(0);

    calc_quadrant_slope(x, y, &quadrant, &slope);

    ml = menu->line;
    i = 1;

    while (1) {

	/*
	 * Remember the leading edge of this selection.
	 */
	last_quadrant = ml->quadrant;
	last_slope = ml->slope;

	/*
	 * Move on to the next selection. If we're at the end, then it can
	 * only be this one. 
	 */
	ml = ml->next;

	if (ml == NULL)
	    return(i);

	/*
	 * Is the mouse angle within the last selection?
	 */
	if (in_between(last_quadrant, last_slope, quadrant, slope,
		       ml->quadrant, ml->slope))
	    return(i);

	/*
	 * Try next selection.
	 */
	i++;
    }
}

/*

              |
              |
              +--> x>=0, y<0
 x<0, y<=0    |0       -x/y
   y/x        |
    ^         |
    |  quad 2 | quad 3
----+---------+---------+----> x
       quad 1 | quad 0  |
              |         V
              |      x>0, y>=0
              |	       y/x
 x<=0, y>0 <--+
    -x/y      |
              |
              V
              y

*/


calc_quadrant_slope(x, y, quadrantp, slopep)
int x, y, *quadrantp;
double *slopep;
{
    /*
     * Calculate quadrant number.
     */
    if (y > 0)
	*quadrantp = (x > 0 ? 0 : 1);
    else if (y < 0)
	*quadrantp = (x < 0 ? 2 : 3);
    else /* y == 0 */
	*quadrantp = (x > 0 ? 0 : 2);

    /*
     * Calculate slope such that it's always positive, increasing
     * clockwise.
     */
    *slopep = (*quadrantp & 1) ? ((double) -x/y) : ((double) y/x);
}

#if 0
Bool Menu(window, mask, button, x, y, menu)
Window window;				/* Event window. */
int mask;				/* Button/key mask. */
short button;				/* Button event detail. */
int x, y;				/* Event mouse position. */
MenuInfo *menu;
{
    XButtonEvent button_event;		/* Button event packet. */
    Bool func_stat;			/* Function status return. */
    int cur_x, cur_y;			/* Current mouse position. */
    Window sub_window;			/* Current subwindow. */
    int cur_item = 0;			/* Current menu item. */
    int hi_lite = 0;			/* Current highlighted item. */
    int i;				/* Iteration counter. */
    short hlfg, hlbg;			/* Hi-liter pixels. */
    MenuLine *ml;			/* Menu lines pointer. */
    char *hlname;			/* Pointer to hi-liter name. */
    char *strbuf;			/* String buffer for IsTextNL. */
    char *malloc();
    /*
     * Change the cursor.
     */
    if (menu->piemenu)
        status = XGrabButton(RootWindow, PieCursor, mask, EVENTMASK);
    else
        status = XGrabButton(RootWindow, MenuCursor, mask, EVENTMASK);
    if (status == FAILURE)
        Error("Menu -> Unable to grab button and change cursor.");

    /*
     * Map the menu.
     */
    MapMenu(menu, x, y);

    /*
     * Main loop.
     */
    while (TRUE) {

        /*
         * If no button event, check the current mouse position.
         */
    	while (XPending()) {
	    XButtonEvent event;
	    Window subw;

	    XNextEvent(&event);
	    if (event.type == ButtonReleased) {
		XInterpretLocator(menu->w, &cur_y, &cur_y, &subw, 
				  (event.x << 16) | event.y);
		XPutBackEvent(&event);
		goto track;
	    }
	}

        status = XUpdateMouse(menu->w, &cur_x, &cur_y, &sub_window);
        if (status == FAILURE) continue;

    track:

	if (menu->piemenu) {
            /*
	     * If the mouse has moved to another item in the menu,
	     * highlight the new item.
             */
	    cur_item = Pie_Cur_Item(menu, cur_x, cur_y);

	    if (cur_item != hi_lite) {

		/*
		 * Remove highlighting on old item.
		 */
		if (hi_lite) {
		    Pie_Hi_Lite(menu, hi_lite);
		}

                /*
                 * Highlight new item.
                 */
                if (cur_item) {
                    for(i = 1, ml = menu->line; ml; i++, ml = ml->next)
                        if (i == cur_item) break;
		    Pie_Hi_Lite(menu, cur_item);
                }

                hi_lite = cur_item;
                hlfg = ml->fg.pixel;
                hlbg = ml->bg.pixel;
                hlname = ml->name;
            }
	}
	else {

            /*
	     * If the mouse has moved out of the menu sideways, abort
	     * the menu operation. Reset the cursor and unmap the menu.
             */
	    if (cur_x < 0 || cur_x > menu->width) {
	        UnmapMenu(menu, mask);
		return(FALSE);
            }

	    /*
	     * If the mouse has moved below or above the menu, but is still
             * within the same vertical plane, then simply adjust the values
	     * so the user doesn't fall off the edge.
	     */
            if (cur_y >= menu->height) cur_y = menu->height - 1;
	    else if (cur_y < 0) cur_y = 0;

            /*
	     * If the mouse has moved to another item in the menu,
	     * highlight the new item.
             */
            cur_item = cur_y / menu->iheight;
	    if (cur_item != hi_lite) {

	        /*
		 * Remove highlighting on old item.
                 */
	        if (hi_lite) {
	            DisplayLine(menu->w, hi_lite * menu->iheight,
		                menu->width, menu->iheight, hlname,
		                hlfg, hlbg);
                }

                /*
	         * Highlight new item.
	         */
                if (cur_item) {
	            for(i = 1, ml = menu->line; ml; i++, ml = ml->next) {
	                if (i == cur_item) break;
		    }
                    DisplayLine(menu->w, cur_item * menu->iheight,
	                        menu->width, menu->iheight, ml->name,
	                        menu->hlfg.pixel, menu->hlbg.pixel);
                    vlist[0].y = cur_item * menu->iheight + 1;
	            XDraw(menu->w, vlist, NVERTS, 1, 1,
	                  menu->hlfg.pixel, GXcopy, AllPlanes);
                }
	        hi_lite = cur_item;
	        hlfg = ml->fg.pixel;
		hlbg = ml->bg.pixel;
                hlname = ml->name;
	    }
	}

        /*
         * Check to see if we have a change in the mouse buttons.
         * This means the user has selected an item or aborted the
         * operation.
         */
        if (XPending() && GetButton(&button_event)) {

            /*
             * Was button released?
             */
            if ((button_event.type == ButtonReleased) &&
                ((button_event.detail & ValueMask) == button)) {

		if (menu->piemenu) {
		    int x, y;
		    Window subw;

		    XInterpretLocator(menu->w, &x, &y, &subw, 
				      (button_event.x << 16) | button_event.y);
		    cur_item = Pie_Cur_Item(menu, x, y);
		}

		break;

            } else {

                /*
                 * Some other button event occurred, so abort the menu
                 * operation.
                 */
                UnmapMenu(menu, mask);
                return(TRUE);
            }
        }
    }

    /*
     * If no item was selected, simply close the menu and return.
     */
    if (!cur_item) {
        UnmapMenu(menu, mask);
        return(TRUE);
    }

    /*
     * Get a pointer to the menu line selected.
     */
    --cur_item;
    for(i = 0, ml = menu->line; ml; i++, ml = ml->next) {
        if (i == cur_item) break;
    }

    /*
     * Perform the selected menu line action.
     */
    switch (ml->type) {

        case IsShellCommand:
            UnmapMenu(menu, mask);
            system(ml->text);
            break;

        case IsText:
            UnmapMenu(menu, mask);
            XStoreBytes(ml->text, strlen(ml->text));
            break;

        case IsTextNL:
            UnmapMenu(menu, mask);
            strbuf = (char *)malloc(strlen(ml->text) + 2);
            strcpy(strbuf, ml->text);
            strcat(strbuf, "\n");
            XStoreBytes(strbuf, strlen(strbuf));
            free(strbuf);
            break;

        case IsUwmFunction:
            UnmapMenu(menu, mask);
            GetContext(&sub_window, &cur_x, &cur_y);
            if (sub_window != menu->w)
                (*ml->func) (sub_window, mask, button, cur_x, cur_y);
            break;

        case IsImmFunction:
            UnmapMenu(menu, mask);
            (*ml->func) (window, mask, button, cur_x, cur_y);
            break;

        case IsMenuFunction:
            while (TRUE) {
                if (!GetButton(&button_event)) continue;
                if (button_event.type != ButtonPressed) continue;
                if ( /* (KeyMask(button_event.detail) != KeyMask(mask)) || */
                    ((button_event.detail & ButtonMods) != button)) {
                    UnmapMenu(menu, mask);
                    return(TRUE);
                }
                break;
            }
            UnmapMenu(menu, mask);

            func_stat = Menu(menu->w, mask, button, 
			     button_event.x, button_event.y, 
			     ml->menu);
            return(func_stat);
            break;

        default:
            Error("Menu -> Internal type error.");
    }
    return(TRUE);
}
#else
ChangeCursor(menu, mask)
MenuInfo *menu;
int mask;
{
    /*
     * Change the cursor.
     */

    if (menu->piemenu)
        status = XGrabButton(RootWindow, PieCursor, mask, EVENTMASK);
    else
        status = XGrabButton(RootWindow, MenuCursor, mask, EVENTMASK);

    if (status == FAILURE)
        Error("Menu -> Unable to grab button and change cursor.");
}

short hlfg, hlbg;
char *hlname;

Highlight(menu, cur_itemp, hi_litep)
MenuInfo *menu;
int *cur_itemp, *hi_litep;
{
    register int i;
    register MenuLine *ml = menu->line;

	/*
	 * If the mouse has moved to another item in the menu,
	 * highlight the new item.
	 */
    if (*cur_itemp == *hi_litep)
	return;

    /*
     * Remove highlighting on old item.
     */
    if (*hi_litep) {
	if (menu->piemenu) {
	    Pie_Hi_Lite(menu, *hi_litep);
	}
	else {
	    DisplayLine(menu->w, *hi_litep * menu->iheight,
			menu->width, menu->iheight, hlname,
			hlfg, hlbg);
	}
    }
    /*
     * Highlight new item.
     */
    if (*cur_itemp) {
	if (menu->piemenu) {
	    Pie_Hi_Lite(menu, *cur_itemp);
	}
	else {
	    for(i = 1, ml = menu->line; ml; i++, ml = ml->next) {
		if (i == *cur_itemp) break;
	    }
	    
	    DisplayLine(menu->w, *cur_itemp * menu->iheight,
			menu->width, menu->iheight, ml->name,
			menu->hlfg.pixel, menu->hlbg.pixel);
	    vlist[0].y = *cur_itemp * menu->iheight + 1;
	    XDraw(menu->w, vlist, NVERTS, 1, 1,
		  menu->hlfg.pixel, GXcopy, AllPlanes);
	    
	    hlfg = ml->fg.pixel;
	    hlbg = ml->bg.pixel;
	    hlname = ml->name;
	}
    }

    *hi_litep = *cur_itemp;

    XFlush();
}

int MenuCenterX, MenuCenterY;

Track(menu, cur_itemp, cur_x, cur_y)
MenuInfo *menu;
int *cur_itemp, cur_x, cur_y;
{
    int i;
    MenuLine *ml;

    if (menu->piemenu) {
	*cur_itemp = Pie_Cur_Item(menu,
				  cur_x - MenuCenterX,
				  cur_y - MenuCenterY);
    }
    else {
	/*
	 * If the mouse has moved below or above the menu, but is still
         * within the same vertical plane, then simply adjust the values
	 * so the user doesn't fall off the edge.
	 */

	cur_y -= MenuCenterY - (menu->iheight >> 1);

        if (cur_y >= menu->height) cur_y = menu->height - 1;
	else if (cur_y < 0) cur_y = 0;

        *cur_itemp = cur_y / menu->iheight;
    }
/* printf("Exit track ==> %d.\n", *cur_itemp); */
}

Bool Menu(window, mask, button, x, y, menu)
Window window;				/* Event window. */
int mask;				/* Button/key mask. */
short button;				/* Button event detail. */
int x, y;				/* Event mouse position. */
MenuInfo *menu;
{
    XButtonEvent button_event;		/* Button event packet. */
    Bool func_stat;			/* Function status return. */
    int cur_x, cur_y;			/* Current mouse position. */
    Window sub_window;			/* Current subwindow. */
    int cur_item = 0;			/* Current menu item. */
    int hi_lite = 0;			/* Current highlighted item. */
    int i;				/* Iteration counter. */
/*    short hlfg, hlbg;			/* Hi-liter pixels. */
    MenuLine *ml;			/* Menu lines pointer. */
/*    char *hlname;			/* Pointer to hi-liter name. */
    char *strbuf;			/* String buffer for IsTextNL. */
    char *malloc();

    ChangeCursor(menu, mask);

    /*
     * Map the menu.
     */
    MapMenu(menu, x, y);

    /*
     * Main loop.
     */
    while (TRUE) {

        /*
         * If no button event, check the current mouse position.
         */
    	while (XPending()) {
	    XButtonEvent event;
	    Window subw;

	    XNextEvent(&event);
	    if (event.type == ButtonReleased) {
		XInterpretLocator(menu->w, &cur_y, &cur_y, &subw, 
				  (event.x << 16) | event.y);
		XPutBackEvent(&event);
		goto track;
	    }
	}

        status = XUpdateMouse(menu->w, &cur_x, &cur_y, &sub_window);
        if (status == FAILURE) continue;

    track:

	if (menu->piemenu) {
            /*
	     * If the mouse has moved to another item in the menu,
	     * highlight the new item.
             */
	    cur_item = Pie_Cur_Item(menu,
				    cur_x - menu->center_x,
				    cur_y - menu->center_y);

	    if (cur_item != hi_lite) {

		/*
		 * Remove highlighting on old item.
		 */
		if (hi_lite) {
		    Pie_Hi_Lite(menu, hi_lite);
		}

                /*
                 * Highlight new item.
                 */
                if (cur_item) {
                    for(i = 1, ml = menu->line; ml; i++, ml = ml->next)
                        if (i == cur_item) break;
		    Pie_Hi_Lite(menu, cur_item);
                }

                hi_lite = cur_item;
                hlfg = ml->fg.pixel;
                hlbg = ml->bg.pixel;
                hlname = ml->name;
            }
	}
	else {

            /*
	     * If the mouse has moved out of the menu sideways, abort
	     * the menu operation. Reset the cursor and unmap the menu.
             */
	    if (cur_x < 0 || cur_x > menu->width) {
	        UnmapMenu(menu, mask);
		return(FALSE);
            }

	    /*
	     * If the mouse has moved below or above the menu, but is still
             * within the same vertical plane, then simply adjust the values
	     * so the user doesn't fall off the edge.
	     */
            if (cur_y >= menu->height) cur_y = menu->height - 1;
	    else if (cur_y < 0) cur_y = 0;

            /*
	     * If the mouse has moved to another item in the menu,
	     * highlight the new item.
             */
            cur_item = cur_y / menu->iheight;
	    if (cur_item != hi_lite) {

	        /*
		 * Remove highlighting on old item.
                 */
	        if (hi_lite) {
	            DisplayLine(menu->w, hi_lite * menu->iheight,
		                menu->width, menu->iheight, hlname,
		                hlfg, hlbg);
                }

                /*
	         * Highlight new item.
	         */
                if (cur_item) {
	            for(i = 1, ml = menu->line; ml; i++, ml = ml->next) {
	                if (i == cur_item) break;
		    }
                    DisplayLine(menu->w, cur_item * menu->iheight,
	                        menu->width, menu->iheight, ml->name,
	                        menu->hlfg.pixel, menu->hlbg.pixel);
                    vlist[0].y = cur_item * menu->iheight + 1;
	            XDraw(menu->w, vlist, NVERTS, 1, 1,
	                  menu->hlfg.pixel, GXcopy, AllPlanes);
                }
	        hi_lite = cur_item;
	        hlfg = ml->fg.pixel;
		hlbg = ml->bg.pixel;
                hlname = ml->name;
	    }
	}

        /*
         * Check to see if we have a change in the mouse buttons.
         * This means the user has selected an item or aborted the
         * operation.
         */
        if (XPending() && GetButton(&button_event)) {

            /*
             * Was button released?
             */
            if ((button_event.type == ButtonReleased) &&
                ((button_event.detail & ValueMask) == button)) {

		if (menu->piemenu) {
		    int x, y;
		    Window subw;

		    XInterpretLocator(menu->w, &x, &y, &subw, 
				      (button_event.x << 16) | button_event.y);
		    cur_item = Pie_Cur_Item(menu,
					    x - menu->center_x,
					    y - menu->center_y);
		}

		break;

            } else {

                /*
                 * Some other button event occurred, so abort the menu
                 * operation.
                 */
                UnmapMenu(menu, mask);
                return(TRUE);
            }
        }
    }

    /*
     * If no item was selected, simply close the menu and return.
     */
    if (!cur_item) {
        UnmapMenu(menu, mask);
        return(TRUE);
    }

    /*
     * Get a pointer to the menu line selected.
     */
    --cur_item;
    for(i = 0, ml = menu->line; ml; i++, ml = ml->next) {
        if (i == cur_item) break;
    }

    /*
     * Perform the selected menu line action.
     */
    switch (ml->type) {

        case IsShellCommand:
            UnmapMenu(menu, mask);
            system(ml->text);
            break;

#ifdef FUWM
	case IsForthCommand:
	    UnmapMenu(menu, mask);
	    F_exec_string = ml->text;

	    (*F_exec)();

	    break;
#endif

        case IsText:
            UnmapMenu(menu, mask);
            XStoreBytes(ml->text, strlen(ml->text));
            break;

        case IsTextNL:
            UnmapMenu(menu, mask);
            strbuf = (char *)malloc(strlen(ml->text) + 2);
            strcpy(strbuf, ml->text);
            strcat(strbuf, "\n");
            XStoreBytes(strbuf, strlen(strbuf));
            free(strbuf);
            break;

        case IsUwmFunction:
            UnmapMenu(menu, mask);
            GetContext(&sub_window, &cur_x, &cur_y);
            if (sub_window != menu->w)
                (*ml->func) (sub_window, mask, button, cur_x, cur_y);
            break;

        case IsImmFunction:
            UnmapMenu(menu, mask);
            (*ml->func) (window, mask, button, cur_x, cur_y);
            break;

        case IsMenuFunction:
            while (TRUE) {
                if (!GetButton(&button_event)) continue;
                if (button_event.type != ButtonPressed) continue;
                if ( /* (KeyMask(button_event.detail) != KeyMask(mask)) || */
                    ((button_event.detail & ButtonMods) != button)) {
                    UnmapMenu(menu, mask);
                    return(TRUE);
                }
                break;
            }
            UnmapMenu(menu, mask);

            func_stat = Menu(menu->w, mask, button, 
			     button_event.x, button_event.y, 
			     ml->menu);
            return(func_stat);
            break;

        default:
            Error("Menu -> Internal type error.");
    }
    return(TRUE);
}
#endif

/*
 * Create the menu windows for later use.
 */
CreateMenus()
{
    MenuLink *ptr;

    /*
     * If MaxColors isn't set, then jam it to an impossibly high
     * number.
     */
    if (MaxColors == 0)
        MaxColors = 25000;

    for(ptr = Menus; ptr; ptr = ptr->next)
        InitMenu(ptr->menu);
}

/*
 * Extend the bounds if it's less than the offset.
 */

Accommodate(offset, boundp)
     int offset, *boundp;
{
  if (offset < 0)
    offset = -offset;

  if (offset > *boundp)
    *boundp = offset;
}

Calc_Item_Offset(count, item, radius, xp, yp)
     int count, item, radius, *xp, *yp;
{
  double t, sin(), cos(), floor();

  t = item * (TWO_PI / count);

  *xp = floor(.5 + cos(t) * radius);
  *yp = floor(.5 + sin(t) * radius);
}

/*
 * Initialize a menu.
 */
InitMenu(menu)
MenuInfo *menu;
{
    MenuLine *ml;		/* Menu lines pointer. */
    int max_x = 0;		/* Maximum x distance from center. */
    int max_y = 0;		/* Maximum y distance from center. */
    int width;			/* Width of an item name. */
    int maxwidth;		/* Maximum width of item names. */
    int len;			/* Length of an item name. */
    int count = 1;		/* Number of items. */
    int x, y;			/* Item x and y offsets. */
    int i;
    double floor(), sin(), cos(), theta, angle;

    maxwidth = XQueryWidth(menu->name, MFont);
    if (maxwidth == 0)
	Error("InitMenu -> Couldn't get length of menu name");

    menu->iheight = MFontInfo.height + (VMenuPad << 1);
    menu->image = NULL;

    if (menu->piemenu) { /* Set up pie menus */
        /*
         * Make room for menu name.
         */
        Accommodate((maxwidth >> 1) + HMenuPad, &max_x);

        /*
         * Count the menu items.
	 */
        for (count = 0, ml = menu->line; ml; ml = ml->next)
	    count++;
        menu->items = count;

        /*
         * Calculate the positions of the items, and the size of the menu.
         */
        angle = PI / menu->items;		/* Half a selection width. */

        theta = (double) TWO_PI * menu->initial_angle / 360.0;

	while (theta >= TWO_PI)
	  theta -= TWO_PI;

        while (theta < 0.0)
	  theta += TWO_PI;

        for(ml = menu->line; ml; ml = ml->next,  theta += angle + angle) {

	    /* 
	     * Calculate the quadrant and slope of the leading edge of the
	     * selection.
	     */
	    calc_quadrant_slope((int)floor(.5 + sin(theta - angle) * 10000), 
			        (int)floor(.5 - cos(theta - angle) * 10000), 
				&ml->quadrant, &ml->slope);

	    /*
	     * Calculate the position of the middle of the selection name.
	     */

	    x = floor(.5 + sin(theta) * menu->radius);
	    y = floor(.5 - cos(theta) * menu->radius);

	    /*
	     * Calculate the position of the selection name text, and make room
	     * for it in the menu.
	     */
	    ml->width = XQueryWidth(ml->name, MFont);
            if (ml->width == 0)
		Error("InitMenu -> Couldn't get length of menu item name");

	    ml->x_offset = x - (ml->width >> 1);
	    ml->y_offset = y - (menu->iheight >> 1);

	    Accommodate(ml->x_offset, &max_x);
	    Accommodate(ml->x_offset + ml->width, &max_x);
	    Accommodate(ml->y_offset, &max_y);
	    Accommodate(ml->y_offset + menu->iheight, &max_y);
	}

        /*
         * Calculate menu center.
         */
        menu->center_x = HMenuPad + max_x;
        menu->center_y = VMenuPad + menu->iheight + VMenuPad +
		         1 + VMenuPad + max_y;

        /*
         * Calculate menu size.
         */
        menu->width = menu->center_x << 1;
        menu->height = menu->center_y + max_y + VMenuPad;

        /*
         * Calculate menu name position.
         */
        menu->name_x = menu->center_x - (maxwidth >> 1);
        menu->name_y = VMenuPad;
    }
    else { /* Set up pull down menus */
	/*
         * Determine the name of the longest menu item.
	 */

        for(ml = menu->line; ml; ml = ml->next) {
	    if ((len = strlen(ml->name)) == 0)
	        break;
            width = XQueryWidth(ml->name, MFont);
            if (width == 0)
		Error("InitMenu -> Couldn't get length of menu item name");
	    if (width > maxwidth) maxwidth = width;
	    count++;
        }

        /*
         * Stash the menu parameters in the menu info structure.
         */
        menu->height = menu->iheight * count;
	menu->width = maxwidth + (HMenuPad << 1);
    }

    /*
     * Get the color cells for the menu items.
     */
    GetMenuColors(menu);

    /*
     * Create the menu window.
     */
    menu->w = XCreateWindow(RootWindow,
                            0, 0,
                            menu->width,
                            menu->height,
                            MBorderWidth,
                            MBorder, MBackground);
    if (menu->w == NULL) Error("InitMenu -> Couldn't create menu window");

    /*
     * Store the window name.
     */
    XStoreName(menu->w, menu->name);

    /*
     * Define a cursor for the window.
     */
    if (menu->piemenu)
	XDefineCursor(menu->w, PieCursor);
    else
	XDefineCursor(menu->w, MenuCursor);
}

/*
 * Map a menu.
 */
MapMenu(menu, x, y)
MenuInfo *menu;
int x, y;
{
    int item, menu_x, menu_y, xoffset = 0, yoffset = 0;
    Window w, sub_window;
    MenuLine *ml;

    w = menu->w;

    /*
     * Move the menu into place, normalizing the coordinates, if necessary;
     * then map it.
     */

    if (menu->piemenu) {
	menu_x = x - (menu->center_x + MBorderWidth);
        menu_y = y - (menu->center_y + MBorderWidth);

    	while (XPending()) {
	    XButtonEvent event;
	    Window subw;

	    XNextEvent(&event);
	    if (event.type == ButtonReleased) {
		XMoveWindow(w, menu_x, menu_y);

		XPutBackEvent(&event);
		return;
	    }
	}
    }
    else {
        menu_x = x - ((menu->width >> 1) + MBorderWidth);
/*
	menu_y = y;
*/
	menu_y = y - ((menu->iheight >> 1) + MBorderWidth);
    }

    if (menu_x < 0) 
	xoffset = -menu_x, menu_x = 0;
    else if ((menu_x + menu->width + (MBorderWidth << 1)) >= ScreenWidth)
        menu_x += (xoffset = ScreenWidth - 
			     (menu_x + menu->width + (MBorderWidth << 1)));

    if (menu_y < 0)
	yoffset = -menu_y, menu_y = 0;
    else if ((menu_y + menu->height + (MBorderWidth << 1)) >= ScreenHeight)
        menu_y += (yoffset = ScreenHeight - 
			     (menu_y + menu->height + (MBorderWidth << 1)));

    XUpdateMouse(RootWindow, &x, &y, &sub_window);
    XWarpMouse(RootWindow, x + xoffset, y + yoffset);
    XMoveWindow(w, menu_x, menu_y);

    /*
     * Map the window and draw the text items.
     */
    XMapWindow(w);

    if (menu->piemenu) { /* Handle pie menus */
        /*
	 * Draw menu name.
         */
        XTextMask(w,
	          menu->name_x, menu->name_y + VMenuPad,
		  menu->name, strlen(menu->name),
	          MFont,
	          menu->fg.pixel);
        XLine(w,
	      0, menu->iheight + (VMenuPad << 1),
	      menu->width, menu->iheight + (VMenuPad << 1),
	      1, 1, 
	      menu->fg.pixel, GXcopy, AllPlanes);
    
        /*
	 * Draw items.
         */
        for(ml = menu->line; ml; ml = ml->next) {
	    XTextMask(w,
		      ml->x_offset + menu->center_x,
		      ml->y_offset + menu->center_y + VMenuPad,
		      ml->name, strlen(ml->name), MFont,
		      ml->fg.pixel);
        }

        /*
	 * Draw X at center.
         */
	XLine(menu->w,
	      menu->center_x - 4, menu->center_y - 4,
	      menu->center_x + 4, menu->center_y + 4,
	      1, 1, menu->fg.pixel, GXcopy, AllPlanes);
        XLine(menu->w, 
	      menu->center_x - 4, menu->center_y + 4,
	      menu->center_x + 4, menu->center_y - 4,
	      1, 1, menu->fg.pixel, GXcopy, AllPlanes);

/*
    	while (XPending()) {
	    XButtonEvent event;
	    Window subw;

	    XNextEvent(&event);
	    if (event.type == ButtonReleased) {
		XInterpretLocator(menu->w, &xlater, &ylater, &subw, 
				  (event.x << 16) | event.y);
		XPutBackEvent(&event);
		goto warp;
	    }
	}

	XUpdateMouse(RootWindow, &xlater, &ylater, &sub_window);

        XWarpMouse(w, (xlater - xsooner) + menu->center_x,
		      (ylater - ysooner) + menu->center_y);
*/
    }
    else { /* Handle pull down menus */
        DisplayLine(w, 0, menu->width, menu->iheight, menu->name,
                    menu->bg.pixel, menu->fg.pixel);

        SetUpVlist(menu);
	vlist[0].x = 1;
        vlist[0].y = 1;
        XDraw(menu->w, vlist, NVERTS, 1, 1, menu->bg.pixel, GXcopy, AllPlanes);
        item = menu->iheight;
        for(ml = menu->line; ml; ml = ml->next) {
            DisplayLine(w, item, menu->width, menu->iheight, ml->name,
                    ml->fg.pixel, ml->bg.pixel);
            item += menu->iheight;
        }

        /*
         * Position the mouse cursor in the menu header (or in the first item
         * if "autoselect" is set).
	 */
        if (Autoselect)
	    XWarpMouse(w, (menu->width >> 2) * 3, (menu->iheight >> 1) * 3);
        else XWarpMouse(w, (menu->width >> 2) * 3, menu->iheight >> 1);
    }
    XFlush();
}

/*
 * Unmap a menu, restoring the contents of the screen underneath
 * if necessary. (Restore portion is a future.)
 */
UnmapMenu(menu, mask)
MenuInfo *menu;
int mask;
{
    /*
     * Restore the main cursor.
     */
    Grab((short)mask);

    /*
     * Unmap and flush.
     */
    XUnmapWindow(menu->w);
    XFlush();
}

/*
 * Get the context for invoking a window manager function.
 */
GetContext(w, x, y)
Window *w;
int *x, *y;
{
    XButtonEvent button_event;  /* Button input event. */

    while (TRUE) {

        /*
         * Get the next mouse button event.  Spin our wheels until
         * a button event is returned (ie. GetButton == TRUE).
         * Note that mouse events within an icon window are handled
         * in the "GetButton" function or by the icon's owner if
         * it is not uwm.
         */
        if (!GetButton(&button_event)) continue;

        /*
         * If the button event received is not a ButtonPressed event
         * then continue until we find one.
         */
        if (button_event.type != ButtonPressed) continue;

        /*
         * Okay, determine the event window and mouse coordinates.
         */
        status = XInterpretLocator(RootWindow,
                                    x, y,
                                    w,
                                    button_event.location);

        if (status == FAILURE) continue;

        if (*w == 0)
            *w = RootWindow;

        return;
    }
}

/*
 * Get the color cells for a menu.  This function is slightly brain-damaged
 * in that once MaxColors <= 1, then it refuses to even try to allocate any
 * more colors, even though the colors may have already been allocated.  It
 * probably ought to be done right someday.
 */
GetMenuColors(menu)
MenuInfo *menu;
{
    register MenuLine *ml;		/* Menu lines pointer. */

    /*
     * If we have more than 2 colors available, then attempt to get
     * the color map entries requested by the user.
     * Otherwise, default to standard black and white.
     */
    if (DisplayCells() > 2) {

        /*
         * Get the menu header colors first.
         */
        if (!(menu->foreground && menu->background && MaxColors > 1 &&
              XParseColor(menu->foreground, &menu->fg) &&
              XGetHardwareColor(&menu->fg) &&
              XParseColor(menu->background, &menu->bg) &&
              XGetHardwareColor(&menu->bg))) {
            menu->fg.pixel = MTextForground;
            menu->bg.pixel = MTextBackground;
        } else {
            AdjustMaxColors(menu->fg.pixel);
            AdjustMaxColors(menu->bg.pixel);
        }

        /*
         * Get the menu highlight colors.
         */
        if (!(menu->fghighlight && menu->bghighlight && MaxColors > 1 &&
              XParseColor(menu->fghighlight, &menu->hlfg) &&
              XGetHardwareColor(&menu->hlfg) &&
              XParseColor(menu->bghighlight, &menu->hlbg) &&
              XGetHardwareColor(&menu->hlbg))) {
            menu->hlfg.pixel = MTextBackground;
            menu->hlbg.pixel = MTextForground;
        } else {
            AdjustMaxColors(menu->hlfg.pixel);
            AdjustMaxColors(menu->hlbg.pixel);
        }

        /*
         * Get the menu item colors.
         */
        for(ml = menu->line; ml; ml = ml->next) {
            if (!(ml->foreground && ml->background && MaxColors > 1 &&
                  XParseColor(ml->foreground, &ml->fg) &&
                  XGetHardwareColor(&ml->fg) &&
                  XParseColor(ml->background, &ml->bg) &&
                  XGetHardwareColor(&ml->bg))) {
                ml->fg.pixel = MTextForground;
                ml->bg.pixel = MTextBackground;
            } else {
                AdjustMaxColors(ml->fg.pixel);
                AdjustMaxColors(ml->bg.pixel);
            }
        }

    } else {

        /*
         * Only 2 colors available, so default to standard black and white.
         */
        menu->fg.pixel = MTextForground;
        menu->bg.pixel = MTextBackground;
        menu->hlfg.pixel = MTextBackground;
        menu->hlbg.pixel = MTextForground;
        for(ml = menu->line; ml; ml = ml->next) {
            ml->fg.pixel = MTextForground;
            ml->bg.pixel = MTextBackground;
        }
    }
}

/*
 * Decrement "MaxColors" if this pixel value has never been used in a
 * menu before.
 */
AdjustMaxColors(pixel)
int pixel;
{
    register MenuLink *mptr;
    register MenuLine *lptr;
    int count = 0;

    for(mptr = Menus; mptr; mptr = mptr->next) {
        if (mptr->menu->fg.pixel == pixel) ++count;
        if (mptr->menu->bg.pixel == pixel) ++count;
        if (mptr->menu->hlfg.pixel == pixel) ++count;
        if (mptr->menu->hlbg.pixel == pixel) ++count;
        for(lptr = mptr->menu->line; lptr; lptr = lptr->next) {
            if (lptr->fg.pixel == pixel) ++count;
            if (lptr->bg.pixel == pixel) ++count;
        }
        if (count > 1) return;
    }
    --MaxColors;
}

/*
 * Set up the vertex list for the hi-liter.
 */
SetUpVlist(menu)
MenuInfo *menu;
{
    vlist[1].x = menu->width - 3;
    vlist[1].y = 0;
    vlist[2].x = 0;
    vlist[2].y = menu->iheight - 3;
    vlist[3].x = (short)(0 - menu->width + 3);
    vlist[3].y = 0;
    vlist[4].x = 0;
    vlist[4].y = (short)(0 - menu->iheight + 3);
    vlist[1].flags = vlist[2].flags = vlist[3].flags =
    vlist[4].flags = VertexRelative;
}

/*
 * Local Variables:
 * c-argdecl-indent:0
 * c-indent-level:4
 * End:
 */

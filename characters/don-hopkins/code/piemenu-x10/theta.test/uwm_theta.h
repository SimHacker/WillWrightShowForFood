/*
 * Theta menus header file
 * Don Hopkins
 * University of Maryland
 */

#include <X/Xlib.h>

#define PI 3.1415926535897932
#define TWO_PI 6.2831853071795865

#define MENU_PAD 8

struct _theta_menuline {
  struct _theta_menuline *next;	/* Pointer to next line. */
  char *name;			/* Name of this line. */
  int type;			/* IsShellCommand, IsText, IsTextNL... */
  Window w;			/* Subwindow for this line. */
  char *text;			/* Text string to be acted upon. */
  Bool (*func)();		/* Window manager function to be invoked. */
  struct _menuinfo *menu;	/* Menu to be invoked. */
  char *foreground;		/* Name of foreground color. */
  char *background;		/* Name of background color. */
  Color fg;			/* Foreground color definition. */
  Color bg;			/* Background color definition. */
  int name_x_offset;
  int name_y_offset;
  int name_width;
  int name_height;
  struct theta_menu_item *next;
};

typedef struct _thetamenu {
  char *name;			/* Name of this menu. */
  Window w;			/* Menu window. */
  int name_x;			/* Menu name x position. */
  int name_y;			/* Menu name y position. */
  int name_width;		/* Menu name width. */
  int name_height;		/* Menu name height. */
  int width;			/* Menu width. */
  int height;			/* Menu height. */
  int center_x;			/* Menu center x. */
  int center_y;			/* Menu center y. */
  int radius;			/* Radius of menu items from center. */
  int slices;			/* Number of selections. */
  Pixmap image;			/* Saved image of the menu. */
  char *foreground;		/* Foreground color definition. */
  char *background;		/* Background color definition. */
  char *fghighlight;		/* Foreground highlight. */
  char *bghighlight;		/* Background highlight. */
  Color fg;			/* Foreground color definition. */
  Color bg;			/* Background color definition. */
  Color hlfg;			/* Foreground highlight color definition. */
  Color hlbg;			/* Background highlight color definition. */
  struct _theta_menuline *line;	/* Linked list of menu items. */
};


#include <stdio.h>
#include "theta.h"
#include "theta_cursor.h"
#include "theta_mask.h"

#define WIND_X 400
#define WIND_Y 400
#define RADIUS 100

#define MENU_FONT "9x15"
#define ITEM_FONT "6x10"

main(argc, argv)
int argc;
char *argv[];
{
  int theta, old_theta = -1, s;
  struct theta_menu *menu;
  FontInfo *menu_font, *item_font;
  Color menu_fg, menu_bg, item_fg, item_bg, exact_color;

  if (argc < 3) {
    fprintf(stderr, "usage: %s name item ...\n", argv[0]);
    exit(-1);
  }

  if (XOpenDisplay("") == NULL) 
    fprintf(stderr, "Could not open Display!\n");

  if ((menu_font = XOpenFont(MENU_FONT)) == NULL) {
    fprintf(stderr, "Error opening font %s.\n", MENU_FONT);
    exit(-1);
  }

  if ((item_font = XOpenFont(ITEM_FONT)) == NULL) {
    fprintf(stderr, "Error opening font %s.\n", ITEM_FONT);
    exit(-1);
  }

  menu = create_theta_menu(*++argv, RADIUS, WIND_X, WIND_Y,
			   menu_font, BlackPixel, WhitePixel,
			   item_font, BlackPixel, WhitePixel);
  argc--;

  while (--argc)
    add_theta_menu_item(menu, *++argv);


}
  
do_menu(menu, 
{
  XButtonEvent button_event;

  calc_menu(menu);
  refresh_menu(menu);

printf("tracking mouse\n");
  while (1) {
    

    get_mouse_theta(menu, &theta);
    if (theta != old_theta) {
      if (old_theta >= 0)
	show_item(menu, old_theta);
      show_item(menu, theta);
      XFlush();
      printf("%d\t", theta);
      fflush(stdout);
      old_theta = theta;
    }
  }
}

get_mouse_theta(menu, thetap)
     struct theta_menu *menu;
     int *thetap;
{
  int x, y;
  double atan2(), floor();
  Window subw;

  XUpdateMouse(menu->wind, &x, &y, &subw);
  x -= menu->center_x;
  y -= menu->center_y;

  *thetap = floor((((PI - atan2((double)x, (double)y)) / TWO_PI) +
		   (0.5 / menu->slices)) * 
		  (double)menu->slices);

  while (*thetap >= menu->slices)
    *thetap -= menu->slices;
}

calc_item_offset(slices, theta, radius, xp, yp)
     int slices, theta, radius, *xp, *yp;
{
  double t, sin(), cos(), floor();

  t = theta * (TWO_PI / slices);

  *xp = floor(.5 + sin(t) * radius);
  *yp = floor(.5 - cos(t) * radius);
}

show_item(menu, theta)
     struct theta_menu *menu;
     int theta;
{
  int x, y;
  struct theta_menu_item *item;

  item = find_theta_menu_item(menu, theta);

  XPixFill(menu->wind,
	   menu->center_x + item->name_x_offset - 2,
	   menu->center_y + item->name_y_offset - 2,
	   item->name_width + 4, item->name_height + 4,
	   1, NULL, GXinvert, AllPlanes);
}

calc_menu(menu)
     struct theta_menu *menu;
{
  int slices = 0, theta = 0, max_x = 0, max_y = 0;
  struct theta_menu_item *item;

printf("calc_menu\n");

  menu->name_width = XQueryWidth(menu->name, menu->menu_font->id);
  menu->name_height = menu->menu_font->height;

  accomodate((menu->name_width >> 1), &max_x);

  for (item = menu->items; item != NULL; item = item->next)
    slices++;

  menu->slices = slices;

  for (item = menu->items; item != NULL; item = item->next) {
    calc_item(menu, item, theta++);

    accomodate(item->name_x_offset, &max_x);
    accomodate(item->name_x_offset + item->name_width, &max_x);
    accomodate(item->name_y_offset, &max_y);
    accomodate(item->name_y_offset + item->name_height, &max_y);
  }

  menu->menu_width = (menu->center_x = max_x + MENU_PAD) << 1;
  menu->name_x = menu->center_x - (menu->name_width >> 1);
  menu->name_y = (menu->center_y = max_y + MENU_PAD) << 1;
  menu->menu_height = menu->name_y + menu->name_height + MENU_PAD;
}

calc_item(menu, item, theta)
     struct theta_menu *menu;
     struct theta_menu_item *item;
     int theta;
{
  int x, y;

  item->name_width = XStringWidth(item->name, menu->item_font, 0, 0);
  item->name_height = menu->item_font->height;

  calc_item_offset(menu->slices, theta, menu->radius, &x, &y);

  item->name_x_offset = x - item->name_width/2;
  item->name_y_offset = y - item->name_height/2;
}

accomodate(offset, boundp)
     int offset, *boundp;
{
  if (offset < 0)
    offset = -offset;

  if (offset > *boundp)
    *boundp = offset;
}

struct theta_menu *
create_theta_menu(name, radius, x, y, menu_font, menu_fg, menu_bg,
		  item_font, item_fg, item_bg)
     char *name;
     int radius, x, y;
     FontInfo *menu_font;
     int menu_fg, menu_bg;
     FontInfo *item_font;
     int item_fg, item_bg;
{
  struct theta_menu *menu;

  menu = (struct theta_menu *)malloc(sizeof(struct theta_menu));

  menu->name = name;
  menu->radius = radius;
  menu->menu_x = x;
  menu->menu_y = y;
  menu->menu_font = menu_font;
  menu->menu_fg = menu_fg;
  menu->menu_bg = menu_bg;
  menu->item_font = item_font;
  menu->item_fg = item_fg;
  menu->item_bg = item_bg;
  menu->wind = XCreateWindow(RootWindow, 0, 0, 16, 16, 1,
				   BlackPixmap, WhitePixmap);
  menu->items = NULL;

  return(menu);
}

add_theta_menu_item(menu, name)
     struct theta_menu *menu;
     char *name;
{
  struct theta_menu_item **itemp;

  for (itemp = &(menu->items) ; *itemp != NULL ; itemp = &(*itemp)->next)
    ;

  *itemp = (struct theta_menu_item *)malloc(sizeof(struct theta_menu_item));

  (*itemp)->name = name;
  (*itemp)->next = NULL;
}

refresh_menu(menu)
     struct theta_menu *menu;
{
  struct theta_menu_item *item;

printf("refresh_menu\n");
  XConfigureWindow(menu->wind, menu->menu_x, menu->menu_y,
		   menu->menu_width, menu->menu_height);
  XMapWindow(menu->wind);
  XClear(menu->wind);
  for (item = menu->items; item != NULL; item = item->next) {
    XText(menu->wind,
	  item->name_x_offset + menu->center_x,
	  item->name_y_offset + menu->center_y,
	  item->name, strlen(item->name),
	  menu->item_font->id, 
	  menu->item_fg,
	  menu->item_bg);
  }
  XText(menu->wind,
	menu->name_x, menu->name_y,
	menu->name, strlen(menu->name),
	menu->menu_font->id,
	menu->item_fg,
	menu->item_bg);
  XLine(menu->wind,
	menu->center_x - 4, menu->center_y - 4,
	menu->center_x + 4, menu->center_y + 4,
	1, 1, 1, GXinvert, AllPlanes);
  XLine(menu->wind, 
	menu->center_x - 4, menu->center_y + 4,
	menu->center_x + 4, menu->center_y - 4,
	1, 1, 1, GXinvert, AllPlanes);
  XFlush();
}

struct theta_menu_item *
find_theta_menu_item(menu, theta)
     struct theta_menu *menu;
     int theta;
{
  struct theta_menu_item *item = menu->items;

  while (theta-- != 0)
    item = item->next;

  return(item);
}

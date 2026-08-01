/*
 * Theta menus header file
 * Don Hopkins
 * University of Maryland
 */

#include <X/Xlib.h>

#define PI 3.1415926535897932
#define TWO_PI 6.2831853071795865

#define MENU_PAD 8

struct theta_menu_item {
  char *name;
  int name_x_offset;
  int name_y_offset;
  int name_width;
  int name_height;
  struct theta_menu_item *next;
};

struct theta_menu {
  char *name;
  int name_x;
  int name_y;
  int name_width;
  int name_height;
  FontInfo *menu_font;
  int menu_fg;
  int menu_bg;
  int radius;
  int slices;
  Window wind;
  int menu_x;
  int menu_y;
  int menu_width;
  int menu_height;
  int center_x;
  int center_y;
  struct theta_menu_item *items;
  FontInfo *item_font;
  int item_fg;
  int item_bg;
};

struct theta_menu *create_theta_menu();

struct theta_menu_item *find_theta_menu_item();

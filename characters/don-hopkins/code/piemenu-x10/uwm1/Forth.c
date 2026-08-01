#include "uwm.h"

Window F_window;
int F_mask;
short F_button;
int F_x, F_y;

extern int (*F_exec)();
extern char *F_exec_string;

Bool Forth(window, mask, button, x, y)
Window window;                          /* Event window. */
int mask;                               /* Button/key mask. */
short button;                           /* Button event detail. */
int x, y;                               /* Event mouse position. */
{
    F_window = window;
    F_mask = mask;
    F_button = button;
    F_x = x;
    F_y = y;

    F_exec_string = "f.forth";

    (*F_exec)();

    return(FALSE);
}

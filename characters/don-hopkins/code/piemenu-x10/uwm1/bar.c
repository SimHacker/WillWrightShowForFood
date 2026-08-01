#include <stdio.h>

cbar(arg)
int (*arg)();
{
  printf("Foo %d %x\n", (int)arg, (int)arg);
  (*arg)(123);
  printf("Bar\n");
}


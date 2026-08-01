#include <stdio.h>
#include "uwm.h"

main()
{
    printf("Bool %d int %d double %d addr %d\nColor %d Pixmap %d short %d\n",
	   sizeof(Bool), sizeof(int), sizeof(double), sizeof(char *), 
	   sizeof(Color), sizeof(Pixmap), sizeof(short));
}
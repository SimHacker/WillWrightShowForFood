#include <stdio.h>
#include <math.h>

#define PI 3.1415926535897932
#define TWO_PI 6.2831853071795865

main()
{
    double d;
    int x, y;

    while(scanf("%d %d", &x, &y) >= 0) {
	d = (double)atan2((double)y, (double)x);
	if (d < 0)
	  d += TWO_PI;
	printf("atan2(%d, %d) = %f = %f\n", x, y, d, 180*d/PI);
    }
}
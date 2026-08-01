/*
 * C interface to Unix time functions for Forth.
 */

#include <sys/time.h>

GetITimer(which,value)
int which;
struct itimerval *value;
{
	return(getitimer(which,value));
}

SetITimer(which,value,ovalue)
int which;
struct itimerval *value, *ovalue;
{
	return(setitimer(which,value,ovalue));
}

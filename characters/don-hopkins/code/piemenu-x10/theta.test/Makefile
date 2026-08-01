#
# 	Makefile	1.3	85/02/08
#
CFLAGS= -g 

.c.o:
	${CC} ${CFLAGS} -c $*.c

test: test.o
	cc ${CFLAGS} test.o -lX -lm -o test


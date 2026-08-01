int less_than(quadrant1, slope1, quadrant2, slope2)
int quadrant1;
double slope1;
int quadrant2;
double slope2;
{
    return(quadrant1 < quadrant2 ||
	   (quadrant1 = quadrant2 &&
	    slope1 < slope2));
}

int in_between(quadrant1, slope1, quadrant2, slope2, quadrant3, slope3)
int quadrant1;
double slope1;
int quadrant2;
double slope2;
int quadrant3;
double slope3;
{
    if (less_than(quadrant3, slope3, quadrant1, slope1))
	return(less_than(quadrant2, slope2, quadrant3, slope3) ||
	       less_than(quadrant1, slope1, quadrant2, slope2));
    return(less_than(quadrant1, slope1, quadrant2, slope2) &&
	   less_than(quadrant2, slope2, quadrant3, slope3));
}

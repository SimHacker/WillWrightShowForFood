using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace TheSimsAITest
{
	class Program
	{
		static void Main( string[] args )
		{
			SimulationTimer SimTimer = new SimulationTimer();
			Sim TestSim = new Sim();

			while( true )
			{
				Console.WriteLine( SimTimer.CurrentDay );
				Thread.Sleep( 100 );
			}
		}
	}
}

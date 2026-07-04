using System;
using System.Collections.Generic;
using System.Text;
using System.Timers;

namespace TheSimsAITest
{
	/// <summary>
	/// Simulates time progression, and updates things that needs to be updated
	/// along the way (need values etc).
	/// </summary>
	class SimulationTimer
	{
		private Timer m_Timer;
		//Number of ticks made by the timer during a simulation cycle.
		//Updated for every single tick (see m_Timer_Elapsed()).
		private int m_NumTicks;

		//m_Timer intervals (I.E how frequently the simulation will update).
		public int SLOW_SPEED = 14;
		public int MEDIUM_SPEED = 12;
		public int FAST_SPEED = 10;

		//Elapsed time intervals in minutes and hours during a day.
		//24 hours signifies a complete cycle, meaning all these members will
		//be reset to 0.
		private int m_ElapsedMins;
		private int m_ElapsedHours;
		private int m_ElapsedDays = 1;

		//For display purposes.
		//This member's value is determined by the value of m_ElapsedDays.
		private string m_CurrentDay = "";

		//Counter used for decreasing every sim's needs every 30 minutes
		//of simulation time. The counter is reset every 30th tick of the
		//simulation timer, and each tick represents 1 minute.
		int NeedsCounter;

		public SimulationTimer()
		{
			m_Timer = new Timer();
			m_Timer.Interval = FAST_SPEED;
			m_Timer.Elapsed += new ElapsedEventHandler(m_Timer_Elapsed);
			m_Timer.AutoReset = true;
			m_Timer.Start();
		}

		public string CurrentDay
		{
			get { return m_CurrentDay; }
		}

		/// <summary>
		/// Occurs each time a time interval has elapsed for the m_Timer object,
		/// and updates the simulation and neccessary update values as required.
		/// </summary>
		void m_Timer_Elapsed( object sender, ElapsedEventArgs e )
		{
			//Update ticks.
			m_NumTicks++;

			//Update time in minutes and hours.
			m_ElapsedMins = m_NumTicks % 60;
			m_ElapsedHours = ( m_NumTicks / 60 ) % 60;

			//Reset the simulation cycle every 24 hours.
			if( m_ElapsedHours == 24 )
			{
				m_ElapsedMins = 0;
				m_ElapsedHours = 0;
				m_NumTicks = 0;

				m_ElapsedDays = m_ElapsedDays + 1;
			}

			//Reset the simulation week cycle every 7th day.
			if( m_ElapsedDays > 7 )
				m_ElapsedDays = 1;

			//Determine the current day by using m_ElapsedDay.
			switch( m_ElapsedDays )
			{
				case 1:
					m_CurrentDay = "Monday";
					break;
				case 2:
					m_CurrentDay = "Tuesday";
					break;
				case 3:
					m_CurrentDay = "Wednesday";
					break;
				case 4:
					m_CurrentDay = "Thursday";
					break;
				case 5:
					m_CurrentDay = "Friday";
					break;
				case 6:
					m_CurrentDay = "Saturday";
					break;
				case 7:
					m_CurrentDay = "Sunday";
					break;
			}

			NeedsCounter++;
				
			//Update the needs class of each sim in the Sims
			//array in GameContainer based on elapsed time
			//(each need should decrease by 5 for each 30 mins
			//of elapsed time).
			foreach(Sim TempSim in GameContainer.GetSims())
			{
				//Find out if 30 minutes has elapsed since the last time
				//thirty minutes elapsed.
				if( NeedsCounter == 30 )
				{
					if( TempSim.needs.Bladder > TempSim.needs.MIN_NEED_VALUE )
						TempSim.needs.Bladder = TempSim.needs.Bladder - 5;

					if( TempSim.needs.Fun > TempSim.needs.MIN_NEED_VALUE )
						TempSim.needs.Fun = TempSim.needs.Fun - 5;

					if( TempSim.needs.Hunger > TempSim.needs.MIN_NEED_VALUE )
						TempSim.needs.Hunger = TempSim.needs.Hunger - 5;

					if( TempSim.needs.Hygiene > TempSim.needs.MIN_NEED_VALUE )
						TempSim.needs.Hygiene = TempSim.needs.Hygiene - 5;

					Console.WriteLine( "Bladder: " + TempSim.needs.Bladder );
					Console.WriteLine( "Hygiene: " + TempSim.needs.Hygiene );
					Console.WriteLine( "Hunger: " + TempSim.needs.Hunger );
					Console.WriteLine( "Fun: " + TempSim.needs.Fun );

					NeedsCounter = 1;
				}
			}
		}
	}
}

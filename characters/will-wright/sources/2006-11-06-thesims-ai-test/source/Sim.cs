using System;
using System.Collections.Generic;
using System.Text;

namespace TheSimsAITest
{
	/// <summary>
	/// Bare bones implementation of a Sim as an AI agent (of sorts).
	/// </summary>
	class Sim
	{
		private Needs m_Needs;

		public Sim()
		{
			m_Needs = new Needs();
			//Add sim to silly container that keeps track of all sims and objects
			//in a game.
			GameContainer.AddSim( this );
		}

		public Needs needs
		{
			get { return m_Needs; }
			set { m_Needs = value; }
		}
	}
}

using System;
using System.Collections.Generic;
using System.Text;

namespace TheSimsAITest
{
	/// <summary>
	/// Silly class to keep track of current sims and objects involved in the game
	/// at any given time.
	/// </summary>
	class GameContainer
	{
		//Yes, I know these should be dynamic, but I can't be assed to figure out
		//a way to do it right now...
		private static Sim[] m_Sims = new Sim[100];
		private static InteractionObject[] m_IObjects = new InteractionObject[100];

		//Number of sims and objects currently in the game.
		//Used to update the respective arrays.
		private static int m_NumSims = 0;
		private static int m_NumIObjects = 0;

		public static void AddSim( Sim NewSim )
		{
			if( m_NumSims < 99 )
			{
				m_Sims[m_NumSims] = NewSim;
				m_NumSims = m_NumSims + 1;
			}
		}

		public static Sim[] GetSims()
		{
			return m_Sims;
		}

		public static void AddIObject( InteractionObject NewIObject )
		{
			if( m_NumIObjects < 99 )
			{
				m_IObjects[m_NumIObjects] = NewIObject;
				m_NumIObjects = m_NumIObjects + 1;
			}
		}
	}
}

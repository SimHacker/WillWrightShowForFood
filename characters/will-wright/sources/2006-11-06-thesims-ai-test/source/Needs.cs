using System;
using System.Collections.Generic;
using System.Text;

namespace TheSimsAITest
{
	class Needs
	{
		private float m_Hunger = 100;
		private float m_Bladder = 100;
		private float m_Fun = 100;
		private float m_Hygiene = 100;

		//The maximum value that any need can have at any point in time.
		public int MAX_NEED_VALUE = 100;
		//The minimum value that any need can have at any point in time.
		public int MIN_NEED_VALUE = -100;

		public float Hunger
		{
			get { return m_Hunger; }
			set { m_Hunger = value; }
		}

		public float Bladder
		{
			get { return m_Bladder; }
			set { m_Bladder = value; }
		}

		public float Fun
		{
			get { return m_Fun; }
			set { m_Fun = value; }
		}

		public float Hygiene
		{
			get { return m_Hygiene; }
			set { m_Hygiene = value; }
		}
	}
}

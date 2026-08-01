<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl">

  <xsl:template match="/">

    <HTML>

      <HEAD>
	<TITLE>Pie Menu Schema Editor</TITLE>
      </HEAD>

      <BODY>


	<CENTER>

	  <H1>Pie Menu Schema Editor</H1>
          <H2>By Don Hopkins</H2>

	</CENTER>

	<HR/>

	<XML id="PieMenuSpec">
	  <xsl:copy>
	    <xsl:apply-templates select="@* | node()"/>
	  </xsl:copy>
	</XML>

	<DIV ID="Barf"></DIV>

	<DIV ID="MyPieMenuEditor"
	     STYLE="behavior:url(piemenuschemaeditor.htc)"
	     PIEMENU="PieMenuSpec"
	     ONAFTERMAKEPIE="LoadPieMenuEditor()">
	  [Pie Menu Editor]
	</DIV>

      </BODY>

    </HTML>

  </xsl:template>

  <xsl:template match="@* | node()"><xsl:copy><xsl:apply-templates select="@* | node()"/></xsl:copy></xsl:template>

</xsl:stylesheet>

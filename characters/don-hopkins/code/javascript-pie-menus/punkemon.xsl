<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl">
  <xsl:template match="/">

    <HTML>

      <HEAD>
        <TITLE>Punkemon Pie Menus</TITLE>
      </HEAD>

      <BODY>

	<DIV ID="Barf"></DIV>

	<DIV STYLE="width=100%;height=80%;behavior:url(piemenu.htc)"
	  onchange="ChangePunkemon(event)">

	  <CENTER>
	    <H1>Punkemon Pie Menus!</H1>
	    <IMG SRC="Punkemon/island.jpg"/>
	  </CENTER>

	  <XML>

	    <piemenu
	      id="root"
	      fixedradius="90"
	      centermargin="50"
	      centerbackground="white"
	      itemnormalbackground="white"
	      itemselectedbackground="gray">

	      <html>
		Punkemon<BR/>
		Pie Menus
	      </html>

	      <xsl:for-each select="*/punkeland">

		<item>

		  <xsl:attribute name="fixedradius"
		    ><xsl:value-of select="@itemradius"/></xsl:attribute>

		  <html>
		    <B><xsl:value-of select="@name"/></B>

		    <DIV>

		      <xsl:for-each select="punkemon">

			<IMG>
				  <xsl:attribute name="SRC"
				    ><xsl:value-of select="@image"/></xsl:attribute>
			</IMG>

			<xsl:if test="@break">
				  <BR/>
			</xsl:if>

		      </xsl:for-each>

		    </DIV>
		  </html>

		  <piemenu
		    centerbackground="white"
		    itemnormalbackground="white"
		    itemselectedbackground="gray">

		    <xsl:attribute name="fixedradius"
		      ><xsl:value-of select="@pieradius"/></xsl:attribute>

		    <xsl:attribute name="id"
		      ><xsl:value-of select="@name"/></xsl:attribute>

		    <html>
		      <DIV STYLE="width:170;height:170"/>
		    </html>

		    <xsl:for-each select="punkemon">

		      <item
			centerbackground="white"
			itemnormalbackground="white"
			itemselectedbackground="gray">

			<xsl:attribute name="id"
			  ><xsl:value-of select="@name"/></xsl:attribute>

			<html>
			  <IMG>
			    <xsl:attribute name="SRC"
			      ><xsl:value-of select="@image"/></xsl:attribute>
			  </IMG>
			</html>

			<piemenu
			  id="leaf"
			  centerbackground="white"
			  itemnormalbackground="white"
			  itemselectedbackground="gray">

			  <html>
			    <CENTER>
			      <B><xsl:value-of select="@name"/></B>
			      <BR/>
			      <IMG
				WIDTH="130"
				HEIGHT="130">
				<xsl:attribute name="SRC"
				  ><xsl:value-of select="@image"/></xsl:attribute>
			      </IMG>
			    </CENTER>
			  </html>

			  <item
			    fixedradius="90">
			    <xsl:attribute name="url"
			      ><xsl:value-of select="@url"/></xsl:attribute>
			    <html>
			      <xsl:value-of select="@name"/>'s Home Page
			    </html>
			  </item>
			  <item
			    fixedradius="90">
			    <html>
			      <CENTER>
				<TABLE BORDER="1">
				  <TR>
				    <TD ALIGN="right"><B>Name:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@name"/></TD>
				  </TR>
				  <TR>
				    <TD ALIGN="right"><B>Found in:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@foundin"/></TD>
				  </TR>
				  <TR>
				    <TD ALIGN="right"><B>Attacks:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@attacks"/></TD>
				  </TR>
				  <TR>
				    <TD ALIGN="right"><B>Likes:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@likes"/></TD>
				  </TR>
				  <TR>
				    <TD ALIGN="right"><B>Dislikes:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@dislikes"/></TD>
				  </TR>
				  <TR>
				    <TD ALIGN="right"><B>Creator:</B></TD>
				    <TD WIDTH="350"><xsl:value-of select="@creator"/></TD>
				  </TR>
				</TABLE>
				<DIV STYLE="width:400">
				  <xsl:value-of select="description"/>
				</DIV>
			      </CENTER>
			    </html>
			  </item>
			</piemenu>
		      </item>

		    </xsl:for-each>

		  </piemenu>

		</item>

	      </xsl:for-each>

	    </piemenu>

	  </XML>

	</DIV>

	<SCRIPT>
<![CDATA[


function ChangePunkemon(event)
{
  var pie =
    event.result;

  if ((pie.id == "root") ||
      (pie.id == "leaf")) {
    return;
  } // if

  var curItem = 
    pie.curItem;

  var str = "";

  if (curItem == -1) {
    str = "<BR/><BR/>Select a Punkemon from<BR/>" +
      "<B>" + pie.id + "</B>";
  } else {
    var item =
      pie.items[curItem];
    var itemWidth = 130;
    var itemHeight = 130;
    var itemName =
      item.id;
    var itemImage =
      item.div.children(0).children(0).src;
    str =
      "<B>" + itemName + "</B><BR/>" + 
      "<IMG SRC='" + itemImage +
      "' WIDTH='" + itemWidth +
      "' HEIGHT='" + itemHeight +
      "'/>";
  } // if

  pie.centerDiv.children(0).innerHTML =
    str;

  // Test to see if our strings have been rudely quoted. 
  if ("<P/>".length != 4) {
    // For some reason, the angled brackets and ampersands are quoted, 
    // so we have to do this trick to evaluate them.
    pie.centerDiv.children(0).innerHTML =
      pie.centerDiv.children(0).innerText;
  } // if
}

]]>

	</SCRIPT>

      </BODY>

    </HTML>

  </xsl:template>
</xsl:stylesheet>

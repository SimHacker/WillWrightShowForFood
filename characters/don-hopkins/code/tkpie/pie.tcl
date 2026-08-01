########################################################################
#
# Pie Menus for Tk.
# Copyright (C) 1992 by Don Hopkins.  All rights reserved.
#
# This program is provided for unrestricted use, provided that this 
# copyright message is preserved. There is no warranty, and no author 
# or distributer accepts responsibility for any damage caused by this 
# program. 
# 
# This code and the ideas behind it were developed over time by Don Hopkins 
# with the support of the University of Maryland, UniPress Software, Sun
# Microsystems, DUX Software, the Turing Institute, and Carnegie Mellon
# University.  Pie menus are NOT patented or restricted, and the interface 
# and algorithms may be freely copied and improved upon. 
#


########################################################################
# Mouse Tracking State Machine

# Set up the bindings to pop up $pie when the right button is clicked in $win
proc InitPie {win pie} {
  bind $win <3> "PieMenuDown $win $pie $pie Initial %X %Y"
  bind $win <B3-Motion> {}
  bind $win <ButtonRelease-3> {}
  bind $win <Motion> {}
}

# Set up the bindings to continue tracking $pie
# Get this: we keep the tracking machine state in the bindings!
proc ActivatePie {win root pie state} {
  bind $win <3> "PieMenuDown $win $root $pie $state %X %Y"
  bind $win <B3-Motion> "PieMenuMotion $win $root $pie $state %X %Y"
  bind $win <ButtonRelease-3> "PieMenuUp $win $root $pie $state %X %Y"
  bind $win <Motion> "PieMenuMotion $win $root $pie $state %X %Y"
}

# Cancel and reset a pie menu
proc CancelPie {win} {
  set binding [bind $win <3>]
  set root [lindex $binding 2]
  set pie [lindex $binding 3]
  set state [lindex $binding 4]
  if {"$state" != "Initial"} {
    catch {$root ungrab $win}
    $pie unpost
    $pie activate none
  }
  InitPie $win $root
}

# Handle pie menu button down
proc PieMenuDown {win root pie state x y} {
  case $state {
    Initial {
      ActivatePie $win $root $pie FirstDown
      update idletasks
      catch {$root grab $win}
      $pie activate none
      $pie post $x $y
      update idletasks
    }
    ClickedUp {
      TrackPieMenu $pie $x $y
      ActivatePie $win $root $pie SecondDown
    }
    SelectedUp {
      $pie activate none
      $pie post $x $y
      $pie defer
      ActivatePie $win $root $pie SecondDown
    }
    FirstDown { # error
      CancelPie $win
    }
    SecondDown { # error
      CancelPie $win
    }
  }
}

# Handle pie menu button motion
proc PieMenuMotion {win root pie state x y} {
  case $state {
    FirstDown {
      TrackPieMenu $pie $x $y
      $pie defer
    }
    ClickedUp {
      $pie activate none
      $pie post $x $y
    }
    SecondDown {
      TrackPieMenu $pie $x $y
      $pie defer
    }
    SelectedUp {
      $pie activate none
      $pie post $x $y
    }
    Initial { # error
      CancelPie $win
    }
  }
}

# Handle pie menu button up
proc PieMenuUp {win root pie state x y} {
  case $state {
    FirstDown {
      TrackPieMenu $pie $x $y
      set active [$pie index active]
      if {$active == "none"} {
	$pie show
        catch {$root grab $win}
        ActivatePie $win $root $pie ClickedUp
      } else {
        set submenu [lindex [$pie entryconfig $active -piemenu] 4]
	if {$submenu == {}} {
	  catch {$root ungrab $win}
	  $pie unpost
          $pie activate none
	  eval [lindex [$pie entryconfig $active -command] 4]
          InitPie $win $root	
	} else {
	  $pie unpost
          $pie activate none
          $submenu activate none
          $submenu post $x $y
          catch {$root grab $win}
	  ActivatePie $win $root $submenu SelectedUp
	}
      }
    }
    SecondDown {
      TrackPieMenu $pie $x $y
      set active [$pie index active]
      if {$active == "none"} {
	CancelPie $win
      } else {
        set submenu [lindex [$pie entryconfig $active -piemenu] 4]
	if {$submenu == {}} {
	  catch {$root ungrab $win}
	  $pie unpost
          $pie activate none
	  eval [lindex [$pie entryconfig $active -command] 4]
	  InitPie $win $root
	} else {
	  $pie unpost
          $pie activate none
          $submenu activate none
          $submenu post $x $y
          catch {$root grab $win}
	  ActivatePie $win $root $submenu SelectedUp
	}
      }
    }
    Initial { # error
      CancelPie $win
    }
    ClickedUp { # error
      CancelPie $win
    }
    SelectedUp { # error
      CancelPie $win
    }
  }
}

# Track the selected item
proc TrackPieMenu {pie x y} {
  $pie activate @$x,$y
}

########################################################################
# Demo

# Make some pie menus
piemenu .compass -title Compass
.compass add command -label East	-command "Select East"
.compass add command -label NE		-command "Select NE"
.compass add command -label North	-command "Select North"
.compass add command -label NW		-command "Select NW"
.compass add command -label West	-command "Select West"
.compass add command -label SW		-command "Select SW"
.compass add command -label South	-command "Select South"
.compass add command -label SE		-command "Select SE"

piemenu .clock -title Clock
.clock add command -label III		-command "Select 3"
.clock add command -label II		-command "Select 2"
.clock add command -label I		-command "Select 1"
.clock add command -label XII		-command "Select 12"
.clock add command -label XI		-command "Select 11"
.clock add command -label X		-command "Select 10"
.clock add command -label IX		-command "Select 9"
.clock add command -label VIII		-command "Select 8"
.clock add command -label VII		-command "Select 7"
.clock add command -label VI		-command "Select 6"
.clock add command -label V		-command "Select 5"
.clock add command -label IV		-command "Select 4"

piemenu .confirm -initialangle 90
.confirm add command -label Yes		-command "Select Yes"
.confirm add command -label No		-command "Select No"

piemenu .dial -title Dial -initialangle 0
.dial add command -label 0		-command {Dial [.dial direction] [.dial distance]}
.dial add command -label 90		-command {Dial [.dial direction] [.dial distance]}
.dial add command -label 180		-command {Dial [.dial direction] [.dial distance]}
.dial add command -label 270		-command {Dial [.dial direction] [.dial distance]}

piemenu .demo -title Demo -initialangle 90 -shaped 0
.demo add piemenu -label Compass	-piemenu .compass
.demo add piemenu -label Clock		-piemenu .clock
.demo add piemenu -label Confirm	-piemenu .confirm
.demo add piemenu -label Dial		-piemenu .dial


# Callback procedures
proc Select {name} {
  .label config -text "Selected $name"
}

proc Dial {dir dist} {
  .label config -text "Dialed direction $dir distance $dist"
}

# Make something to click on
label .label -text "Click Right!"

pack append . .label {frame center expand fill}

# Bind the window .label to the pie menu .demo
InitPie .label .demo

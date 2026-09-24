# "Cambridge's PDP-7 Minicomputer (1969)" — At The Controls, Facebook

| Field | Value |
|-------|-------|
| Venue | [At The Controls](https://www.facebook.com/groups/779220482206901/posts/6297725037023057/) (Facebook group) |
| Posted by | Michel Talbot, 25 September 2023 |
| Seen | 24 September 2026 |
| What it is | A photo post: Heinz Lemke at the PDP-7 and 340 running PIXIE, with a caption |

## The caption and its source

The caption summarizes [Electronics International, 28 April 1969](electronics-international-1969-04-28-pixie.md),
pp. 158–159: PIXIE by Heinz Lemke, Neil Wiseman and John Hiles; light pen only, no
pushbuttons; the "ICT Atlas Mark 2" main machine (Titan) with 120,000 48-bit words and
Cambridge's multi-access system; the PDP-7 with 8K words and a DEC 340 as the satellite;
analysis on the big machine only after the designer commits; drawing and pointing modes;
elements, nodes and subcircuits as the three levels of manipulation.

It adds two influences the 1969 article summary here does not carry: Sketchpad on the TX-2,
and the IBM 2250 Model 4's satellite computer. Unconfirmed; check the full article in the
private archive.

## What the 1972 listing confirms

The caption's workflow is in [SYMELEC's source](pixie-assembler-listing-1972/symelec-listing.txt),
by name:

| Caption | Listing |
|---|---|
| temporary display file | `TEMPDF` ("TURN DUMMY FILE IN TEMPDF SPACE", 1347) |
| up-compiler | `JMS UPCOMP` at 3575, then `COMPIL` at 3604 |
| permanent display file | `PERMDF` ("STOP DISPLAY OF PERMDF", 1016) |
| indicators blink when the pen is aimed at them | `BLINK`, `MBLINK`, `RBLINK`; "CATALOGUE BLINKING ITEM" (760), "POINTING MODE, REQUEST?" (3705) |

## Leads from the comments

- **Jim Pazaris** saw a demo of the system at RCA, which started his career in CAD. This
  agrees with the thesis's list of ports, which has one at RCA Laboratories, Princeton
  ([pixie-hardware.md](../pixie-hardware.md), "Other PIXIE installations").
- **Mike Kemp** played Spacewar on this computer, from paper tape. If that means the Math Lab's
  PDP-7, it is a second program on the same machine as PIXIE; worth asking him which game and
  which tape.
- **Keith Nash** notes that Heinz is still an active researcher in computer-assisted medicine
  (see [CARS 2027](../cars-2027-medicine.md)).

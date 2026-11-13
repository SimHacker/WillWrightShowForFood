# tiny-mabell, tiny-tip and tiny-arpa: dialing in to a network that's gone

Design only. Three small services that put the cabinet's machines on a 1970s network the way
people reached it: a modem, a phone number, a Terminal IMP, a host name. The first caller is
Don's own Apple ][ terminal, an H19 emulator he wrote in his Forth in 1986
([Apple2Forth](../../characters/don-hopkins/artifacts/Apple2Forth/README.md)), which is how he
got onto the ARPANET and lived on MIT-MC. The goal is that disk, unmodified, typing `ATDT` and
logging in to ITS again.

Each layer is a stand-in for the far end of a conversation, as [tiny-titan](TINY-TITAN.md) is
for Titan: the real protocol at the edge the old program sees, and the least machinery behind it.

## tiny-mabell: the phone company

A modem device for any machine's serial port, and a phone network between them.

- **The modem** speaks the Hayes command set at the serial port: `AT`, `ATDT` and `ATDP` with a
  number, `ATA`, `ATH`, `ATS0=n` to auto-answer, `+++` with guard time to escape, and the result
  codes `CONNECT 300`/`1200`/`2400`, `RING`, `BUSY`, `NO CARRIER`, `NO ANSWER`. Carrier detect
  and ring drive the card's status lines. Bytes cross the line at the connected rate, so 300 baud
  feels like 300 baud. An acoustic coupler mode skips the AT commands: the line is up when the
  handset is down.
- **The exchange** maps phone numbers to endpoints. An endpoint is another machine in the same
  page, a machine in another tab (`BroadcastChannel`), a machine on another computer (through
  tiny-titan's WebSocket server), or a service: tiny-tip, a tiny-its, a Forth, a UNIX.
- **The directory** lives on tiny-titan's server: register a number for an endpoint, look one up,
  list who answers. Numbers have area codes, so each deployment can be its own exchange and long
  distance is another server. A machine that sets auto-answer registers itself.
- **Sound**, as one of the machine's senses: dial tone, DTMF or pulse clicks, ringback, busy, and
  the modem handshake, played as the call proceeds and skippable.
- **Limits**: dialing out of the simulation to real internet hosts goes through a telnet bridge
  on the server, to a list the operator sets; never an open relay. Calls are rate limited.

## tiny-tip: the Terminal IMP

A TIP was an IMP with terminal ports: you dialed its number, typed `@` commands, and it opened a
connection to a host on the network. tiny-tip answers on a tiny-mabell number and does the same,
and it is the TIP's front end only, as tiny-titan is Titan's.

The TIPs Don dialed from Maryland at 300 baud were NBS-TIP, at **301-948-3850** (he dialed it
often enough to still remember it; the number came from Bruce of Bruce's NorthStar BBS in
Virginia), MITRE's and PENT-TIP at the Pentagon. Logging in to an ITS host was `@L` and its
decimal host number ([Don on HN](https://news.ycombinator.com/item?id=13518273), 2017):

| Host | Command |
|------|---------|
| MIT-MC | `@L 236` |
| MIT-AI | `@L 134` |
| MIT-DM | `@L 70` |
| MIT-ML | `@L 198` |

The same comment remembers two tricks from BBN's *Users Guide to the Terminal IMP*
([reference/BBN-ADA014398_Users_Guide_to_the_Terminal_IMP_Aug75.pdf](reference/BBN-ADA014398_Users_Guide_to_the_Terminal_IMP_Aug75.pdf),
August 1975, from [bitsavers via the Internet Archive](https://archive.org/details/bitsavers_bbntipADA0eTerminalIMPAug75_2157363)).
BBN mailed Don a copy for the asking, free, to his home address, with no questions.

- **Talking to another TIP** (section 5-B, page 5-4): "using the TIP as a fancy telephone
  connection". `@HOST 158`, `@SEND TO SOCKET 1600002`, `@RECEIVE FROM SOCKET 1600003`,
  `@PROTOCOL BOTH`, with the far end doing the same, opens a full duplex line between two TIP
  ports. The TIP puts the port number in the high 16 bits of the socket and 2 or 3 in the low
  bits for receiving or sending, which is the parity Don remembered.
- **Setting another terminal's parameters** (section 5-D, page 5-7): the octal port number of
  another user on the same TIP, between the `@` and the command, ran the command on their
  session.

tiny-tip implements the commands from the manual, not from memory, and both tricks: the second
is a lesson in what the network trusted.

In [*The Americans*](https://en.wikipedia.org/wiki/Arpanet_(The_Americans)) the Soviet spies kill
a man to get onto the ARPANET. A teenager in Maryland did it with a phone number from a BBS: a
TIP asked for no password, the ITS machines gave accounts to whoever asked nicely, and BBN mailed
the manual to his house. "I didn't even have to kill anyone!"

Geoff Mulligan, who ran PENT-TIP from 1979, describes it on
[NANOG](https://lists.nanog.org/archives/list/nanog@lists.nanog.org/message/3IOQEWFC4E5BF6W66W7XH5UDD2CNECEL/)
(2020): a bank of 300 and 1200 baud modems, an IMP on the ARPANET through a 56K modem the size of
a five-foot 19-inch rack, a TI Silent 700 with a built-in acoustic coupler to take home, and
"TIP phone numbers were closely guarded treasure". tiny-mabell's directory starts with
NBS-TIP's number; MITRE's and PENT-TIP's are still to find.

## tiny-arpa: the hosts

A host table in the format of the SRI-NIC `HOSTS.TXT`, with the historical names and numbers
where we know them (MIT-MC was host 354 octal, 236 decimal, from Moon's note of February 1976 on
the [ICM page](https://icm.museum/blog/?p=38)). Each entry points at an endpoint:

- **In the cabinet:** PDP-7 UNIX on the [RB09](UNIX-V0.md), Mitch Bradley's Forth, tiny-its,
  and the KA10 running ITS once [PDP10.md](PDP10.md) is built.
- **Outside:** SIMH's KA10 or KL10 running the [PDP-10/its](https://github.com/PDP-10/its)
  build on a server, behind the telnet bridge, until the cabinet's own PDP-10 runs it.

The stream is plain telnet-style bytes first; SUPDUP later, for ITS's display terminals.

## The first call

1. The browser Apple boots the H19 disk on the `apple2-plus-videx` profile, with the 2651 serial
   card in expansion slot 4. The card's other end, `microM8.serialSend` and `serialTake`, connects to a
   tiny-mabell modem.
2. Before ITS exists anywhere in reach: the Apple dials a number that answers with the PDP-7
   UNIX in the same page, and logs in as `dmr`. One page, two machines, a phone line between
   them.
3. Then `ATDT 3019483850`, NBS-TIP answers, `@L 236`, and an ITS login on MC, first on SIMH
   behind the bridge and later on the cabinet's own PDP-10.

## The script: Bruce's recipe

The acceptance test is the recipe Bruce of Bruce's NorthStar BBS gave Don, as Don wrote it down
in [PDP-10/its#1339](https://github.com/PDP-10/its/issues/1339) (2018) and on
[Hacker News](https://news.ycombinator.com/item?id=15080221) (2017, archived in
[mit-ai-lab-grateful-tourist-hn.md](../../characters/don-hopkins/mit-ai-lab-grateful-tourist-hn.md)).
Each step is something tiny-mabell, tiny-tip or the ITS behind them must do:

1. After 8 PM Eastern, dial NBS-TIP at 300 baud. tiny-mabell keeps a clock; tourist hours
   are part of the simulation.
2. Type `E` to get the TIP's banner.
3. `@L 134` to connect to MIT-AI. NCP host numbers were 8 bits.
4. Make up a name and `:LOGIN A2DEH`. If ITS asks for a password, the name is taken: pick
   another.
5. If ITS doesn't know the name, it asks whether you want to apply for an account, and why you
   want to use the AI Lab's PDP-10. "Learning LISP."
6. Once approved, every ITS machine knows you, but DM still won't let you log in directly.
7. For Zork, after 8 PM, `@L 70` to DM and log in as `URANUS` with password `RINGS`.
8. `:CHUNAME A2DEH`, so three kids logged in as `URANUS`, `URANU0` and `URANU1` don't look
   suspicious.
9. Two can play Zork at once. Everyone else chats, or watches the game with `:OS PDL`.

Steps 1 to 3 are tiny-mabell's and tiny-tip's. Steps 4 to 9 belong to the ITS behind them, and
some are history rather than code: the account application went to people, and the restored
ITS's guest accounts and Zork setup differ from DM's back then. Where they differ, the cabinet
says so on the screen and does not fake it.

The disk answers the modem questions. `INIT-MODEM` sends nothing down the line: it installs the
interrupt vector and programs the 2651's mode, baud and command registers. The driver has words
for 300 to 38400 baud and loads at 2400. Dialing is Hayes, typed through the terminal or sent by
small Forth words that build `ATZ` and `ATDT` strings, so tiny-mabell's modem must accept Hayes
at the card's rate. The disk also holds a January 1989 capture of sessions on
`brillig.umd.edu`, the University of Maryland CS department machine. It has no script for the
campus Gandalf dial-up switch that connected modems to the department's VAXen and other campus
machines, and no campus numbers. tiny-mabell can still answer as a Gandalf switch, prompt and
all, once someone remembers or finds what it said.

Still to check: which network the
1986 terminal reached: the ARPANET moved from NCP to TCP/IP on 1 January 1983, and dial-up TIPs
gave way to TACs about then, so the H19 terminal may have dialed a TAC, whose commands the TAC user's guide will settle,
where the earlier 300 baud calls reached NBS-TIP. tiny-tip can answer as either.

## Order of work

1. The modem as a serial-port device with the AT parser and result codes, and loopback.
2. The exchange within one page: Apple to PDP-7 UNIX.
3. The directory on tiny-titan's server, and calls between tabs and computers.
4. tiny-tip with the `@` commands, and the tiny-arpa host table.
5. The telnet bridge to a SIMH ITS. Then the cabinet's own ITS.
6. The sounds.

↑ [README](README.md) · [TINY-TITAN](TINY-TITAN.md) · [TINY-ITS](TINY-ITS.md)

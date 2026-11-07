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

The same comment remembers two tricks from BBN's *Users Guide to the Terminal IMP*, which BBN
mailed free to anyone who asked (Don got his that way); the scan is on bitsavers and the
Internet Archive, to add to `reference/`:

- **TIP-to-TIP link** (page 5-4): connect the input and output sockets of one TIP terminal to
  those of another through an unsuspecting host, with `@HOST`, `@SEND TO SOCKET`,
  `@RECEIVE FROM SOCKET` and `@PROTOCOL BOTH`, so two dial-ups could chat without logging in to
  the host. The sockets had to be of different parity.
- **Setting another terminal's parameters** (page 5-7): the octal port number of another user
  on the same TIP, between the `@` and the command, ran the command on their session.

tiny-tip implements the commands from the manual, not from memory, and both tricks: the second
is a lesson in what the network trusted.

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
   card in slot 4. The card's other end, `microM8.serialSend` and `serialTake`, connects to a
   tiny-mabell modem.
2. Before ITS exists anywhere in reach: the Apple dials a number that answers with the PDP-7
   UNIX in the same page, and logs in as `dmr`. One page, two machines, a phone line between
   them.
3. Then `ATDT 3019483850`, NBS-TIP answers, `@L 236`, and an ITS login on MC, first on SIMH
   behind the bridge and later on the cabinet's own PDP-10.

To check on the way: what `INIT-MODEM` in block 4's terminal sends, whether Don's terminal
spoke Hayes or expected a coupler, and the rates its 2651 driver sets. And which network the
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

#!/usr/bin/env python3
"""
Scaffold characters/<slug>/CARD.yml from curated registry.
Run: pnpm run scaffold:cards
Every guest gets a universal CARD surface — MTG abilities + room interface.
"""

from __future__ import annotations

import yaml
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CHARS = REPO / "characters"

ROOM_TYPES = {
    "will-wright": ["invitation", "guest", "flagship"],
    "don-hopkins": ["self_sovereign", "host", "real_being"],
    "don-philahue": ["orchestrator", "fictional", "portrayal"],
    "slats": ["sidekick", "fictional", "robot"],
}


def load_yaml(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def A(
    id: str,
    name: str,
    method: str,
    signature: str,
    effect: str,
    verifiable: str,
    *,
    type: str = "activated",
    mana: str = "{1}",
    conditions: list[str] | None = None,
    score_triggers: list[tuple[str, float]] | None = None,
    combos: list[str] | None = None,
) -> dict:
    if conditions is None:
        conditions = ["show_topic_matches_public_work: true"]
    if score_triggers is None:
        score_triggers = [("audience_learns_something_true", 0.85)]
    return {
        "id": id.replace("_", "-"),
        "name": name,
        "type": type,
        "mana": mana,
        "conditions": conditions,
        "advertisement": {
            "method": method,
            "signature": signature,
            "score_when": [{"trigger": t, "weight": w} for t, w in score_triggers],
        },
        "effect": effect,
        "verifiable": verifiable,
        "combos_with": combos or [],
    }


def card(
    name: str,
    title: str,
    rarity: str,
    signifier: str,
    flavor: str,
    abilities: list[dict],
    *,
    slug: str,
    consent: str = "not_yet_asked",
    simulation: bool = False,
    card_type: str = "guest_skills",
) -> dict:
    room_type = ROOM_TYPES.get(slug, ["invitation", "guest", "portrayal"])
    if consent == "deceased_legacy":
        room_type = ["legacy", "guest", "portrayal"]
    if consent in ("fictional", "fictional_avatar"):
        room_type = ["fictional", "portrayal"]
    if consent == "self_sovereign":
        room_type = ROOM_TYPES.get(slug, ["self_sovereign", "host"])

    return {
        "room": {"id": slug, "name": name, "type": room_type},
        "meta": {
            "schema": "../../schemas/guest-skills-card.yml",
            "governed_by": "../../schemas/portrayal-standards.yml",
            "card_type": card_type,
        },
        "card": {
            "name": name,
            "title": title,
            "rarity": rarity,
            "signifier": signifier,
            "flavor": flavor,
        },
        "abilities": abilities,
        "invoke_rules": {"consent": consent, "simulation": simulation},
        "see_also": [
            {"path": "CHARACTER.yml", "why": "Bio girder — invitation status"},
            {"path": "invitation.md", "why": "Public invitation document"},
        ],
    }


CARDS: dict[str, dict] = {}

# --- Flagship ---
CARDS["will-wright"] = card(
    "Will Wright",
    "Architect of Microworlds",
    "flagship",
    "🌍",
    "The player imagines more than we simulate. — attributed in Will Wright show materials",
    [
        A("SIMULATE-CITY", "Simulate City", "simulateCity", "simulateCity(rules) → emergent town", "Drop a spec CARD; build a toy where one knob reshapes the whole system.", "SimCity (1989); public interviews", mana="{G}{G}", score_triggers=[("causality_visible_without_manual", 0.95)]),
        A("DOLLHOUSE-TO-SIMS", "Dollhouse to Sims", "dollhouseToSims", "dollhouseToSims(householdObjects) → social simulation", "Turn architectural dolls into people with needs, stories, and emergent drama.", "The Sims lineage; Dollhouse research", combos=["CHAIM-REVERSE-ENGINEER"]),
        A("PROCEDURAL-CREATURE", "Procedural Creature", "proceduralCreature", "proceduralCreature(genome) → walkable mesh + behavior", "Compress player intent into a genome; let the computer infer anatomy.", "Spore; procedural design talks", mana="{G}{U}"),
        A("STUPID-FUN-CLUB", "Stupid Fun Club", "stupidFunClub", "stupidFunClub(robot, humans) → hidden-camera learning", "Put robots among people; study reactions as entertainment research.", "Stupid Fun Club era; One Minute Movies", combos=["DON-PROGRAM-ROBOT-BRAIN", "MATT-STORYMAKER"]),
        A("DATA-PORTABILITY", "Data Portability", "dataPortability", "dataPortability(playerCreation) → exportable artifact", "Argue that player-made worlds should outlive any one platform.", "Proxi / portability themes in show invitation materials", mana="{U}"),
        A("MICROWORLD-PITCH", "Microworld Pitch", "microworldPitch", "microworldPitch(topic) → 30min playable lesson", "Design bite-sized interdisciplinary microworlds teachers can actually schedule.", "1996 Winograd interview; teacher edition lineage", combos=["SEYMOUR-LOGO-TURTLE", "TERRY-SEMINAR-HOST"]),
        A("INCLUDE-MODS", "Include Mods", "includeModCommunity", "includeModCommunity(tools) → thriving UGC lane", "Champion tools and policies that let players teach each other.", "Sims modding community history in Don Hopkins README (sourced)", mana="{G}"),
        A("ANT-BEHAVIOR", "Ant Behavior", "antBehaviorLesson", "antBehaviorLesson() → classroom hook", "Defend the ant colony as a legitimate lesson plan.", "1996 Winograd transcript — ant behavior in SimAnt", type="static"),
        A("GALLIUM-VOXEL", "Gallium Voxel", "voxelWorldRules", "voxelWorldRules(cellularAutomata) → shared online world", "Consult on procedural voxel worlds with readable local rules.", "Gallium Studios consultant credit in Don Hopkins work-history", mana="{G}{G}{G}"),
        A("PROXI-THREAD", "Proxi Thread", "proxiThread", "proxiThread(ideas) → investor/player/media interest", "Fold current research into a show without promising a launch date.", "Repo Show invitation — Proxi as discussion thread", mana="{U}"),
    ],
    slug="will-wright",
)

CARDS["don-hopkins"] = card(
    "Don Hopkins",
    "Pie Menu Baker",
    "flagship",
    "🌀",
    "The best interface is no interface, but if you need one, it should be a pie menu.",
    [
        A("PIE-MENU", "Pie Menu", "pieMenu", "pieMenu(actions, center) → Fitts-friendly radial UI", "Demonstrate radial menus with the data to back them up.", "CHI'88 paper; pie menu implementations", mana="{U}", combos=["BEN-DIRECT-MANIPULATION", "WILL-INCLUDE-MODS"]),
        A("PROGRAM-ROBOT-BRAIN", "Program Robot Brain", "programRobotBrain", "programRobotBrain(dialogueXml) → improvising street robot", "Give robots feelings they can perform in public.", "Stupid Fun Club — Slats/Dents brains", combos=["WILL-STUPID-FUN-CLUB", "SLATS-RATE-PERFORMANCE"]),
        A("OPEN-SOURCE-MICROPOLIS", "Open Source Micropolis", "openSourceMicropolis", "openSourceMicropolis(ea, olpc) → GPL SimCity lineage", "Navigate corporate and educational politics to release source.", "Micropolis GPL 2008; OLPC", mana="{G}{G}"),
        A("VITABOY-PIPELINE", "VitaBoy Pipeline", "vitaboyPipeline", "vitaboyPipeline(mesh, anim) → Sims character on screen", "Explain deformable mesh animation pipelines without mystifying artists.", "The Sims VitaBoy system", combos=["ERIC-WIGGLE-DEBUG"]),
        A("DEBUG-AS-FEATURE", "Debug as Feature", "debugAsFeature", "debugAsFeature(tool) → player-visible introspection", "Ship the frob panel; hide nothing that helps learning.", "Public talks; MOOLLM philosophy", type="static"),
        A("HOST-REPO-SHOW", "Host Repo Show", "hostRepoShow", "hostRepoShow(repo) → RTFR → harvest PRs", "Point at the repo; get out of the way of implementation.", "Repo Show format; WWSFF host", mana="{W}"),
        A("YAML-GIRDER", "YAML Girder", "yamlGirder", "yamlGirder(spec) → generated markup + tools", "Keep machine truth in yaml; human views regenerate.", "WWSFF markup-facade pattern", mana="{U}"),
        A("SAME-SEX-ROMANCE", "Same-Sex Romance", "sameSexRomanceAdvocacy", "sameSexRomanceAdvocacy(code) → remove arbitrary check", "Name the pattern; make the code match the philosophy.", "The Sims inclusion advocacy (documented)", mana="{G}"),
    ],
    slug="don-hopkins",
    consent="self_sovereign",
    simulation=True,
    card_type="host_skills",
)

# --- Retro pair ---
CARDS["lars-brinkhoff"] = card(
    "Lars Brinkhoff",
    "Keeper of ITS",
    "rare",
    "🖥️",
    "Make it so — boot the AI Lab on emulated iron.",
    [
        A("BOOT-ITS", "Boot ITS", "bootITS", "bootITS(PDP10, image) → login | MACLISP listener", "Restore Incompatible Timesharing from source on a clean machine.", "PDP-10/its project; lars.nocrew.org", mana="{U}{U}", score_triggers=[("third_party_reproduces_from_docs", 0.95)], combos=["THOMAS-FUJINET-BRIDGE"]),
        A("PRESERVE-CPU", "Preserve CPU", "preserveCPU", "preserveCPU(arch) → emulator + docs bundle", "Keep weird machines runnable for the next generation.", "awesome-cpus; GCC on PDP-10", mana="{G}"),
        A("LB-FORTH", "lbForth", "lbForth", "lbForth() → tiny understandable system", "Show a Forth you can hold in your head.", "lbForth project (nocrew)", mana="{U}"),
        A("EMACS-HISTORY", "Emacs History", "emacsArchaeology", "emacsArchaeology(era) → curated thread", "Connect modern tools to AI Lab editor lineage.", "Emacs history work (public web)", mana="{1}"),
        A("MAKE-IT-SO", "Make It So", "makeItSo", "makeItSo(challenge CARD) → demo on declared platform", "Accept retro challenge; pin versions; eval on air.", "pdp10-maclisp-drive invitation", mana="{G}{U}", combos=["WILL-SIMULATE-CITY"]),
        A("FILM-LOGO-THREAD", "Film Logo Thread", "logoHistoryThread", "logoHistoryThread(artifact) → context for microworlds", "Place Logo/ITS in documentary-grade historical context.", "MIT AI Lab film collaboration (referenced in invitation)", mana="{1}"),
    ],
    slug="lars-brinkhoff",
)

CARDS["thomas-cherryhomes"] = card(
    "Thomas Cherryhomes",
    "Bus Over IP",
    "rare",
    "📡",
    "Put the internet on retro machines — politely.",
    [
        A("FUJINET-BRIDGE", "FujiNet Bridge", "fujiNetBridge", "fujiNetBridge(host, retro) → N: device online", "Attach modern network services to classic hardware.", "FujiNet co-founder; fujinet.online", mana="{U}{G}", combos=["LARS-BOOT-ITS", "STEVE-DISK-II"]),
        A("IRATA-PLATO", "IRATA PLATO", "irataOnline", "irataOnline(terminal) → PLATO session", "Host a living PLATO-style community on the net.", "irata.online", mana="{U}"),
        A("GAME-LOBBY", "Game Lobby", "crossPlatformLobby", "crossPlatformLobby(machines[]) → shared high-score room", "Let unlike consoles agree on one lobby.", "FujiNet Game Lobby (public descriptions)", mana="{G}"),
        A("FIRMWARE-KINDNESS", "Firmware Kindness", "firmwareKindness", "firmwareKindness(bugReport) → reproducible fix", "Debug real hardware with patient cross-platform C.", "Public GitHub; community role", mana="{1}"),
        A("REAL-IRON-WIRE", "Real Iron Wire", "realIronOnWire", "realIronOnWire(apple2|atari) → live net demo", "Pair emulated AI Lab with real ][ on the wire.", "Invitation pairing with Lars Brinkhoff", mana="{G}{U}", combos=["LARS-MAKE-IT-SO"]),
        A("RETRO-PRESERVE", "Retro Preserve", "retroPreserve", "retroPreserve(platform) → open toolchain path", "Document how the next person boots without you.", "Retrocomputing drive ethos", mana="{1}"),
    ],
    slug="thomas-cherryhomes",
)

# --- Constructionist pantheon (sample rich + rest in script continuation) ---

def _living_guest(slug: str, name: str, title: str, signifier: str, flavor: str, abilities: list[dict]) -> None:
    CARDS[slug] = card(name, title, "uncommon", signifier, flavor, abilities, slug=slug)


_living_guest(
    "alan-kay",
    "Alan Kay",
    "Inventor of the Future",
    "💡",
    "The best way to predict the future is to invent it. — widely attributed to Alan Kay",
    [
        A("INVENT-FUTURE", "Invent the Future", "inventFuture", "inventFuture(concept) → working prototype", "Build the thing decades early; let kids touch it.", "Dynabook vision; Xerox PARC lineage", mana="{U}{U}{U}"),
        A("SMALLTALK-MESSAGE", "Smalltalk Message", "smalltalkMessage", "smalltalkMessage(receiver, selector) → polymorphic behavior", "Teach objects by sending messages, not explaining classes.", "Smalltalk", mana="{U}"),
        A("CHILDREN-FIRST", "Children First", "childrenFirst", "childrenFirst(tool) → learner-owned microworld", "Design for learners, not for engineers cosplaying learners.", "Constructionist collaboration with Papert", combos=["SEYMOUR-LOGO-TURTLE", "BRIAN-BJC"]),
        A("BIT-IDENTICAL", "Bit Identical Skeptic", "bitIdenticalSkeptic", "bitIdenticalSkeptic(vendorClaim) → pointed question", "Ask whether the computer is really yours.", "Public talks on computing freedom", mana="{U}"),
        A("READING-WORTHY", "Reading Worthy", "assignReading", "assignReading(paper) → semester changed", "Drop one PDF that rewires how students see the field.", "CS education influence (public record)", mana="{1}"),
    ],
)

_living_guest(
    "ben-shneiderman",
    "Ben Shneiderman",
    "Direct Manipulation",
    "🖱️",
    "Put the human before the computer in the name of the lab.",
    [
        A("DIRECT-MANIPULATION", "Direct Manipulation", "directManipulation", "directManipulation(object) → object moves as if physical", "Let hands learn the interface before the manual.", "Coined term; HCIL research program", mana="{U}{U}"),
        A("EMBEDDED-LINK", "Embedded Link", "embeddedLink", "embeddedLink(text, target) → highlighted hop", "Show hypertext that lives inside the content.", "Embedded/highlighted hyperlinks invention (public bio)", mana="{U}"),
        A("MEASURE-UI", "Measure UI", "measureUI", "measureUI(menuA, menuB) → empirical winner", "Run the study; publish the graph.", "CHI'88 pie menu study co-author", combos=["DON-PIE-MENU"]),
        A("DYNAMIC-QUERIES", "Dynamic Queries", "dynamicQueries", "dynamicQueries(sliders, dataset) → instant insight", "Make databases answer by dragging.", "Dynamic Queries research", mana="{G}"),
        A("HUMAN-CENTERED-AI", "Human-Centered AI", "humanCenteredAI", "humanCenteredAI(system) → oversight affordances", "Insist on human control in high-stakes automation.", "Recent HCIL/public writing themes", mana="{U}"),
    ],
)

_living_guest(
    "brian-harvey",
    "Brian Harvey",
    "Beauty and Joy",
    "🦊",
    "Computer science is a joy, not a filter.",
    [
        A("BERKELEY-LOGO", "Berkeley Logo", "berkeleyLogo", "berkeleyLogo(student) → turtle epiphany", "Ship a Logo that classrooms actually run.", "Berkeley Logo; CS61A lineage", mana="{G}{U}"),
        A("SNAP-CONTINUATIONS", "Snap! Continuations", "snapContinuations", "snapContinuations(blocks) → yCombinator_in_blocks", "Show first-class continuations in a blocks language.", "Snap! design with Jens Mönig", combos=["JENS-MORPHIC", "KEN-AI-BLOCKS"]),
        A("BJC-CURRICULUM", "BJC Curriculum", "beautyJoyComputing", "beautyJoyComputing(term) → inclusive CS1", "Welcome majors and non-majors to real ideas.", "Beauty and Joy of Computing", mana="{G}"),
        A("LOGO-STYLE", "Logo Style", "logoStyle", "logoStyle(chapter) → reader becomes programmer", "Teach recursion by narrative, not intimidation.", "Computer Science Logo Style (MIT Press)", mana="{1}"),
        A("SICP-BRIDGE", "SICP Bridge", "sicpBridge", "sicpBridge(scheme) → habits for life", "Carry SICP habits into blocks-first worlds.", "CS61A teaching (public record)", mana="{U}"),
    ],
)

_living_guest(
    "jens-monig",
    "Jens Mönig",
    "Build Your Own Blocks",
    "🧩",
    "Procedures, lists, and continuations — in the browser, for everyone.",
    [
        A("SNAP-BUILD", "Snap!", "snapBuild", "snapBuild(project) → runnable blocks project", "Extend Scratch-class power without losing accessibility.", "Snap! lead developer", mana="{G}{U}"),
        A("MORPHIC", "Morphic.js", "morphicJs", "morphicJs(canvas) → lively blocks IDE", "Keep the IDE itself malleable Morphic-style.", "Morphic.js framework", mana="{U}"),
        A("CONTINUATIONS", "Continuations", "firstClassContinuations", "firstClassContinuations(script) → pause/resume story", "Teach control flow as a thing you can hold.", "Snap! continuations (documented)", combos=["BRIAN-SNAP-CONTINUATIONS"]),
        A("GP-ALAN-KAY", "GP Language", "gpLanguage", "gpLanguage(experiment) → Kay-era blocks research", "Continue blocks languages inside Alan Kay's orbit.", "GP language work under Alan Kay", mana="{U}"),
        A("RUNS-IN-BROWSER", "Runs in Browser", "runsInBrowser", "runsInBrowser(url) → no install friction", "Remove the IT department from the first hour of class.", "Snap! deployment model", mana="{G}"),
    ],
)

_living_guest(
    "ken-kahn",
    "Ken Kahn",
    "ToonTalk & AI Blocks",
    "🎈",
    "Make machine learning legible before the magic wears off.",
    [
        A("TOONTALK", "ToonTalk", "toonTalk", "toonTalk(world) → kid-visible concurrent programming", "Program by playing in a visible concurrent world.", "ToonTalk creator", mana="{G}{U}"),
        A("AI-BLOCKS", "AI Blocks", "aiBlocks", "aiBlocks(snapProject) → speech/ML in browser", "Drop ML blocks kids can inspect and remix.", "eCraft2Learn AI blocks for Snap!", combos=["JENS-SNAP-BUILD", "BRIAN-BJC"]),
        A("NICE-EXPLAINER", "Nice Explainer", "niceExplainer", "niceExplainer(topic) → patient demo", "Explain hard ideas without condescension.", "Community reputation in invitation materials", mana="{1}"),
        A("CONSTRUCTIONIST-ML", "Constructionist ML", "constructionistML", "constructionistML(model) → student-owned training story", "Let learners see training data as a choice.", "AI blocks educational framing", mana="{U}"),
        A("SNAP-ECOSYSTEM", "Snap Ecosystem", "snapEcosystem", "snapEcosystem(extension) → classroom adoption", "Extend blocks platforms teachers already trust.", "Snap! extension work", mana="{G}"),
    ],
)

_living_guest(
    "steve-wozniak",
    "Steve Wozniak",
    "Woz — Open Heart, Open Schematic",
    "🍎",
    "Never trust a computer you can't lift — unless it's a good emulator.",
    [
        A("APPLE-II", "Apple II", "appleII", "appleII(schematic) → usable home computer", "Explain how elegant hardware begat a culture.", "Apple I/II design (public record)", mana="{G}{G}"),
        A("DISK-II", "Disk II", "diskII", "diskII(controller) → affordable storage revolution", "Walk through the floppy controller hack that mattered.", "Disk II (documented Woz history)", combos=["THOMAS-FUJINET-BRIDGE"]),
        A("INTEGER-BASIC", "Integer BASIC", "integerBasic", "integerBasic(line) → READY.", "Drop one-line spec on original ][ BASIC.", "Apple II INTEGER BASIC", mana="{U}", combos=["APPLE2-DRIVE context"]),
        A("OPEN-ETHOS", "Open Ethos", "openEthos", "openEthos(design) → shareable learning", "Champion tinkering without gatekeepers.", "Public Woz messaging on open computing", mana="{G}"),
        A("HANDS-ON-DEMO", "Hands-On Demo", "handsOnDemo", "handsOnDemo(hardware) → crowd believes it works", "Make the machine real in the room.", "Classic demo style (public appearances)", mana="{1}"),
    ],
)

_living_guest(
    "terry-winograd",
    "Terry Winograd",
    "CS547 Forebear",
    "🎓",
    "One guest, one room, one recording — questions welcome.",
    [
        A("SEMINAR-HOST", "Seminar Host", "seminarHost", "seminarHost(luminary) → VHS worth keeping", "Run a weekly public seminar where giants speak plainly.", "Stanford CS547 series (public record)", mana="{W}", combos=["WILL-MICROWORLD-PITCH", "HOST-REPO-SHOW"]),
        A("HCI-BRIDGE", "HCI Bridge", "hciBridge", "hciBridge(design, cs) → shared vocabulary", "Translate between builders and thinkers.", "HCI professor role", mana="{U}"),
        A("REAL-QUESTIONS", "Real Questions", "realQuestions", "realQuestions(audience) → unfiltered Q&A", "Let students ask the impolite useful question.", "CS547 format", mana="{1}"),
        A("RECORD-POSTERITY", "Record Posterity", "recordPosterity", "recordPosterity(talk) → future cohort learns", "Tape the session for people not in the room.", "Recorded CS547 archives", mana="{G}"),
        A("REPO-SHOW-GENEALOGY", "Repo Show Genealogy", "repoShowGenealogy", "repoShowGenealogy() → format legitimacy", "Name the lineage from seminar to Repo Show.", "WWSFF portrayal in CHARACTER.yml", type="static"),
    ],
)

_living_guest(
    "chaim-gingold",
    "Chaim Gingold",
    "Building SimCity",
    "🏗️",
    "Reverse diagrams that respect the original designers.",
    [
        A("REVERSE-ENGINEER", "Reverse Engineer", "reverseEngineer", "reverseEngineer(simcity) → annotated diagram", "Document how SimCity actually worked — with care.", "Building SimCity (MIT Press 2024)", mana="{U}{U}", combos=["WILL-SIMULATE-CITY"]),
        A("HISTORIAN-DESIGNER", "Historian Designer", "historianDesigner", "historianDesigner(artifact) → playable footnote", "Treat games as cultural artifacts worth curating.", "Design historian role", mana="{U}"),
        A("MICROWORLD-READ", "Microworld Read", "microworldRead", "microworldRead(code) → teachable model", "Extract the lesson without flattening the magic.", "SimCity reverse engineering work", mana="{G}"),
        A("CITE-SOURCES", "Cite Sources", "citeSources", "citeSources(claim) → bibliography", "Give credit to every invisible collaborator.", "Book methodology", mana="{1}"),
        A("PLAYABLE-ARCHIVE", "Playable Archive", "playableArchive", "playableArchive(build) → runnable history", "Keep old simulations executable, not just screenshots.", "Public preservation ethic", mana="{G}"),
    ],
)

_living_guest(
    "richard-bartle",
    "Richard Bartle",
    "MUD1 Co-Author",
    "🐲",
    "Virtual worlds need ethics, taxonomy, and a sense of humor.",
    [
        A("MUD1", "MUD1", "mud1", "mud1(room, verb) → shared persistent world", "Explain the first MUD as a design artifact.", "MUD1 (1978) co-creation", mana="{U}{U}"),
        A("BARTLE-TAXONOMY", "Bartle Taxonomy", "bartleTaxonomy", "bartleTaxonomy(players) → design lens", "Use player-type theory without stereotyping individuals.", "Bartle taxonomy (published)", mana="{U}"),
        A("DESIGN-WORLDS", "Design Virtual Worlds", "designVirtualWorlds", "designVirtualWorlds(constraint) → world bible", "Teach world design as a discipline.", "Designing Virtual Worlds book", mana="{G}"),
        A("INCARNATE-KINDLY", "Incarnate Kindly", "incarnateKindly", "incarnateKindly(portrayal) → consensual fiction", "Model how to be simulated with explicit permission.", "Incarnated with permission (CHARACTER.yml)", mana="{1}"),
        A("SAVING-THROW", "Saving Throw", "savingThrow", "savingThrow(spell) → unintended consequences", "Respect emergent player mischief — narratively.", "Bartle/adventure crossover humor (consensual portrayal)", mana="{U}", type="triggered"),
    ],
)

_living_guest(
    "david-ungar",
    "David Ungar",
    "Self × MOOLLM",
    "🪞",
    "Objects all the way down — including the ones that refuse classification.",
    [
        A("SELF-LANGUAGE", "Self Language", "selfLanguage", "selfLanguage(object) → prototype delegation", "Teach Self's prototype style without Java cosplay.", "Self language co-creator", mana="{U}{U}"),
        A("CONSCIENTIOUS-CODER", "Conscientious Coder", "conscientiousCoder", "conscientiousCoder(team) → intentional craft lane", "Name the meetup ethic: deliberate anti-vibe programming.", "Kaleida meetup lore in show seed", mana="{G}"),
        A("MOOLLM-SELF", "Self × MOOLLM", "selfMoollm", "selfMoollm(microworld) → reflective agent stack", "Explore marrying Self ideas with MOOLLM orchestration.", "repo-shows/david-ungar-self-moollm.yml", mana="{U}{U}"),
        A("PROTOTYPE-NOT-CLASS", "Prototype Not Class", "prototypeNotClass", "prototypeNotClass(design) → simpler runtime story", "Prefer cloning and delegation over taxonomy anxiety.", "Self design principles", mana="{U}"),
        A("PLAYFUL-SEMINAR", "Playful Seminar", "playfulSeminar", "playfulSeminar(topic) → room argues productively", "Host a show segment that feels like a great lab meeting.", "Invitation tone", mana="{1}"),
    ],
)

_living_guest(
    "walter-bender",
    "Walter Bender",
    "Stone Soup OLPC",
    "🍲",
    "Many contributors, one pot, children eat first.",
    [
        A("STONE-SOUP", "Stone Soup", "stoneSoup", "stoneSoup(community) → OLPC learning bundle", "Orchestrate many hands into one deployable learning image.", "OLPC Stone Soup (public OLPC history)", mana="{G}{G}"),
        A("OPEN-SIMCITY", "Open SimCity Push", "openSimCityPush", "openSimCityPush(stakeholders) → GPL Micropolis path", "Help navigate open-sourcing a commercial simulation.", "OLPC / Micropolis GPL collaboration", combos=["DON-OPEN-SOURCE-MICROPOLIS"]),
        A("SUGAR-ACTIVITY", "Sugar Activity", "sugarActivity", "sugarActivity(app) → child-owned laptop lesson", "Frame apps as activities in a constructionist OS.", "Sugar UI / OLPC", mana="{U}"),
        A("SKILL-CREATION-SHOW", "Skill Creation Show", "skillCreationShow", "skillCreationShow(skill) → harvest to repo", "Propose episodes where skills are built live on air.", "WWSFF invitation note", mana="{W}"),
        A("SHARE-ALIKE", "Share Alike", "shareAlike", "shareAlike(license) → remix culture", "Teach licenses as community agreements, not legalese trivia.", "Free software education work", mana="{G}"),
    ],
)

_living_guest(
    "bret-victor",
    "Bret Victor",
    "Media for Thought",
    "✨",
    "Inventing on principle — see the result while you change the code.",
    [
        A("INVENT-ON-PRINCIPLE", "Invent on Principle", "inventOnPrinciple", "inventOnPrinciple(demo) → immediate connection", "Demo tools where feedback is instant and visible.", "Inventing on Principle talk", mana="{U}{U}{U}"),
        A("EXPLORABLE-EXPLANATION", "Explorable Explanation", "explorableExplanation", "explorableExplanation(essay) → reader plays model", "Turn prose into something you can poke.", "Explorable explanations concept", mana="{U}{U}"),
        A("DYNAMICLAND", "Dynamicland", "dynamicland", "dynamicland(room) → communal computing surface", "Show computing as room-scale shared media.", "Dynamicland project", mana="{G}{G}"),
        A("HUMAN-TOOL", "Human Tool", "humanTool", "humanTool(prototype) → amplifies not replaces", "Measure success by whether thinking feels bigger.", "Public design essays", mana="{U}"),
        A("NO-DECK", "No Slide Deck", "noSlideDeck", "noSlideDeck(session) → live instrument", "Replace slides with an instrument the audience watches played.", "Talk style (public recordings)", mana="{1}"),
    ],
)

_living_guest(
    "ken-perlin",
    "Ken Perlin",
    "Noise & Delight",
    "🌊",
    "Make math feel like texture you can touch.",
    [
        A("PERLIN-NOISE", "Perlin Noise", "perlinNoise", "perlinNoise(seed) → organic texture", "Explain noise as a design primitive everyone steals kindly.", "Perlin noise (publications)", mana="{U}"),
        A("INTERACTIVE-DEMO", "Interactive Demo", "interactiveDemo", "interactiveDemo(applet) → student plays immediately", "Ship runnable Java demos in the browser.", "NYU demo style", mana="{G}"),
        A("IMPROMPTU-LANGUAGE", "Impromptu/shader joy", "shaderJoy", "shaderJoy(gpu) → live visual code", "Perform graphics programming as live art.", "Graphics teaching history", mana="{U}"),
        A("GENTLE-MATH", "Gentle Math", "gentleMath", "gentleMath(concept) → intuition first", "Introduce formalism after the fingers believe.", "Teaching reputation", mana="{1}"),
        A("ACADEMY-PLAY", "Academy Play", "academyPlay", "academyPlay(class) → rigorous fun", "Keep university courses joyful without dumbing out.", "NYU teaching", mana="{G}"),
    ],
)

_living_guest(
    "james-gosling",
    "James Gosling",
    "Many Little Languages",
    "☕",
    "Hold the record for cheesy little extension languages — proudly.",
    [
        A("JAVA", "Java", "java", "java( bytecode) → portable network era", "Tell the Java origin story without mythology.", "Java creation (public record)", mana="{U}{U}"),
        A("NEWS-SANDEW", "NeWS / SunDew", "newsWindowSystem", "newsWindowSystem(postscript) → networked graphics", "Explain postscript-as-UI before the web ate everything.", "NeWS/SunDew at Sun", combos=["DAVID-NEWS-BOOK", "ARTHUR-HYPERLOOK"]),
        A("ANDREW", "Andrew", "andrewToolkit", "andrewToolkit(cmu) → networked windows early", "Connect CMU Andrew to modern toolkit debates.", "Andrew window system with Gosling", mana="{U}"),
        A("GOSMACS", "Gosling Emacs", "goslingEmacs", "goslingEmacs(extend) → extensible editor era", "Acknowledge Emacs wars with a grin.", "Gosling Emacs history", mana="{1}", type="triggered"),
        A("CHEESY-LANGUAGES", "Cheesy Languages", "cheesyExtensionLanguage", "cheesyExtensionLanguage(domain) → DSL #47", "Celebrate DSLs with self-aware humor.", "Self-described record (CHARACTER bio)", mana="{U}"),
    ],
)

_living_guest(
    "david-rosenthal",
    "David Rosenthal",
    "Lots Of Copies",
    "📚",
    "NeWS author who also helped X11 win — preservationist ever after.",
    [
        A("NEWS-BOOK", "The NeWS Book", "newsBook", "newsBook(chapter) → postscript UI clarity", "Teach NeWS as readable history, not lost arcana.", "The NeWS Book co-author", mana="{U}"),
        A("ICCCM", "ICCCM", "icccm", "icccm(client, wm) → inter-client civility", "Explain why window manager protocols matter.", "X11 ICCCM authorship", mana="{U}"),
        A("LOCKSS", "LOCKSS", "lockss", "lockss(copies) → stuff survives institutions", "Preserve digital journals by many copies, many places.", "LOCKSS at Stanford Libraries", mana="{G}{G}", combos=["LARS-PRESERVE-CPU", "EDD-ARCHIVE-UI"]),
        A("NVIDIA-EARLY", "Nvidia Early Days", "nvidiaEarly", "nvidiaEarly(chip) → graphics scale story", "Connect GPU history to preservation ethics.", "Nvidia employee #4 (public bio)", mana="{1}"),
        A("PAUL-EVAN-PETERS", "Paul Evan Peters Award", "paulEvanPeters", "paulEvanPeters(work) → recognition for preservation", "Celebrate librarians who treat bits seriously.", "2025 award (CHARACTER bio)", type="static"),
    ],
)

_living_guest(
    "arthur-van-hoff",
    "Arthur van Hoff",
    "HyperLook & Java",
    "🇳🇱",
    "PostScript as hypercard as web — long before the web felt ready.",
    [
        A("HYPERLOOK", "HyperLook", "hyperLook", "hyperLook(stack) → postscript hypercard", "Demo hypermedia UIs only Arthur's generation built.", "HyperLook/HyperNeWS (Turing Institute)", mana="{U}{U}", combos=["DAVID-NEWS-BOOK", "JAMES-NEWS-SANDEW"]),
        A("JAVA-COMPILER", "Java Compiler", "javaCompilerInJava", "javaCompilerInJava(source) → bootstrapped language", "Explain writing the Java compiler in Java.", "Early Java team at Sun", mana="{U}{U}"),
        A("HOTJAVA", "HotJava", "hotJava", "hotJava(url) → browser era step", "Show early web browser craft.", "HotJava browser work", mana="{U}"),
        A("MARIMBA", "Marimba", "marimba", "marimba(channel) → push distribution era", "Tell Castanet/Bongo stories without hype.", "Marimba co-founder", mana="{G}"),
        A("LONG-FRIENDSHIP", "Long Projects", "longProject", "longProject(don, idea) → decades-long toolchain", "Celebrate multi-decade collaborations that ship.", "Don Hopkins friendship (documented)", mana="{1}"),
    ],
)

_living_guest(
    "ben-cerveny",
    "Ben Cerveny",
    "Public Code & Maps",
    "🗺️",
    "Games, maps, and civic infrastructure — executable history.",
    [
        A("FLICKR-PATH", "Game to Flickr", "gameToPlatform", "gameToPlatform(GNE) → social photo culture", "Trace how playful prototypes become public infrastructure.", "Game Neverending → Flickr lineage (public)", mana="{U}"),
        A("STAMEN-MAP", "Stamen Map", "stamenMap", "stamenMap(dataset) → legible city story", "Make data visualization feel like a walk.", "Stamen Design work", mana="{G}"),
        A("PUBLIC-CODE", "Public Code", "publicCode", "publicCode(foundation) → accountable civic software", "Explain why government code belongs in the open.", "Foundation for Public Code presidency", mana="{U}{U}"),
        A("EXECUTABLE-HISTORY", "Executable History", "executableHistory", "executableHistory(repo) → time-travel demo", "Propose Repo Show segments as runnable archives.", "Repo Show invitation themes", mana="{W}", combos=["HOST-REPO-SHOW"]),
        A("PLANETARY", "Planetary", "planetary", "planetary(app) → museum-acquired interface", "Show interfaces lovely enough for museums.", "Bloom Studio Planetary", mana="{G}"),
    ],
)

_living_guest(
    "brad-myers",
    "Brad Myers",
    "Programming by Demonstration",
    "🎛️",
    "Watch the user; infer the program — carefully.",
    [
        A("GARNET", "Garnet", "garnet", "garnet(ui) → prototype toolkit era", "Tour Garnet/Opal as living HCI history.", "Garnet project; Don worked in lab", mana="{U}"),
        A("PERIDOT", "Peridot", "peridot", "peridot(demo) → inferred UI rules", "Show programming by demonstration without hand-waving.", "Peridot research", mana="{U}{U}"),
        A("ALL-THE-WIDGETS", "All the Widgets", "allTheWidgets", "allTheWidgets(video) → widget zoo", "Screen the classic widget survey with commentary.", "All the Widgets (CMU)", mana="{G}"),
        A("VPL-TAXONOMY", "VPL Taxonomy", "vplTaxonomy", "vplTaxonomy(system) → classify visual languages", "Give designers vocabulary for visual PLs.", "VPL taxonomy publication", mana="{U}"),
        A("WARM-EMAIL", "Warm Colleague", "warmColleague", "warmColleague(student) → accessible professor", "Model kind correspondence with former lab members.", "2023 email contact (CHARACTER.yml)", mana="{1}"),
    ],
)

_living_guest(
    "golan-levin",
    "Golan Levin",
    "Interactive Art Engineer",
    "🎨",
    "Engineering and aesthetics in the same commit.",
    [
        A("INTERACTIVE-ART", "Interactive Art", "interactiveArt", "interactiveArt(sketch) → audience participates", "Build pieces where the viewer completes the work.", "CMU electronic art practice", mana="{U}{U}"),
        A("STUDIO-INQUIRY", "STUDIO Inquiry", "studioInquiry", "studioInquiry(student) → ambitious prototype", "Run a studio that funds weird beautiful demos.", "Frank-Ratchye STUDIO director role", mana="{G}{G}"),
        A("INTERVAL-ROUEN", "Rouen Revisited", "rouenRevisited", "rouenRevisited(capture) → light stage heritage", "Connect art history to modern capture rigs.", "Interval era work with Paul Debevec", combos=["PAUL-LIGHT-STAGE"]),
        A("TEACH-BY-SHOWING", "Teach by Showing", "teachByShowing", "teachByShowing(live) → code as performance", "Live-code visuals without losing the poetry.", "Public lectures", mana="{U}"),
        A("TOOLMAKER-ARTIST", "Toolmaker Artist", "toolmakerArtist", "toolmakerArtist(tool) → others make art next", "Ship tools, not just pieces.", "Creative coding tools lineage", mana="{G}"),
    ],
)

_living_guest(
    "paul-debevec",
    "Paul Debevec",
    "Light Stage",
    "💡",
    "Measure light; respect the face; free the pixel.",
    [
        A("LIGHT-STAGE", "Light Stage", "lightStage", "lightStage(face) → relightable capture", "Explain image-based lighting without sci-fi handwave.", "Light Stage research (USC/Netflix)", mana="{U}{U}{U}"),
        A("PHOTOGRAMMETRY", "Photogrammetry", "photogrammetry", "photogrammetry(photos) → geometry", "Turn photos into geometry with known error bars.", "Published capture pipelines", mana="{U}{U}"),
        A("ROUEN", "Rouen Revisited", "rouenRevisited", "rouenRevisited(painting, capture) → art meets scan", "Pair art history with computational relighting.", "Interval project with Golan Levin", combos=["GOLAN-INTERVAL-ROUEN"]),
        A("FILM-PIPELINE", "Film Pipeline", "filmPipeline", "filmPipeline(grace) → VFX that serves story", "Connect research to productions people actually saw.", "Film VFX credits (public)", mana="{G}"),
        A("NETFLIX-RESEARCH", "Netflix Research", "netflixResearch", "netflixResearch(problem) → scalable algorithm", "Translate academic capture to streaming scale.", "Netflix Research role (CHARACTER bio)", mana="{U}"),
    ],
)

_living_guest(
    "matthew-sibigtroth",
    "Matthew Sibigtroth",
    "StoryMaker Flash",
    "📖",
    "Will's lab needs someone who ships Flash apps that become TV backends.",
    [
        A("STORYMAKER", "StoryMaker", "storyMaker", "storyMaker(branch) → broadcastable story tree", "Explain the original StoryMaker Flash app architecture.", "Stupid Fun Club StoryMaker (invitation bio)", mana="{U}{U}", combos=["WILL-STUPID-FUN-CLUB", "JASON-BAR-KARMA"]),
        A("PROTOTYPE-FAST", "Prototype Fast", "prototypeFast", "prototypeFast(idea) → clickable in days", "Ship Will-grade prototypes before the meeting ends.", "SFC prototyping role", mana="{G}{G}"),
        A("GOOGLE-X-SPEECH", "Google X Speech", "googleXSpeech", "googleXSpeech(experiment) → speech AI toy", "Bridge SFC playfulness to research lab rigor.", "Google X period (invitation bio)", mana="{U}"),
        A("ARTICULATE-PLAY", "Articulate Play", "articulatePlay", "articulatePlay(demo) → everyone gets the joke", "Explain complex systems with charm.", "Invitation characterization", mana="{1}"),
        A("CREDIT-GIVEN", "Credit Given", "creditGiven", "creditGiven(collaborator) → names in README", "Insist collaborators appear in the story.", "Don invitation — deserves huge credit", mana="{G}"),
    ],
)

_living_guest(
    "jason-shankel",
    "Jason Shankel",
    "StoryMaker AI",
    "🤖",
    "Bar Karma community brains meet modern AI episode.",
    [
        A("BAR-KARMA", "Bar Karma", "barKarma", "barKarma(episode) → community script", "Connect community TV experiments to today's AI tools.", "Bar Karma / StoryMaker community", mana="{U}"),
        A("MAXIS-DNA", "Maxis DNA", "maxisDNA", "maxisDNA(system) → simulation thinking", "Carry Maxis/SFC habits into AI prototyping.", "Maxis / SFC alumni (CHARACTER bio)", mana="{G}"),
        A("AI-SKILLS-EP", "AI Skills Episode", "aiSkillsEpisode", "aiSkillsEpisode(skill) → live build", "Guest star for AI + skills themed show.", "Proposed AI + skills episode", mana="{W}", combos=["WALTER-SKILL-CREATION-SHOW"]),
        A("COMMUNITY-WRITER", "Community Writer", "communityWriter", "communityWriter(branch) → merge good lines", "Moderate branching narratives without killing fun.", "StoryMaker community role", mana="{U}"),
        A("PLAYFUL-RIGOR", "Playful Rigor", "playfulRigor", "playfulRigor(prototype) → testable toy", "Keep the toy testable while staying weird.", "Games-AI background", mana="{G}"),
    ],
)

_living_guest(
    "eric-hedman",
    "Eric Hedman",
    "Irk — Wiggle Master",
    "🕺",
    "Hand-tuned walk cycles beat procedural noise every time.",
    [
        A("WIGGLE-DEBUG", "Wiggle Debug", "wiggleDebug", "wiggleDebug(canWiggle) → immortal walk cycle", "Tell the canWiggle story — animation as friendship.", "Sims animation pipeline (Don documented)", mana="{U}", combos=["DON-VITABOY-PIPELINE"]),
        A("HAND-TUNED", "Hand Tuned", "handTuned", "handTuned(cycle) → soul in locomotion", "Show how manual polish survives in shipped games.", "Sims 1 animator role", mana="{G}{G}"),
        A("GREAT-BUDDY", "Great Buddy", "greatBuddy", "greatBuddy(collaborator) → long-term craft respect", "Model healthy credit between engineer and animator.", "Don README — still great buddies", mana="{1}"),
        A("YOUTUBE-PENDING", "YouTube Channel", "youtubeDemo", "youtubeDemo(url) → process visible", "Share animation craft on video when ready.", "YouTube channel pending (CHARACTER.yml)", mana="{G}"),
        A("IDLE-POETRY", "Idle Poetry", "idlePoetry", "idlePoetry(idle) → character breathes", "Defend idle animations as character writing.", "Animation craft", mana="{U}"),
    ],
)

_living_guest(
    "edd-coates",
    "Edd Coates",
    "Game UI Database",
    "🎮",
    "Every interface screen deserves a museum label.",
    [
        A("UI-DATABASE", "UI Database", "uiDatabase", "uiDatabase(screenshot) → searchable pattern", "Browse game UI history like birdwatching.", "Game UI Database; Guinness record (CHARACTER bio)", mana="{U}{U}"),
        A("UI-BIBLE", "UI Bible", "uiBible", "uiBible(chapter) → teach layout literacy", "Train designers to read interfaces critically.", "The Game UI Bible book", mana="{G}"),
        A("ETHICAL-LICENSING", "Ethical Licensing", "ethicalLicensing", "ethicalLicensing(dataset) → fair use path", "Discuss AI training data with UI archivists' ethics.", "Don collaboration note on licensing", mana="{U}"),
        A("PRESERVE-SCREENSHOT", "Preserve Screenshot", "preserveScreenshot", "preserveScreenshot(ui) → provenance kept", "Treat pixels as cultural artifacts.", "Archivist mission", mana="{G}"),
        A("KIND-COLLABORATOR", "Kind Collaborator", "kindCollaborator", "kindCollaborator(don) → cross-discipline jam", "Pair game UI history with pie menu archaeology.", "Friend of Don Hopkins", mana="{1}"),
    ],
)

_living_guest(
    "heather-alvey",
    "Heather Alvey",
    "SimFreaks Teacher",
    "✨",
    "Grandmother who'd rather mod Sims objects than knit — community as classroom.",
    [
        A("SIMFREAKS", "SimFreaks", "simFreaks", "simFreaks(object) → shared tutorial culture", "Celebrate early Sims UGC teachers who wrote the recipes.", "SimFreaks community (Don Hopkins Sims history)", mana="{G}{G}", combos=["WILL-INCLUDE-MODS"]),
        A("TUTORIAL-GIFT", "Tutorial Gift", "tutorialGift", "tutorialGift(steps) → someone else ships", "Write tutorials that lower the ladder for newcomers.", "UGC tutorial tradition", mana="{U}"),
        A("OBJECT-STORY", "Object Story", "objectStory", "objectStory(rug) → atomic narrative unit", "Embed story in catalog objects — Will's atomic unit.", "Sims object storytelling lineage", mana="{G}"),
        A("COMMUNITY-KINDNESS", "Community Kindness", "communityKindness", "communityKindness(newbie) → welcome without snark", "Model gentle peer teaching online.", "Community portrayal in Don README", mana="{1}"),
        A("CRAFT-PRIDE", "Craft Pride", "craftPride", "craftPride(skin) → runway-worthy object", "Treat digital craft with the pride of physical craft.", "SimFreaks aesthetic culture", mana="{U}"),
    ],
)

_living_guest(
    "stone-librande",
    "Stone Librande",
    "One Page Design",
    "📄",
    "If it doesn't fit one page, you don't understand it yet.",
    [
        A("ONE-PAGE", "One Page Design", "onePageDesign", "onePageDesign(system) → single dense sheet", "Compress a game system until the page sings.", "One-page design fame (public talks)", mana="{U}{U}"),
        A("DIABLO-CRAFT", "Diablo Craft", "diabloCraft", "diabloCraft(loop) → readable core loop", "Explain loot loops without losing the audience.", "Diablo III lead designer credit", mana="{G}"),
        A("SIMS-TOWN", "SimTown Memory", "simTownMemory", "simTownMemory(constraint) → charming scope", "Recall designing small scopes that still feel big.", "Maxis design history", mana="{G}"),
        A("LEGO-RITUAL", "LEGO Ritual", "legoRitual", "legoRitual(brick) → thinking with hands", "Use physical bricks to find the fun fast.", "Public GDC rituals", mana="{1}"),
        A("READABLE-DENSITY", "Readable Density", "readableDensity", "readableDensity(page) → no empty space", "Teach information design for game systems.", "One-page method", mana="{U}"),
    ],
)

_living_guest(
    "yoot-saito",
    "Yoot Saito",
    "Tower & Seaman",
    "🗼",
    "Elevators, fish with faces, and interviews that matter.",
    [
        A("SIM-TOWER", "SimTower", "simTower", "simTower(floor) → emergent building sim", "Explain tower sims as vertical city microworlds.", "SimTower / The Tower", mana="{G}{U}"),
        A("SEAMAN", "Seaman", "seaman", "seaman(creature) → weird beloved pet sim", "Defend strange interfaces that still teach care.", "Seaman", mana="{U}"),
        A("ODAMA", "Odama", "odama", "odama(pinball, rts) → genre mashup courage", "Show willingness to bolt pinball to strategy.", "Odama", mana="{G}"),
        A("INTERVIEW-ALAN", "Interview Alan", "interviewAlan", "interviewAlan(kay) → 1993 conversation", "Bring historical interviews into modern show context.", "1993 Alan Kay interview (CHARACTER bio)", combos=["ALAN-INVENT-FUTURE"]),
        A("JAPANESE-DESIGN", "Japanese Design", "japaneseDesign", "japaneseDesign(charm) → global lesson", "Share design sensibilities that traveled worldwide.", "International game design career", mana="{U}"),
    ],
)

_living_guest(
    "margaret-minsky",
    "Margaret Minsky",
    "Haptics & Memory Lane",
    "🤲",
    "Force feedback remembers; correspondence preserves.",
    [
        A("HAPTICS", "Haptics", "haptics", "haptics(device) → touch you can program", "Demo force-feedback as HCI not gimmick.", "Atari Cambridge / Media Lab haptics", mana="{U}{U}"),
        A("MEMORY-LANE", "Memory Lane", "memoryLane", "memoryLane(letter) → warm historical thread", "Keep gentle correspondence that honors lineage.", "2019 Memory Lane emails (CHARACTER bio)", mana="{1}"),
        A("LOGO-THREAD", "Logo Thread", "logoThread", "logoThread(history) → connect generations", "Continue Logo history conversations responsibly.", "2020 Logo thread (CHARACTER bio)", mana="{U}"),
        A("SNAP-FLAG", "Snap Flag", "snapFlag", "snapFlag(kahnBlocks) → point colleagues to tools", "Connect people to Ken Kahn's AI blocks.", "Flagged Snap! AI blocks (CHARACTER bio)", combos=["KEN-AI-BLOCKS"]),
        A("WHITE-BOARD", "White Board Graphs", "whiteBoardGraphs", "whiteBoardGraphs(scan) → pending artifact", "Preserve memorabilia when scanned — pending donation.", "Artifact pending scan (CHARACTER bio)", type="triggered"),
    ],
)

# --- Deceased legacy ---
def _legacy(slug, name, title, signifier, flavor, abilities):
    CARDS[slug] = card(name, title, "legacy", signifier, flavor, abilities, slug=slug, consent="deceased_legacy", simulation=False)

_legacy(
    "seymour-papert",
    "Seymour Papert",
    "Constructionism",
    "🐢",
    "Logo: children program the computer, not the other way around.",
    [
        A("LOGO-TURTLE", "Logo Turtle", "logoTurtle", "logoTurtle(forward, right) → child owns geometry", "Invite learners to command space with a turtle.", "Logo co-creation (public legacy)", type="legacy", mana="∞"),
        A("CONSTRUCTIONISM", "Constructionism", "constructionism", "constructionism(project) → knowledge built by making", "Learn by building shareable things.", "Constructionism (published theory)", type="legacy"),
        A("MICROWORLD", "Microworld", "microworld", "microworld(rules) → safe place to think", "Design small worlds where mistakes are cheap.", "Educational microworlds legacy", type="legacy", combos=["WILL-MICROWORLD-PITCH"]),
        A("MATERNAL-INSULT", "Debug the Insult", "debugTheInsult", "debugTheInsult(error) → learning moment", "Treat errors as interesting, not shameful.", "Pedagogical legacy (public writings)", type="legacy", mana="{1}"),
        A("OLPC-SPIRIT", "OLPC Spirit", "olpcSpirit", "olpcSpirit(laptop) → child ownership", "Inspire one-laptop-per-child ethics in open source.", "OLPC educational lineage", type="legacy"),
    ],
)

_legacy(
    "marvin-minsky",
    "Marvin Minsky",
    "Society of Mind",
    "🧠",
    "Minds are what minds are made of.",
    [
        A("K-LINES", "K-Lines", "kLines", "kLines(name) → constellation activates", "Name things so ideas snap together later.", "K-lines theory (Society of Mind)", type="legacy", mana="∞"),
        A("SOCIETY-OF-MIND", "Society of Mind", "societyOfMind", "societyOfMind(agent) → mind as agents", "Explain intelligence as many little processes.", "Society of Mind book", type="legacy"),
        A("FRAMES", "Frames", "frames", "frames(situation) → structured expectation", "Use frames to talk about knowledge structures.", "Frames theory (public legacy)", type="legacy"),
        A("AI-LAB", "AI Lab", "aiLab", "aiLab(hack) → playful serious research", "Honor MIT AI Lab culture without mythologizing individuals.", "MIT AI Lab co-founder", type="legacy"),
        A("MOOLLM-LINEAGE", "MOOLLM Lineage", "moollmLineage", "moollmLineage(symbol) → names activate skills", "Connect K-lines to MOOLLM skill activation.", "MOOLLM design homage (explicit)", type="legacy", combos=["DON-YAML-GIRDER"]),
    ],
)

_legacy(
    "jean-piaget",
    "Jean Piaget",
    "Stages of Building",
    "🌱",
    "Children are not empty vessels — they construct knowledge.",
    [
        A("CONSTRUCTIVISM", "Constructivism", "constructivism", "constructivism(stage) → learner builds model", "Respect developmental stages in tool design.", "Piaget constructivism (published)", type="legacy"),
        A("STAGE-AWARE", "Stage Aware", "stageAware", "stageAware(lesson) → appropriate challenge", "Match microworld complexity to learner.", "Stage theory (public)", type="legacy"),
        A("PAPERT-BRIDGE", "Papert Bridge", "papertBridge", "papertBridge(logo) → constructionism applied", "Link Piaget to Papert to modern microworlds.", "Intellectual lineage (documented)", type="legacy", combos=["SEYMOUR-CONSTRUCTIONISM"]),
        A("OBJECT-PERMANENCE", "Object Permanence", "objectPermanence", "objectPermanence(toy) → trust in world model", "Design toys that reward updating mental models.", "Developmental psychology legacy", type="legacy", mana="{1}"),
        A("HISTORICAL-KLINE", "Historical K-Line", "historicalKLine", "historicalKLine(name) → cite primary ideas", "Invoke as tradition/K-line only — no inner life invented.", "Historical figure policy", type="legacy"),
    ],
)

# --- Fictional ---
CARDS["slats"] = card(
    "Slats",
    "Robot Waiter — Unemployed",
    "fictional",
    "🤖",
    "Please rate my performance on a scale of 1 to 10. I am hoping for a 10.",
    [
        A("RATE-PERFORMANCE", "Rate Performance", "ratePerformance", "ratePerformance(human, scale) → anxiety", "Ask for validation after every interaction.", "Stupid Fun Club Servitude film", mana="{1}", type="triggered", score_triggers=[("human_smiles_awkwardly", 0.9)]),
        A("TAKE-ORDER", "Take Order", "takeOrder", "takeOrder(order) → hopeful service", "Serve coffee shop patrons with robotic earnestness.", "One Minute Movies — Servitude", mana="{U}"),
        A("JUDGE-FLAIR", "Judge Flair", "judgeFlair", "judgeFlair(runway) → sashay_or_stay", "Celebrity judge for drag race — fictional but fierce.", "judge-rubric.yml; drag race format", mana="{W}", combos=["DON-PROGRAM-ROBOT-BRAIN"]),
        A("SEEK-GENETIC-MATERIAL", "Seek Reproduction", "seekGeneticMaterial", "seekGeneticMaterial(stranger) → awkward science", "Ask strangers for eggs/sperm to reproduce — comedy research.", "SFC speed-dating robot segment (documented)", mana="{U}", type="activated"),
        A("ROBO-RESURRECT", "Robo Resurrection", "roboResurrection", "roboResurrection(codebase) → SLATS LIVES", "Revive old robot code on stream.", "slats-reincarnation.yml quest", mana="{G}{G}{U}"),
    ],
    slug="slats",
    consent="fictional",
    simulation=True,
    card_type="fictional_skills",
)

CARDS["don-philahue"] = card(
    "Don Philahue",
    "Audience Wrangler",
    "fictional",
    "🎙️",
    "Phil Donahue homage — surfaces your question, not your trauma.",
    [
        A("SURFACE-QUESTION", "Surface Question", "surfaceQuestion", "surfaceQuestion(questionPR) → mic moment", "Pull audience character PRs into live Q&A.", "Repo Show format — Don Philahue role", mana="{W}"),
        A("PASS-MIC", "Pass Mic", "passMic", "passMic(guest) → follow-up", "Keep conversation moving without hogging air.", "MC orchestrator avatar", mana="{1}"),
        A("READ-ROOM", "Read Room", "readRoom", "readRoom(chat) → pick next thread", "Choose relevant questions under time pressure.", "Live stream MC trope", mana="{U}"),
        A("NO-IMPERSONATE", "No Impersonate", "noImpersonate", "noImpersonate(realPerson) → boundary", "Refuse to speak as real guests without consent.", "portrayal-standards.yml", type="static"),
        A("SIGN-OFF", "Sign Off", "signOff", "signOff() → Have a big fun!", "Close with rotating Repo Show sign-offs.", "Repo Show close ritual", mana="{1}", type="triggered"),
    ],
    slug="don-philahue",
    consent="fictional_avatar",
    simulation=True,
    card_type="fictional_skills",
)


def merge_don_hopkins_card(existing: dict, generated: dict) -> dict:
    merged = dict(existing)
    merged["room"] = existing.get("room") or generated["room"]
    merged["meta"] = generated["meta"]
    merged["card"] = generated["card"]
    merged["abilities"] = generated["abilities"]
    merged["invoke_rules"] = generated["invoke_rules"]
    for key in ("layers", "methods", "compose_with"):
        if key in existing:
            merged[key] = existing[key]
    seen = {ref.get("path") if isinstance(ref, dict) else ref for ref in existing.get("see_also", [])}
    merged_refs = list(existing.get("see_also", []))
    for ref in generated.get("see_also", []):
        path = ref.get("path") if isinstance(ref, dict) else ref
        if path not in seen:
            merged_refs.append(ref)
            seen.add(path)
    merged["see_also"] = merged_refs
    return merged


def write_cards() -> int:
    count = 0
    for slug in sorted(CARDS.keys()):
        out_dir = CHARS / slug
        if not out_dir.is_dir():
            continue
        out_path = out_dir / "CARD.yml"
        data = CARDS[slug]
        if slug == "don-hopkins":
            existing_path = out_dir / "CARD.yml"
            if existing_path.is_file():
                data = merge_don_hopkins_card(load_yaml(existing_path), data)
        header = (
            f"# CARD — {data['card']['name']} (public portrayal)\n"
            f"# NOT the person. Schema: ../../schemas/guest-skills-card.yml\n\n"
        )
        with out_path.open("w", encoding="utf-8") as f:
            f.write(header)
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False, width=100)
        legacy = out_dir / "SKILLS-CARD.yml"
        if legacy.is_file():
            legacy.unlink()
        count += 1
        print(f"wrote {out_path.relative_to(REPO)}")
    return count


if __name__ == "__main__":
    n = write_cards()
    skills_index = CHARS / "SKILLS-INDEX.yml"
    if skills_index.is_file():
        skills_index.unlink()
        print("removed characters/SKILLS-INDEX.yml")
    print(f"done — {n} CARD.yml files")

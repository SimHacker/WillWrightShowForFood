# Sims Character Animation File Format

*Submitted by Don Hopkins · Thu, 2004-02-05 22:15*
*Tags: Character Animation*

*Extracted from Don Hopkins archival prompts (2026-06-29). Republished in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).*

---

This is a description of the file formats and structures used by The Sims character animation system, by Don Hopkins.

CMX File:

int32 skeletoncount;
skeleton skeletons[skeletoncount];
int32 suitcount;
suit suits[suitcount];
int32 skillcount;
skill skills[skillcount];
Skeleton:

countedstring name;
int32 bonecount;
bone bones[bonecount];
Bone:

countedstring name;
countedstring parentname;
int32 hasprops;
? props prop;
float trans[3];
float rot[4];
int32 cantranslate;
int32 canrotate;
int32 canblend;
int32 canwiggle;
int32 wigglepower;
Skill:

countedstring name;
countedstring filename; [of compressedfloatingpoint file]
float duration;
float distance;
int32 ismoving;
int32 numtranslations;
int32 numrotations;
int32 motioncount;
motion motions[mountcount];
Motion:

countedstring bonename;
int32 frames;
float duration;
int32 hastranslation;
int32 hasrotation;
int32 translationsoffset;
int32 rotationsoffset;
int32 hasprops;
? props props;
int32 hastimeprops;
? timeprops timeprops;
Suit:

countedstring name;
int32 type;
int32 hasprops;
? props prop;
int32 skincount;
skin skins[skincount];
Skin:

countedstring bonename;
countedstring name; [of deformablemesh file]
int32 flags;
int32 hasprops;
? props prop;
PropsKeyValue:

countedstring key;
countedstring value;
Props:

int32 size;
propskeyvalue keyvalues[size];
TimePropsKeyValue:

int32 key;
props value;
TimeProps:

int32 size;
timepropskeyvalue keyvalues[size];
CountedString:

byte len;
(len == 255)
? int32 len;
: char string[len];
DeformableMesh:

countedstring filename;
countedstring texturename;
int32 bonecount;
countedstring bonenames[bonecount];
int32 facecount;
deformableface faces[facecount];
int32 bonebindingcount;
bonebinding bonebindings[bonebindingcount];
int32 texturevertexcount;
texturevertex texturevertices[texturevertexcount];
int32 blenddatacount;
blenddata blenddata[blenddatacount];
int32 vertexcount;
normalvertex vertices[vertexcount];
DeformableFace:

int avertexindex;
int bvertexindex;
int cvertexindex;
BoneBinding:

int boneindex;
intfirstvert;
int vertcount;
int firstblendedvert;
int blendedvertcount;
TextureVertex:

float u;
float v;
BlendData:

int32 weightfixed;
int32 othervertexindex;
NakedVertex:

float x;
float y;
float x;
NormalVertex:

nakedvertex naked;
nakedvertex norm;

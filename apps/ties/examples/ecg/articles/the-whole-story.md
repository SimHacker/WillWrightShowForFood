---
title: "ECG: The Whole Story"
synonyms:
  - the whole story
  - ecg on one page
  - play
definition: "Embedded Constraint Graphics, every demo live on one page: a face that talks, how it works from two pictures up, then the same engine turning heads, rigging blendshapes, arranging windows, and what it has in common with how language models blend ideas. MIT licensed: take it."
---

Tom Ngo's **Embedded Constraint Graphics** (Interval Research, 1996, patent US5933150, expired 2016). You draw a few examples of a picture. Then you **drag the picture itself**, and the engine works out which blend of your examples puts the part you're holding under your cursor.

That's the whole trick, and it's general: an example is any list of numbers. Points of a cartoon, a 3D head, a face rig's coefficients, a layout of windows. This page starts with a face that talks, takes it apart one idea at a time, then points the same engine at other things.

Every demo is live, and beside each drawing is the machinery Tom's editor kept hidden: the weights, the map of the state space, the shape of the matrix the solver inverts. Drag the drawing, the dot on the map, or a weight bar. Click anywhere on a map to travel there.

## Mouther

```transclude
article: "Mouther"
```

## How it works

Everything Mouther does, built up from nothing. Each step adds one idea.

## Two Pictures

```transclude
article: "Two Pictures"
```

## A Triangle of Pictures

```transclude
article: "A Triangle of Pictures"
```

## More Examples Than You Need

```transclude
article: "More Examples Than You Need"
```

## More Handles Than You Can Satisfy

```transclude
article: "More Handles Than You Can Satisfy"
```

## Gluing Triangles Together

```transclude
article: "Gluing Triangles Together"
```

## A Fork in the Complex

```transclude
article: "A Fork in the Complex"
```

## Walking

```transclude
article: "Walking"
```

## Tumbling

```transclude
article: "Tumbling"
```

## Feel

```transclude
article: "Feel"
```

## Colour

```transclude
article: "Colour"
```

## Motion, Skeleton, Skin

```transclude
article: "Motion, Skeleton, Skin"
```

## The same engine, other things

The engine never knows what the numbers mean. It needs two things: examples that are lists of numbers of the same length, and handles whose positions are linear in those numbers. A point of a drawing is two of the numbers. A point seen through a fixed camera is a linear function of three. A rig's mesh is a linear function of its coefficients. Anything like that, you can drag.

## Turning a Head

```transclude
article: "Turning a Head"
```

## Blendshapes

```transclude
article: "Blendshapes"
```

## Bodies

A body is a skeleton, and a pose is its joint angles. Angles don't blend as freely as points (halfway between 350° and 10° is not 180°), so a body blends poses that are near each other, or blends rotations properly, and then hands the result to the skin. Ken Perlin's Improv drove actors this way, and Improv inspired the character animation system Don Hopkins built for The Sims 1.

ECG adds the drag. Author a few postures, glue them into a complex, and pull a hand: the engine finds the blend of postures that puts the hand there, and the rest of the body comes along the way it did in the postures you drew. Because many blends put the hand in the same place, slow noise among them makes the body breathe while the hand stays put.

That's how the next character will move: Heinz Lemke at the PDP-7, holding the light pen against the Type 340 display while his program PIXIE tracks it. The pen tip is the handle, a recorded demo is just a path for the tip, and ECG fills in the arm, the lean and the face ([the portrait design](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/PORTRAIT.md#ecg-drives-the-body)). His head, hands and body will be built in Blender, the face rigged with FaceIt's ARKit blendshapes, so one engine drives all of it: the expressions from Mouther-style voice and gesture, the hand from the pen, the body from both.

## Arranging Views

```transclude
article: "Arranging Views"
```

## How language models blend ideas

A large language model does a version of this blend thousands of times for every word it writes.

**Attention.** An attention head scores every earlier token, turns the scores into weights with softmax, so every weight is positive and they sum to 1, and outputs the weighted sum of those tokens' value vectors. Those weights are barycentric coordinates. The output is a point in the simplex whose corners are the values, exactly where the dot on a map sits among the examples.

**Mixture of experts.** A router scores every expert, keeps the top two or so, and blends only those. Out of many corners it picks a small simplex to blend in, the way ECG blends three mouths out of twenty-two by choosing a zone.

**Ideas as directions.** Word embeddings did arithmetic early on: in word2vec (Mikolov and colleagues, 2013), *king − man + woman* lands near *queen*. Interpretability work since breaks a model's activations into a sparse sum of learned features, a few active at a time (Anthropic's dictionary learning, 2023–2024), and pushing on one feature steers what the model says: clamp the Golden Gate Bridge feature up and the model brings the bridge into everything (Golden Gate Claude, 2024). The same concept in different languages lights up shared features (*On the Biology of a Large Language Model*, 2025).

That's the person and the cat from Motion, Skeleton, Skin. Surprise is one state; the person shows it with brows and the cat with ears. A concept is one direction; English and French each give it their own words.

ECG's move is the inverse problem: here is the output I want, which blend of things you know produces it? Steering and feature attribution ask the same question of a model. The difference is size. ECG's corners are a dozen pictures a person chose, and its space fits on a map you can drag. That makes it a good place to get a feel for what the big ones are doing.

## Where it could live

The forward half of ECG, blending examples by weights, is already built into the tools people use:

- **Godot**'s `AnimationNodeBlendSpace2D` triangulates its animation samples and blends inside a triangle by barycentric weights. Its zones are ECG's zones.
- **Blender** mixes shape keys by value and drives them from bones and expressions; FaceIt builds ARKit's 52 on any face.
- **Illustrator**'s Blend tool makes in-between steps from one shape to another.
- **D3** interpolates between states of a chart; **D2** lays out the same diagram several ways.
- **Games** blend animation clips, cameras and character-creator morphs.
- **User interfaces** blend layouts, zoom levels and menus.

What's missing in all of them is the other half: grab the result and say where it should go. A Godot blend space you steer by dragging the character's hand. A Blender add-on where you pull a vertex on a FaceIt head and the expression shape keys follow. An Illustrator blend of five drawings you reshape by dragging the in-between. A D3 or D2 diagram whose saved layouts you move between by dragging one node. Window layouts that follow a resize, as in Arranging Views.

## Take it

The engine is [packages/ecg](https://github.com/SimHacker/WillWrightShowForFood/tree/main/packages/ecg): TypeScript, MIT licensed, no runtime dependencies, with a worked test for every idea on this page. Copy it into your project. Tom's patent expired in 2016, so the technique is free to use too.

```js
import { loadModel, startState, walk, pointTargets, configurationOf } from '@wwsff/ecg';

const { model } = loadModel({
  examples: [
    { id: 'frown', points: [[-10, 0], [0, -4], [10, 0]] },
    { id: 'smile', points: [[-10, 0], [0, 4], [10, 0]] }
  ]
});
let state = startState(model);
// the user drags point 1, the middle of the mouth, to (0, 2)
state = walk(model, state, pointTargets(1, 0, 2)).state;
state.weights;                  // [0.25, 0.75]
configurationOf(model, state);  // [-10, 0, 0, 2, 10, 0]
```

Every demo on this page is an `ecg` block of plain YAML: examples, zones, strokes. Copy one, change the numbers, and you have your own. The generators for Mouther and the head, blendshape and window demos are short Python scripts beside the articles.

Build it into the tool you use. Rig a face, steer a blend space, arrange a dashboard, bend an icon. Write about what broke. We'd like to see it.

## Where it comes from

Tom Ngo and Bruce Donald patented ECG at Interval Research (filed 1996). The SIGGRAPH 2000 paper, [*Accessible Animation and Customizable Graphics via Simplicial Configuration Modeling*](https://doi.org/10.1145/344779.344964), is by Ngo, Cutrell, Dana, Donald, Loeb and Zhu. Golan Levin built Mouther with it, with Malcolm Slaney and Tom Ngo. Blending authored poses to drive a character runs through Ken Perlin's **Improv** (with Athomas Goldberg, NYU Media Research Lab, [SIGGRAPH 96](https://mrl.nyu.edu/projects/improv/)). J.P. Lewis and Ken Anjyo brought direct manipulation to production blendshapes (*Direct Manipulation Blendshapes*, 2010). More papers: [REFERENCES.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/ecg/REFERENCES.md).

The history: [Tom Ngo's Embedded Constraint Graphics at Interval](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

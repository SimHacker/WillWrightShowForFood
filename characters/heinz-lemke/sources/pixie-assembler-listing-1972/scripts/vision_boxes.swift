// Apple Vision OCR with boxes, for building scan source maps.
// Usage: vision_boxes <out.json> <page.png> [x y w h] [scale]
//   x y w h: an optional crop in page pixels (top-left origin); scale upsamples the crop before OCR.
// Writes { image, width, height, crop, scale, lines: [{ text, conf, box, words: [{ text, box }] }] }.
// Every box is normalized to the whole page, top-left origin: [x, y, w, h] in 0..1.

import AppKit
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count == 3 || args.count == 7 || args.count == 8 else {
    FileHandle.standardError.write("usage: vision_boxes <out.json> <page.png> [x y w h] [scale]\n".data(using: .utf8)!)
    exit(2)
}
let outPath = args[1]
let imagePath = args[2]
guard let ns = NSImage(contentsOfFile: imagePath),
      let page = ns.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    FileHandle.standardError.write("unreadable: \(imagePath)\n".data(using: .utf8)!)
    exit(1)
}
let W = CGFloat(page.width), H = CGFloat(page.height)
var crop = CGRect(x: 0, y: 0, width: W, height: H)
if args.count >= 7 {
    crop = CGRect(x: Double(args[3])!, y: Double(args[4])!, width: Double(args[5])!, height: Double(args[6])!)
        .intersection(CGRect(x: 0, y: 0, width: W, height: H))
}
let scale = args.count == 8 ? CGFloat(Double(args[7])!) : 1

// CGImage cropping uses top-left pixel coordinates.
guard let cut = page.cropping(to: crop.integral) else { exit(1) }
crop = crop.integral
var input = cut
if scale != 1 {
    let w = Int(CGFloat(cut.width) * scale), h = Int(CGFloat(cut.height) * scale)
    let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                        space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
    ctx.interpolationQuality = .none
    ctx.draw(cut, in: CGRect(x: 0, y: 0, width: w, height: h))
    input = ctx.makeImage()!
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.recognitionLanguages = ["en-US"]
do { try VNImageRequestHandler(cgImage: input).perform([request]) } catch {
    FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}

// Vision boxes are normalized to the crop, bottom-left origin; map them to the page, top-left origin.
func toPage(_ b: CGRect) -> [Double] {
    let x = (crop.minX + b.minX * crop.width) / W
    let y = (crop.minY + (1 - b.maxY) * crop.height) / H
    return [x, y, b.width * crop.width / W, b.height * crop.height / H].map { (Double($0) * 1e6).rounded() / 1e6 }
}

var lines: [[String: Any]] = []
for obs in request.results ?? [] {
    guard let cand = obs.topCandidates(1).first else { continue }
    let s = cand.string
    var words: [[String: Any]] = []
    s.enumerateSubstrings(in: s.startIndex..<s.endIndex, options: .byWords) { sub, range, _, _ in
        guard let sub, let box = try? cand.boundingBox(for: range) else { return }
        words.append(["text": sub, "box": toPage(box.boundingBox)])
    }
    lines.append(["text": s, "conf": Double(cand.confidence), "box": toPage(obs.boundingBox), "words": words])
}
lines.sort { (($0["box"] as! [Double])[1], ($0["box"] as! [Double])[0]) < (($1["box"] as! [Double])[1], ($1["box"] as! [Double])[0]) }

let doc: [String: Any] = [
    "image": (imagePath as NSString).lastPathComponent,
    "width": Int(W), "height": Int(H),
    "crop": [Int(crop.minX), Int(crop.minY), Int(crop.width), Int(crop.height)],
    "scale": Double(scale),
    "lines": lines,
]
let data = try! JSONSerialization.data(withJSONObject: doc, options: [.prettyPrinted, .sortedKeys])
try! data.write(to: URL(fileURLWithPath: outPath))

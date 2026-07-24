// Apple Vision OCR for PIXIE lineprinter listing pages.
// Usage: swift vision_ocr.swift <out-dir> <image.png> [...]
// Writes <out-dir>/<image-basename>.txt with lines sorted top-to-bottom.
// Words on the same visual line are joined with column padding estimated
// from Vision bounding boxes, so listing columns survive approximately.

import Foundation
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: vision_ocr <out-dir> <images...>\n".data(using: .utf8)!)
    exit(1)
}
let outDir = args[1]
try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

struct Frag { let x: CGFloat; let y: CGFloat; let text: String }

for path in args.dropFirst(2) {
    autoreleasepool {
        guard let img = NSImage(contentsOfFile: path),
              let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
            FileHandle.standardError.write("skip (unreadable): \(path)\n".data(using: .utf8)!)
            return
        }
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = false   // assembler symbols, not English
        request.recognitionLanguages = ["en-US"]
        let handler = VNImageRequestHandler(cgImage: cg)
        do { try handler.perform([request]) } catch {
            FileHandle.standardError.write("fail: \(path): \(error)\n".data(using: .utf8)!)
            return
        }
        var frags: [Frag] = []
        for obs in request.results ?? [] {
            guard let cand = obs.topCandidates(1).first else { continue }
            frags.append(Frag(x: obs.boundingBox.minX, y: obs.boundingBox.midY, text: cand.string))
        }
        // Group fragments into visual lines by y proximity (~half a text line).
        frags.sort { $0.y > $1.y }   // Vision y grows upward; top of page first
        var lines: [[Frag]] = []
        let yTol: CGFloat = 0.006
        for f in frags {
            if var last = lines.last, let ref = last.first, abs(ref.y - f.y) < yTol {
                last.append(f); lines[lines.count - 1] = last
            } else {
                lines.append([f])
            }
        }
        // Page is ~140 chars wide at these scans; map x∈[0,1] to columns.
        let pageCols: CGFloat = 140
        var out = ""
        for var line in lines {
            line.sort { $0.x < $1.x }
            var s = ""
            for f in line {
                let col = Int(f.x * pageCols)
                if col > s.count { s += String(repeating: " ", count: col - s.count) }
                else if !s.isEmpty { s += " " }
                s += f.text
            }
            out += s + "\n"
        }
        let base = (path as NSString).lastPathComponent
        let stem = (base as NSString).deletingPathExtension
        try? out.write(toFile: "\(outDir)/\(stem).txt", atomically: true, encoding: .utf8)
        print("ok: \(stem)")
    }
}

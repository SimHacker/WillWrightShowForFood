namespace MicropolisAngel.Services;

// w1 — CoreWebView2.AddHostObjectToScript("fileBridge", ...)
// Exposes read-only UserData paths to embedded Micropolis Home TypeScript.
public sealed class FileBridgeHostObject
{
    public string GetVersion() => "0.1.0-placeholder";

    public string Ping() => "FileBridge not wired yet — see WINDOWS-DEV-SETUP.md phase w1.";
}

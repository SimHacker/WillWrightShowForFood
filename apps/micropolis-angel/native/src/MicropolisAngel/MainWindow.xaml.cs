using System.Text.Json;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;

namespace MicropolisAngel;

public sealed partial class MainWindow : Window
{
    private readonly AppSettings _settings;

    public MainWindow()
    {
        InitializeComponent();
        _settings = AppSettings.Load();
        Title = _settings.WindowTitle;
        ExtendsContentIntoTitleBar = false;
        Loaded += OnLoadedAsync;
    }

    private async void OnLoadedAsync(object sender, RoutedEventArgs e)
    {
        Loaded -= OnLoadedAsync;
        await InitializeWebViewAsync();
    }

    private async Task InitializeWebViewAsync()
    {
        try
        {
            await MainWebView.EnsureCoreWebView2Async();
            MainWebView.CoreWebView2.NavigationCompleted += OnNavigationCompleted;
            MainWebView.Source = new Uri(_settings.WebView.StartUrl);
        }
        catch (Exception ex)
        {
            ShowStatus($"WebView2 init failed: {ex.Message}", InfoBarSeverity.Error);
        }
    }

    private void OnNavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        if (e.IsSuccess)
        {
            StatusBar.IsOpen = false;
            return;
        }

        var placeholder = Path.Combine(AppContext.BaseDirectory, "Assets", "placeholder.html");
        if (File.Exists(placeholder))
        {
            ShowStatus(
                $"Could not reach {_settings.WebView.StartUrl}. Showing local placeholder.",
                InfoBarSeverity.Warning);
            MainWebView.CoreWebView2.Navigate($"file:///{placeholder.Replace('\\', '/')}");
            return;
        }

        ShowStatus($"Navigation failed (HTTP {e.HttpStatusCode}).", InfoBarSeverity.Error);
    }

    private void ShowStatus(string message, InfoBarSeverity severity)
    {
        StatusBar.Message = message;
        StatusBar.Severity = severity;
        StatusBar.IsOpen = true;
    }
}

internal sealed class AppSettings
{
    public string WindowTitle { get; init; } = "MicropolisAngel";
    public WebViewSettings WebView { get; init; } = new();

    public static AppSettings Load()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        if (!File.Exists(path))
        {
            return new AppSettings();
        }

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<AppSettings>(json, JsonOptions()) ?? new AppSettings();
    }

    private static JsonSerializerOptions JsonOptions() =>
        new() { PropertyNameCaseInsensitive = true };
}

internal sealed class WebViewSettings
{
    public string StartUrl { get; init; } = "http://127.0.0.1:5371";
}

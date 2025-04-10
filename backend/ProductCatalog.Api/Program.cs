using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.Options;
using Serilog;
using ProductCatalog.Application.Interfaces;
using ProductCatalog.Infrastructure.Clients;
using ProductCatalog.Infrastructure.Configuration;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

var allowFrontendCors = "_AllowFrontendCors";

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowFrontendCors,
        policy =>
        {
            policy.WithOrigins(allowedOrigins!)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddHttpLogging(logging =>
{
    // Optional: Customize logging behavior here
    logging.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Product API",
        Version = "v1"
    });
});

builder.Services.AddMemoryCache();
builder.Services.AddHttpClient<IProductService, IfProductsHttpClient>();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.Configure<IfProductCatalogClientOptions>(
    builder.Configuration.GetSection("ProductApi"));

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

builder.Services
    .AddOptions<IfProductCatalogClientOptions>()
    .Bind(builder.Configuration.GetSection("ProductApi"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddHealthChecks()
    .AddUrlGroup(new Uri("http://localhost:5213/api/v1/products"), name: "product-api");

WebApplication app;

try
{
    app = builder.Build();
}
catch (OptionsValidationException ex)
{
    Log.Logger.Fatal(ex, "Configuration validation failed at startup.");
    return;
}

app.UseCors(allowFrontendCors);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product API v1");
    });
}

// Enable HTTPS redirection in production environments only.
// Required if hosting behind a reverse proxy without automatic TLS termination.
// if (app.Environment.IsProduction())
// {
//     app.UseHttpsRedirection();
// }

app.UseAuthorization();
app.UseHttpLogging();
app.UseSerilogRequestLogging();
app.UseHttpMetrics();
app.MapMetrics("/metrics");
app.MapControllers();

app.MapHealthChecks("/healthz");

app.Lifetime.ApplicationStarted.Register(() =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    var addresses = app.Services.GetRequiredService<IServer>().Features
        .Get<IServerAddressesFeature>()?
        .Addresses;

    if (addresses != null)
    {
        foreach (var address in addresses)
        {
            logger.LogInformation("Backend is running at {Address}", address);
        }
    }
    else
    {
        logger.LogWarning("Unable to determine bound server addresses.");
    }
});

app.Run();

public partial class Program { }

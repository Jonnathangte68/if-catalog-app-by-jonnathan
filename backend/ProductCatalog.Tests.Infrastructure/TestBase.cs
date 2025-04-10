using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ProductCatalog.Infrastructure.Configuration;

namespace ProductCatalog.Tests.Infrastructure;

public abstract class TestBase
{
    protected static IOptions<IfProductCatalogClientOptions> CreateDefaultOptions(string? baseUrl = null)
    {
        return Options.Create(new IfProductCatalogClientOptions
        {
            BaseUrl = baseUrl ?? "https://dummyjson.com"
        });
    }

    protected static IMemoryCache CreateMemoryCache()
    {
        return new MemoryCache(new MemoryCacheOptions());
    }

    protected static ILogger<T> CreateLogger<T>() => new LoggerFactory().CreateLogger<T>();
}
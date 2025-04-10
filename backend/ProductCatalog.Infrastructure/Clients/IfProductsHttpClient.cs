using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ProductCatalog.Application.Interfaces;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Infrastructure.Configuration;
using System.Net.Http.Json;
using JetBrains.Annotations;

namespace ProductCatalog.Infrastructure.Clients;

public class IfProductsHttpClient(
    HttpClient httpClient,
    IMemoryCache cache,
    ILogger<IfProductsHttpClient> logger,
    IOptions<IfProductCatalogClientOptions> options
) : IProductService
{
    private const string CacheKey = "products";
    private readonly string _baseUrl = options.Value.BaseUrl;

    public async Task<IEnumerable<Product>> GetProductsAsync(CancellationToken cancellationToken = default)
    {
        return await cache.GetOrCreateAsync(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = options.Value.CacheDuration;
            logger.LogInformation("Cache miss: fetching products from upstream API: {BaseUrl}", _baseUrl);

            var products = (await FetchProductsFromApiAsync(cancellationToken)).ToList();
            logger.LogInformation("Fetched {Count} products from upstream", products.Count);

            return products;
        }) ?? [];
    }

    private async Task<IEnumerable<Product>> FetchProductsFromApiAsync(CancellationToken cancellationToken)
    {
        try
        {
            var response = await httpClient.GetAsync($"{_baseUrl}/products", cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Upstream API returned status code: {StatusCode}", response.StatusCode);
                return [];
            }

            var dummyResponse = await response.Content.ReadFromJsonAsync<DummyJsonResponse>(cancellationToken: cancellationToken);

            var products = dummyResponse?.Products?.Select(p => new Product(
                Id: Guid.NewGuid(),
                ExternalId: p.Id,
                Title: p.Title,
                Description: p.Description,
                Price: Convert.ToDecimal(p.Price),
                Image: new Uri(p.Images?.FirstOrDefault() ?? "https://dummyimage.com/300x300/ccc/fff&text=No+Image")
            )) ?? [];

            return products;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch products from upstream API");
            return [];
        }
    }

    [UsedImplicitly]
    private class DummyJsonResponse
    {
        public List<DummyJsonProduct>? Products { get; set; }
    }

    [UsedImplicitly]
    private class DummyJsonProduct
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Price { get; set; }
        public string[] Images { get; set; } = [];
    }
}

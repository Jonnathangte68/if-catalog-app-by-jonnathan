using Moq;
using Moq.Protected;
using ProductCatalog.Infrastructure.Clients;
using System.Net;
using System.Text;
using FluentAssertions;

namespace ProductCatalog.Tests.Infrastructure;

public class IfProductsHttpClientEdgeTests : TestBase
{
    private IfProductsHttpClient CreateService(string json, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        var handler = new Mock<HttpMessageHandler>();
        handler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = statusCode,
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            });

        return new IfProductsHttpClient(
            new HttpClient(handler.Object),
            CreateMemoryCache(),
            CreateLogger<IfProductsHttpClient>(),
            CreateDefaultOptions()
        );
    }

    [Trait("Category", "Edge")]
    [Fact]
    public async Task GetProductsAsync_ReturnsEmpty_WhenNoProductsInJson()
    {
        var service = CreateService("""{ "products": [] }""");

        var result = await service.GetProductsAsync();

        result.Should().BeEmpty();
    }

    [Trait("Category", "Edge")]
    [Fact]
    public async Task GetProductsAsync_ReturnsEmpty_WhenApiFails()
    {
        var service = CreateService("""{ "error": "Internal Server Error" }""", HttpStatusCode.InternalServerError);

        var result = await service.GetProductsAsync();

        result.Should().BeEmpty();
    }

    [Trait("Category", "Edge")]
    [Fact]
    public async Task GetProductsAsync_IgnoresInvalidJson()
    {
        var service = CreateService("""{ "broken": "true" }""");

        var result = await service.GetProductsAsync();

        result.Should().BeEmpty();
    }
}

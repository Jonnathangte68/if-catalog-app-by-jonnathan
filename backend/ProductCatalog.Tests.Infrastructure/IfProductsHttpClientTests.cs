using FluentAssertions;
using Moq;
using Moq.Protected;
using ProductCatalog.Infrastructure.Clients;
using System.Net;
using System.Text; 

namespace ProductCatalog.Tests.Infrastructure;

public class IfProductsHttpClientTests : TestBase
{
    [Trait("Category", "Core")]
    [Fact]
    public async Task GetProductsAsync_ReturnsExpectedProduct()
    {
        var json = """
                   {
                       "products": [
                           { "id": 1, "title": "Phone", "description": "Smartphone", "price": 199.99 }
                       ]
                   }
                   """;

        var handler = new Mock<HttpMessageHandler>();
        handler.Protected()
            .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            });

        var service = new IfProductsHttpClient(
            new HttpClient(handler.Object),
            CreateMemoryCache(),
            CreateLogger<IfProductsHttpClient>(),
            CreateDefaultOptions()
        );

        var result = await service.GetProductsAsync();

        var products = result.ToList();
        products.Should().ContainSingle();

        var product = products.Single();
        product.Title.Should().Be("Phone");
        product.Description.Should().Be("Smartphone");
        product.Price.Should().Be(199.99m);
    }
}

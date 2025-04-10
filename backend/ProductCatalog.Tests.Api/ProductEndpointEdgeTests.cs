using System.Net;
using System.Text;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Moq.Protected;
using ProductCatalog.Application.Interfaces;
using ProductCatalog.Infrastructure.Clients;
using Xunit;

namespace ProductCatalog.Tests.Api;

public class ProductEndpointEdgeTests(
    WebApplicationFactory<Program> factory
) : IClassFixture<WebApplicationFactory<Program>>
{

    [Fact]
    public async Task GetProducts_ReturnsEmptyList_WhenUpstreamReturnsEmpty()
    {
        var mockResponse = """
        { "products": [] }
        """;

        var clientFactory = CreateFactoryWithMockHttp(mockResponse, HttpStatusCode.OK);

        var client = clientFactory.CreateClient();
        
        var response = await client.GetAsync("/api/v1/products");
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        
        content.Should().Match(c => c.Contains("[]") || c.Contains("products"));
        content.Should().NotContain("error");
    }

    [Fact]
    public async Task GetProducts_HandlesUpstreamFailure_Gracefully()
    {
        var clientFactory = CreateFactoryWithMockHttp("Service unavailable", HttpStatusCode.InternalServerError);
        var client = clientFactory.CreateClient();
        
        var response = await client.GetAsync("/api/v1/products");
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        
        content.Should().Match(c => c == "[]" || c.Contains("[]"));
        content.Should().NotContain("error");
    }

    private WebApplicationFactory<Program> CreateFactoryWithMockHttp(string responseContent, HttpStatusCode statusCode)
    {
        var mockHandler = new Mock<HttpMessageHandler>();
        mockHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = statusCode,
                Content = new StringContent(responseContent, Encoding.UTF8, "application/json")
            });

        var httpClient = new HttpClient(mockHandler.Object);

        return factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddControllers(); 
                
                services.RemoveAll<IProductService>();

                services.AddSingleton<IProductService>(sp =>
                    new IfProductsHttpClient(
                        httpClient,
                        sp.GetRequiredService<Microsoft.Extensions.Caching.Memory.IMemoryCache>(),
                        sp.GetRequiredService<Microsoft.Extensions.Logging.ILogger<IfProductsHttpClient>>(),
                        sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ProductCatalog.Infrastructure.Configuration.IfProductCatalogClientOptions>>()
                    ));
            });
        });
    }
}

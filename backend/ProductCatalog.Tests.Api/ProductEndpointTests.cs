using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ProductCatalog.Tests.Api;

public class ProductEndpointTests(
    WebApplicationFactory<Program> factory
) : IClassFixture<WebApplicationFactory<Program>>
{
    [Trait("Category", "Core")]
    [Fact]
    public async Task GetProducts_ReturnsSuccessAndJson()
    {
        var client = factory.CreateClient();
        
        var response = await client.GetAsync("/api/v1/products");
        
        response.IsSuccessStatusCode.Should().BeTrue();

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("title").And.Contain("description");
    }
}

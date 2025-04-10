using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Interfaces;
using ProductCatalog.Domain.Entities;
using Prometheus;

namespace ProductCatalog.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/products")]
[Produces("application/json")]
public class ProductsController(
    IProductService productService,
    ILogger<ProductsController> logger
) : ControllerBase
{
    private static readonly Counter ProductRequestCounter =
        Metrics.CreateCounter("product_requests_total", "Total number of requests to the products endpoint.");
    
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Product>))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Product>>> Get(CancellationToken cancellationToken)
    {
        ProductRequestCounter.Inc();
        
        try
        {
            var products = await productService.GetProductsAsync(cancellationToken);
            return Ok(products);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in {Path}: {Message}", HttpContext.Request.Path, ex.Message);
            return StatusCode(500, new { message = "Unable to fetch products at this time." });
        }
    }
}

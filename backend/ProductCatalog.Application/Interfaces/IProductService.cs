using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<Product>> GetProductsAsync(CancellationToken cancellationToken = default);
}

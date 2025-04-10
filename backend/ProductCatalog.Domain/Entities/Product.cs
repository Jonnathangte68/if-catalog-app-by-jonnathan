using JetBrains.Annotations;

namespace ProductCatalog.Domain.Entities;

[UsedImplicitly]
public record Product(Guid Id, int ExternalId, string Title, string Description, decimal Price, Uri Image);

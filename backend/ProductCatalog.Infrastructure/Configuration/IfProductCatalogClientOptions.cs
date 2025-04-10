using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Infrastructure.Configuration;

public class IfProductCatalogClientOptions
{
    [Required]
    [Url]
    public string BaseUrl { get; set; } = string.Empty;

    public TimeSpan CacheDuration { get; set; } = TimeSpan.FromMinutes(10);
}

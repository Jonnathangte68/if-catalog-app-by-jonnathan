FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ProductCatalog.Api/ProductCatalog.Api.csproj ProductCatalog.Api/
COPY ProductCatalog.Application/ProductCatalog.Application.csproj ProductCatalog.Application/
COPY ProductCatalog.Domain/ProductCatalog.Domain.csproj ProductCatalog.Domain/
COPY ProductCatalog.Infrastructure/ProductCatalog.Infrastructure.csproj ProductCatalog.Infrastructure/

RUN dotnet restore ProductCatalog.Api/ProductCatalog.Api.csproj

COPY ProductCatalog.Api/. ProductCatalog.Api/
COPY ProductCatalog.Application/. ProductCatalog.Application/
COPY ProductCatalog.Domain/. ProductCatalog.Domain/
COPY ProductCatalog.Infrastructure/. ProductCatalog.Infrastructure/

WORKDIR /src/ProductCatalog.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5213
EXPOSE 5213

ENTRYPOINT ["dotnet", "ProductCatalog.Api.dll"]

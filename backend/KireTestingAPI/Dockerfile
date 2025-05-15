FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["KireTestingAPI/KireTestingAPI.csproj", "KireTestingAPI/"]
RUN dotnet restore "KireTestingAPI/KireTestingAPI.csproj"
COPY . .
WORKDIR "/src/KireTestingAPI"
RUN dotnet build "KireTestingAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KireTestingAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KireTestingAPI.dll"]

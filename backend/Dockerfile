# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# যেহেতু রুট ডিরেক্টরি ফাঁকা, তাই backend/ ফোল্ডারটি উল্লেখ করে দিতে হবে
COPY ["backend/Backend.csproj", "backend/"]
RUN dotnet restore "backend/Backend.csproj"

# বাকি সব কোড কপি করা
COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Backend.dll"]

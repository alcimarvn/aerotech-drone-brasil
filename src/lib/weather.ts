export interface WeatherData {
    temp: number
    condition: string
    description: string
    windSpeed: number
    humidity: number
    feelsLike: number
    location: string
    icon: string
    isDay: boolean
}

export async function getWeather(location: string): Promise<WeatherData | null> {
    // If no API key is present, return mock data
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
        console.warn("OPENWEATHER_API_KEY not found. Returning mock weather data.")
        return getMockWeather(location)
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&lang=pt_br&appid=${apiKey}`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        )

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.statusText}`)
        }

        const data = await response.json()

        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            windSpeed: Number((data.wind.speed * 3.6).toFixed(1)), // Convert m/s to km/h
            humidity: data.main.humidity,
            feelsLike: Math.round(data.main.feels_like),
            location: data.name,
            icon: data.weather[0].icon,
            isDay: data.weather[0].icon.includes('d')
        }
    } catch (error) {
        console.error("Failed to fetch weather:", error)
        return getMockWeather(location)
    }
}

function getMockWeather(location: string): WeatherData {
    // Return somewhat realistic data for testing
    return {
        temp: 28,
        condition: "Clouds",
        description: "nublado",
        windSpeed: 12.5,
        humidity: 65,
        feelsLike: 31,
        location: location || "Localização Simulada",
        icon: "04d",
        isDay: true
    }
}

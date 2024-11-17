# Weather Dashboard

A dynamic weather dashboard application that allows travelers to view the current and future weather conditions for multiple cities to help plan their trips effectively.

## Description

The **Weather Dashboard** is an interactive and user-friendly web application designed to help travelers easily access and understand weather conditions. By leveraging the OpenWeather API, this dashboard provides users with real-time weather updates and forecasts for cities across the globe. Whether you're planning a trip or simply curious about the weather, this app has you covered.

Key features include:
- **Current weather conditions** with dynamic weather icons.
- A **5-day forecast** to help you plan ahead.
- **Search history** to quickly revisit previous cities.
- A **responsive design** that looks great on both mobile and desktop devices.
- Display of **temperature in Fahrenheit**, **wind speed**, and **humidity** to give you all the essential weather data.

Built with modern web technologies like **TypeScript**, **Express.js**, and **Vite**, this dashboard combines ease of use with powerful functionality, making it the perfect companion for your weather-related queries.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

Follow these steps to get the project up and running:


## 1. Clone the repository
```
git clone https://github.com/dgoldenthal/Weather-Forecast-Dashboard.git
```
## 2. Install dependencies for both client and server and root directory
```
npm install 
```
## 3. Install server dependencies
```
cd server
npm install
```
## 4. Install client dependencies
```
cd ../client
npm install
cd ..
```
## 5. Create a .env file in the server directory
```
cd server
touch .env
```
## 6. Add your OpenWeather API key to the .env file
```
echo "API_BASE_URL=https://api.openweathermap.org" >> .env
echo "API_KEY='your-api-key'" >> .env
```
## 7. Build and start the application
```
npm run start
```
## 8. Access the application in your browser at:
```
http://localhost:3001
```

# Usage

Open your web browser and navigate to http://localhost:3001.
Enter a city name in the search box to view the current weather and 5-day forecast.
Click on cities in the search history to view their weather again.
Remove cities from the search history using the trash icon.

# Features
**Current Weather Display:**
City name and date
Weather condition icon
Temperature in Fahrenheit
Wind speed and humidity

**5-Day Forecast:**
Date
Weather condition icon
Temperature in Fahrenheit
Wind speed and humidity

**Search History:**
Persistent storage for searched cities
Quick access to previous searches
Option to delete cities from the search history
Responsive for both mobile and desktop

# Technology Used: 

**Frontend:**

TypeScript
HTML5
CSS3
Vite (build tool)
Day.js (for date formatting)
Bootstrap (for styling)
Font Awesome icons (for dynamic weather icons)

**Backend:**

Node.js
Express.js
TypeScript
dotenv (for environment variables)
File-based storage for search history

**APIs:**

OpenWeather API (for weather data)
OpenWeather Geocoding API (for city coordinates)

# Environment Variables:

In the .env file in the server directory, add the following:
```
API_BASE_URL=https://api.openweathermap.org
API_KEY="your-api-key"
```

# Deployment

The Weather Dashboard is deployed on Render, a cloud platform that automatically builds and deploys web applications.

Deployment Link: [Weather Dashboard - Live](https://weather-forecast-dashboard-mr3d.onrender.com)
Please note that the application may experience an initial 50-second buffer time when first loading due to the platform's startup processes.

# License
This project is licensed under the MIT License - see the LICENSE file for details.



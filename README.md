# EV Charging Finder

A modern web application for finding electric vehicle charging stations, planning routes, and getting real-time availability information.

## Features

- 🗺️ Interactive map with charging station locations
- 🔍 Address-based route planning with autocomplete
- 📍 Current location detection and tracking
- ⚡ Real-time charging station availability
- 🔋 Filter stations by power output and connector type
- 📱 Responsive design for mobile and desktop
- 🌙 Dark mode support
- 🔔 Push notifications for station updates

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **State Management**: React Query
- **API Integration**: Axios
- **Geocoding**: OpenStreetMap Nominatim
- **Build Tool**: Vite
- **Testing**: Vitest
- **Deployment**: Docker, Nginx

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker (for containerized deployment)
- Python >= 3.8 (for development tools)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ev-charging-finder.git
   cd ev-charging-finder
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install Python development tools (optional):
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Development

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker compose build
   ```

2. Run with Docker Compose:
   ```bash
   docker compose up -d
   ```

3. Deploy to Portainer:
   - Import the `docker-compose.yml` file into Portainer
   - Update the domain in Traefik labels
   - Deploy the stack

The application will be available at `http://localhost:3000` or your configured domain.

## Project Structure

```
ev-charging-finder/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and service integrations
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application component
├── public/             # Static assets
├── docker/            # Docker configuration
├── nginx/             # Nginx configuration
└── tests/             # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenStreetMap for geocoding services
- Leaflet for mapping functionality
- React and the React community
- All contributors to the project 
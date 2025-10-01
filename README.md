# Startup Search Engine
##👉 Live Demo: https://search-engine-frontend-ap.onrender.com/

A modern contextual search tool for discovering innovative startups, built with React frontend and Python Flask backend featuring advanced search algorithms.

## 🚀 Features

### Core Functionality
- **Python Backend API**: Flask-based REST API with advanced search capabilities
- **TF-IDF Scoring**: Professional-grade term frequency-inverse document frequency algorithm
- **Fuzzy Matching**: Sequence matching for typo tolerance and partial matches
- **Real-time Results**: Live search with debounced queries for optimal performance
- **RESTful API**: Clean API endpoints for search, filters, and health checks

### User Experience
- **Smart Filters**: Filter by sector, funding stage, and location
- **Search History**: Automatically saves and suggests recent searches
- **Keyword Highlighting**: Visual highlighting of matched terms in results
- **Relevance Scores**: Each result shows a relevance percentage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Dataset
The application includes a comprehensive dataset of 40 startups with:
- Company name and description
- Industry sector and location
- Funding stage and amount
- Employee count and founding year
- Website links

## 🛠 Technology Stack

- **Backend**: Python 3.x with Flask and Flask-CORS
- **Frontend**: React 18 with TypeScript  
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Search Algorithms**: Python implementation with TF-IDF and fuzzy matching
- **Build Tool**: Vite
- **Development**: Hot module replacement and fast refresh

## 🔧 Installation & Setup

### Prerequisites
- Python 3.7+ with pip
- Node.js 16+ with npm

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-search-engine
   ```
2. **Create .env file**
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Set up Python backend**
3.1 Navigate into the **backend** folder
 ```bash
   cd backend
   ```
3.2: Create and Activate Virtual Environment if not present
```bash
python -m venv venv
venv\Scripts\activate
```
If successful, your terminal prompt will look like:

(venv) C:\Users\Anil\Downloads\project\backend>

3.3: **Install Dependencies**:
Install **Flask** and **Flask-CORS** inside the virtual environment if not install:

```bash
pip install Flask Flask-CORS

(Or use pip install -r requirements.txt if the file is present.)
```

3.4 if you face issue in flask like(flask is not resolve)
```bash
1 Open VS Code in the project folder.

2 Press Ctrl + Shift + P → type Python: Select Interpreter.

3 At the bottom, click Enter interpreter path → then Find….

4 Navigate to:

C:\Users\Anil\Downloads\project\backend\venv\Scripts\
Select python.exe (⚠ not pythonw.exe).
```
3.5 run commands in a separate terminal
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

4. **Set up React frontend** (in a new terminal)
   ```bash
   cd ..  # Back to project root
   npm install
   ```

5. **Start frontend development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build frontend
npm run build
npm run preview

# For production backend, consider using gunicorn:
# pip install gunicorn
# gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔍 How the Search Works

### 1. Python Backend API
- **Flask REST API** with CORS support for frontend integration
- **Advanced Search Engine** class with professional algorithms
- **JSON responses** with structured data and error handling

### 2. TF-IDF Algorithm
- **Term Frequency**: Calculates how often terms appear in each document
- **Inverse Document Frequency**: Measures term importance across the dataset
- **Combined Scoring**: Multiplies TF and IDF for sophisticated relevance ranking
- **Field Weighting**: Different weights for name, description, sector, and location

### 3. Fuzzy Matching
- **Sequence Matching**: Uses Python's difflib for similarity scoring
- **Typo Tolerance**: Handles misspellings and partial matches
- **Word-level Matching**: Compares individual words for better accuracy
- **Threshold Filtering**: Only includes matches above relevance threshold

### 4. Multi-field Search
Searches across multiple startup fields:
- **Company name** (40% weight) - highest priority
- **Description** (30% weight) - detailed content matching  
- **Sector** (20% weight) - category-based filtering
- **Location** (10% weight) - geographic relevance

### 5. API Endpoints
- **GET /api/search** - Main search with query and filter parameters
- **GET /api/filters** - Available filter options (sectors, stages, locations)
- **GET /api/health** - Backend health check and startup count

## 🎯 Usage Examples

### Basic Search
- Type "AI" to find artificial intelligence companies
- Search "healthcare" to discover health-tech startups
- Try "San Francisco" to find location-based results

### Advanced Features
- Use filters to narrow results by sector or funding stage
- Click on recent searches for quick access
- View relevance scores to understand result rankings

### API Usage
```bash
# Search for AI companies
curl "http://localhost:5000/api/search?q=artificial%20intelligence"

# Filter by sector and funding stage
curl "http://localhost:5000/api/search?sector=FinTech&funding_stage=Series%20A"

# Get available filters
curl "http://localhost:5000/api/filters"
```

## 🎨 Design Features

- **Modern UI**: Clean, professional interface
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Color System**: Sector-based color coding and consistent palette
- **Typography**: Optimized font hierarchy and readability
- **Responsive Layout**: Mobile-first design with breakpoints

## 🔮 Future Enhancements

- **Database Integration**: PostgreSQL or MongoDB for larger datasets
- **Semantic Search**: Word embeddings with sentence transformers
- **User Personalization**: Save favorite startups and preferences
- **Caching Layer**: Redis for improved performance
- **Authentication**: User accounts and saved searches
- **Real-time Data**: WebSocket updates for live startup data

## 📈 Technical Highlights

- **Professional Backend**: Flask with proper error handling and CORS
- **Advanced Algorithms**: TF-IDF and fuzzy matching from scratch
- **Type Safety**: Full TypeScript coverage
- **API Design**: RESTful endpoints with clear response formats
- **Maintainability**: Modular architecture with clear separation of concerns
- **Production Ready**: Structured for deployment and scaling

## 🐛 Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `app.py`: `app.run(port=5001)`
- **CORS errors**: Ensure Flask-CORS is installed: `pip install Flask-CORS`
- **Module not found**: Install requirements: `pip install -r requirements.txt`

### Frontend Issues  
- **API connection failed**: Verify backend is running on `http://localhost:5000`
- **Search not working**: Check browser console for API errors
- **Build errors**: Ensure all dependencies installed: `npm install`

Built with ❤️ using modern web technologies and intelligent search algorithms.

# BD Medicine Database Website

A comprehensive Next.js web application for searching and browsing medicines and drugs available in Bangladesh. Built with MongoDB for data storage and featuring advanced search, filtering, and statistical insights.

## Features

- **Advanced Search**: Full-text search across medicine names, generic names, manufacturers, and categories
- **Smart Filtering**: Filter by category, manufacturer, and price range
- **Sorting Options**: Sort by name, price, category, or manufacturer
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Grid/List View**: Toggle between card grid and list view
- **Pagination**: Efficient pagination for large datasets
- **Statistics Dashboard**: View top categories, manufacturers, and price distribution
- **Fast Performance**: Optimized MongoDB queries with proper indexing

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Lucide React
- **Search**: Text indexing and debounced search
- **Deployment Ready**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farhan-sadik247/bdmedicine_database.git
   cd medicine-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=medicine
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Import the CSV data**
   Make sure your CSV file is in the parent directory and run:
   ```bash
   npm run import-data
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

The medicine data includes the following fields:

- `medicine_name`: Name of the medicine
- `category_name`: Medicine category (e.g., Tablet, Syrup, Injection)
- `slug`: URL-friendly identifier
- `generic_name`: Generic/scientific name
- `strength`: Medicine strength/dosage
- `manufacturer_name`: Manufacturing company
- `unit`: Unit type (piece, bottle, etc.)
- `unit_size`: Size per unit
- `price`: Price in BDT (Bangladeshi Taka)

## API Endpoints

### GET /api/medicines
Retrieve paginated medicine data with optional filters and search.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term for full-text search
- `category`: Filter by category
- `manufacturer`: Filter by manufacturer  
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sortBy`: Sort field (medicine_name, price, category_name, manufacturer_name)
- `sortOrder`: Sort direction (asc, desc)

## Deployment

The app can be deployed to Vercel, Netlify, Railway, Heroku, or any Node.js hosting platform.

## Data Source

The medicine data includes over 19,000 medicines from various manufacturers across different categories in Bangladesh.

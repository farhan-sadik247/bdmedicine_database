# BD Medicine Database Website

🌐 **Live Demo**: [https://bdmedicine.vercel.app/](https://bdmedicine.vercel.app/)

A comprehensive Next.js web application for searching and browsing medicines and drugs available in Bangladesh. Built with MongoDB for data storage and featuring advanced search, filtering, and detailed medicine information with modal popups.

## ✨ Key Features

- **🔍 Advanced Search**: Full-text search across medicine names, generic names, manufacturers, and categories
- **🎛️ Smart Filtering**: Filter by category, manufacturer, and price range with real-time updates
- **📊 Detailed Medicine View**: Click "View Details" on any medicine card to see comprehensive information in a beautiful modal popup
- **🔄 Multiple Sorting**: Sort by name, price, category, or manufacturer (ascending/descending)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔀 Grid/List View**: Toggle between card grid and list view modes
- **📄 Smart Pagination**: Efficient pagination for browsing large datasets
- **📈 Statistics Dashboard**: Overview cards showing total medicines, categories, and manufacturers
- **⚡ Fast Performance**: Optimized MongoDB queries with proper indexing and debounced search

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React icon library
- **Search**: MongoDB text indexing with debounced search
- **Deployment**: Vercel (Production) + MongoDB Atlas (Database)
- **Version Control**: Git & GitHub

## 🚀 Live Application

**Production URL**: [https://bdmedicine.vercel.app/](https://bdmedicine.vercel.app/)

The application is deployed on Vercel with automatic deployments from the main branch of this repository.

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farhan-sadik247/bdmedicine_database.git
   cd bdmedicine_database
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/bdmedicine?retryWrites=true&w=majority&appName=medicine
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   
   > **Note**: Replace the MongoDB URI with your own credentials. The live application uses MongoDB Atlas.

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

## 💊 Medicine Modal Features

The application includes a detailed medicine modal that displays:

- **Medicine Name & Generic Name**: Prominently displayed with proper hierarchy
- **Strength Information**: Dosage details when available
- **Price Display**: Clear pricing in BDT (Bangladeshi Taka)
- **Category Tags**: Color-coded category badges
- **Manufacturer Info**: Company details
- **Unit Information**: Size and unit type
- **Product Code**: Unique slug identifier
- **Summary Section**: Key details in organized format

## 🔍 Search & Filter Capabilities

- **Real-time Search**: Debounced search across multiple fields
- **Category Filter**: Browse by medicine categories (Tablet, Syrup, Injection, etc.)
- **Manufacturer Filter**: Filter by pharmaceutical companies
- **Price Range Filter**: Set minimum and maximum price limits
- **Combined Filters**: Use multiple filters simultaneously
- **Sort Options**: Name, Price, Category, Manufacturer (A-Z or Z-A)

## 🗄️ Database Schema

The medicine collection contains **19,957 medicines** with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `medicine_name` | String | Name of the medicine |
| `category_name` | String | Medicine category (Tablet, Syrup, Injection, etc.) |
| `slug` | String | URL-friendly unique identifier |
| `generic_name` | String | Generic/scientific name |
| `strength` | String | Medicine strength/dosage (e.g., "500 mg") |
| `manufacturer_name` | String | Manufacturing company |
| `unit` | String | Unit type (piece, bottle, ml, etc.) |
| `unit_size` | Number | Quantity per unit |
| `price` | Number | Price in BDT (Bangladeshi Taka) |

## 🔌 API Endpoints

### GET /api/medicines
Retrieve paginated medicine data with optional filters and search.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term for full-text search
- `category` (string): Filter by category
- `manufacturer` (string): Filter by manufacturer  
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field - `medicine_name`, `price`, `category_name`, `manufacturer_name`
- `sortOrder` (string): Sort direction - `asc` or `desc`

**Example Response:**
```json
{
  "medicines": [...],
  "pagination": {
    "current": 1,
    "pages": 998,
    "total": 19957,
    "limit": 20
  }
}
```

## 🚀 Deployment

This application is deployed on **Vercel** with automatic deployments from the GitHub repository.

**Live URL**: [https://bdmedicine.vercel.app/](https://bdmedicine.vercel.app/)

### Deploy Your Own Version

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Set environment variables in Vercel dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
   ```
5. Deploy!

### Alternative Deployment Platforms

The application can also be deployed to:
- **Netlify**
- **Railway** 
- **Heroku**
- **DigitalOcean App Platform**
- **Any Node.js hosting platform**

## 📊 Performance Features

- **Database Indexing**: Optimized MongoDB queries with text and field indexes
- **Debounced Search**: Reduces API calls and improves UX
- **Efficient Pagination**: Loads data in chunks for better performance  
- **Code Splitting**: Automatic bundle optimization by Next.js
- **Image Optimization**: Built-in Next.js image optimization
- **Caching**: MongoDB connection pooling and query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medicine data sourced from Bangladesh pharmaceutical information
- Built with modern web technologies for optimal performance
- Deployed on Vercel for global accessibility

**🔗 Quick Links:**
- **Live Application**: [https://bdmedicine.vercel.app/](https://bdmedicine.vercel.app/)
- **GitHub Repository**: [https://github.com/farhan-sadik247/bdmedicine_database](https://github.com/farhan-sadik247/bdmedicine_database)

*Empowering healthcare accessibility through technology* 🏥💊

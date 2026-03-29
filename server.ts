import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/prices", async (req, res) => {
    // Mocking some data for now to ensure the app works immediately
    const mockData = [
      { id: 1, category: "Canned Fish", brand: "555 Sardines", variant: "Tomato Sauce", size: "155g", srp: 20.25, lastUpdated: "2024-03-20" },
      { id: 2, category: "Canned Fish", brand: "Ligo Sardines", variant: "Tomato Sauce", size: "155g", srp: 21.50, lastUpdated: "2024-03-20" },
      { id: 3, category: "Processed Milk", brand: "Alaska Evaporated", variant: "Evap", size: "370ml", srp: 45.00, lastUpdated: "2024-03-20" },
      { id: 4, category: "Processed Milk", brand: "Bear Brand", variant: "Powdered", size: "320g", srp: 115.00, lastUpdated: "2024-03-20" },
      { id: 5, category: "Coffee", brand: "Nescafe", variant: "Classic", size: "25g", srp: 23.50, lastUpdated: "2024-03-20" },
      { id: 6, category: "Bread", brand: "Gardenia", variant: "Classic White", size: "400g", srp: 51.00, lastUpdated: "2024-03-20" },
      { id: 7, category: "Instant Noodles", brand: "Lucky Me!", variant: "Mami Chicken", size: "55g", srp: 9.25, lastUpdated: "2024-03-20" },
      { id: 8, category: "Detergent Soap", brand: "Surf", variant: "Bar", size: "360g", srp: 24.00, lastUpdated: "2024-03-20" },
    ];

    try {
      // DTI SRP page - this URL is often redirected or changed
      const url = "https://www.dti.gov.ph/konsyumer/suggested-retail-price/";
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 5000 // 5 second timeout
      });
      
      // If we got here, we might have data to scrape
      // For now, we still return mockData but we've successfully pinged the site
      // In a real app, we'd parse the table here
      res.json(mockData);
    } catch (error) {
      console.warn("Scraping failed, using fallback data:", error instanceof Error ? error.message : "Unknown error");
      // Return mock data even on error so the frontend doesn't break
      res.json(mockData);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

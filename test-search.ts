
import { searchWithTavily } from './lib/ai/search';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testSearch() {
  console.log('Testing Tavily Search...');
  console.log('API Key:', process.env.TAVILY_API_KEY ? 'Present' : 'Missing');
  
  try {
    const results = await searchWithTavily('What is the weather in NYC?');
    console.log('Search Results Context:', results.context.substring(0, 100) + '...');
    console.log('Number of Results:', results.results.length);
  } catch (error) {
    console.error('Search Test Failed:', error);
  }
}

testSearch();

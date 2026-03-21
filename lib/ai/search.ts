export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
}

export interface SearchWithTavilyResponse {
  context: string;
  results: TavilySearchResult[];
}

const SEARCH_CACHE = new Map<
  string,
  { data: SearchWithTavilyResponse; timestamp: number }
>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function searchWithTavily(
  query: string
): Promise<SearchWithTavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  console.log("searchWithTavily - apiKey exists:", !!apiKey, "query:", query);

  if (!apiKey) {
    console.warn("TAVILY_API_KEY is not set. Web search will be skipped.");
    return { context: "", results: [] };
  }

  // Check cache
  const cached = SEARCH_CACHE.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });

    if (!response.ok) {
      console.error("Tavily API error status:", response.status);
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data: TavilySearchResponse = await response.json();
    console.log("Tavily Search Results Count:", data.results?.length ?? 0);

    if (!data.results || data.results.length === 0) {
      return { context: "No results found.", results: [] };
    }

    const formattedResults = data.results
      .map((result, index) => {
        return `[${index + 1}] Title: ${result.title}\nURL: ${result.url}\nContent: ${result.content}\n`;
      })
      .join("\n");

    const searchData: SearchWithTavilyResponse = {
      context: formattedResults,
      results: data.results,
    };

    // Update cache
    SEARCH_CACHE.set(query, { data: searchData, timestamp: Date.now() });

    return searchData;
  } catch (error) {
    console.error("Error performing Tavily search:", error);
    return { context: "Error performing search.", results: [] };
  }
}

import { NextRequest } from 'next/server';

interface ContentSafetyAnalysis {
  severity: 'safe' | 'low' | 'medium' | 'high';
  categories: {
    Hate: number;
    SelfHarm: number;
    Sexual: number;
    Violence: number;
  };
  filteredContent?: string;
}

export async function analyzeContentSafety(content: string): Promise<ContentSafetyAnalysis> {
  try {
    // Check if Azure Content Safety environment variables are set
    const endpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT;
    const apiKey = process.env.AZURE_CONTENT_SAFETY_KEY;

    if (!endpoint || !apiKey) {
      // If Azure Content Safety is not configured, return safe by default
      return {
        severity: 'safe',
        categories: {
          Hate: 0,
          SelfHarm: 0,
          Sexual: 0,
          Violence: 0
        }
      };
    }

    const url = `${endpoint}/contentsafety/text:analyze?api-version=2023-10-01`;

    const requestBody = {
      text: content,
      categories: [
        "Hate",
        "SelfHarm", 
        "Sexual",
        "Violence"
      ],
      // Set severity levels for filtering
      categoryThresholds: {
        Hate: 0,
        SelfHarm: 0,
        Sexual: 0,
        Violence: 0
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure Content Safety API error (${response.status}): ${errorText}`);
      throw new Error(`Azure Content Safety API error: ${errorText}`);
    }

    const data = await response.json();

    // Extract category severities
    const categoriesAnalysis = data.categoriesAnalysis || [];
    
    const categories = {
      Hate: 0,
      SelfHarm: 0,
      Sexual: 0,
      Violence: 0
    };

    let maxSeverity = 0;

    for (const category of categoriesAnalysis) {
      const categoryName = category.category;
      categories[categoryName as keyof typeof categories] = category.severity;
      if (category.severity > maxSeverity) {
        maxSeverity = category.severity;
      }
    }

    // Determine overall severity based on max category severity
    let severity: 'safe' | 'low' | 'medium' | 'high' = 'safe';
    if (maxSeverity >= 6) {
      severity = 'high';
    } else if (maxSeverity >= 4) {
      severity = 'medium';
    } else if (maxSeverity >= 2) {
      severity = 'low';
    }

    return {
      severity,
      categories,
      filteredContent: data.filteredText // This would be the filtered version if redaction was enabled
    };

  } catch (error) {
    console.error('Azure Content Safety analysis failed:', error);
    // Return safe by default if content safety check fails
    return {
      severity: 'safe',
      categories: {
        Hate: 0,
        SelfHarm: 0,
        Sexual: 0,
        Violence: 0
      }
    };
  }
}
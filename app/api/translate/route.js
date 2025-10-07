import { NextResponse } from 'next/server';

// ==========================================
// DEEPL TRANSLATION API ROUTE
// Professional quality translations
// ==========================================

export async function POST(request) {
  try {
    const { text, targetLang, sourceLang = 'auto' } = await request.json();

    // Validation
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required', success: false },
        { status: 400 }
      );
    }

    // Trim and validate text length
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json({
        translatedText: text,
        sourceLang,
        targetLang,
        success: true,
        cached: false
      });
    }

    // Log request
    console.log(`🌍 DeepL Translation: ${sourceLang} → ${targetLang} (${trimmedText.length} chars)`);
    
    // Get DeepL API key from environment variables
    const apiKey = process.env.DEEPL_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ DeepL API key not found, using fallback...');
      return await fallbackTranslation(trimmedText, targetLang, sourceLang);
    }

    // DeepL API endpoint (use free or pro based on your key)
    const apiUrl = apiKey.endsWith(':fx') 
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';
    
    // Map language codes (DeepL uses uppercase)
    const deeplTargetLang = targetLang.toUpperCase() === 'EN' ? 'EN-US' : targetLang.toUpperCase();
    const deeplSourceLang = sourceLang === 'auto' ? undefined : sourceLang.toUpperCase();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [trimmedText],
        target_lang: deeplTargetLang,
        source_lang: deeplSourceLang,
        preserve_formatting: true,
        formality: 'default'
      })
    });
    
    if (!response.ok) {
      console.error('DeepL API error:', response.status);
      
      // If quota exceeded or error, use fallback
      if (response.status === 456 || response.status === 429) {
        console.warn('⚠️ DeepL quota exceeded, using fallback...');
        return await fallbackTranslation(trimmedText, targetLang, sourceLang);
      }
      
      return NextResponse.json(
        { 
          error: 'Translation service temporarily unavailable', 
          success: false,
          translatedText: text
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    if (!data.translations || data.translations.length === 0) {
      console.warn('Empty translation received from DeepL');
      return await fallbackTranslation(trimmedText, targetLang, sourceLang);
    }

    const translatedText = data.translations[0].text;
    const detectedSourceLang = data.translations[0].detected_source_language?.toLowerCase() || sourceLang;

    console.log(`✓ DeepL translation successful (${translatedText.length} chars)`);

    return NextResponse.json({
      translatedText,
      sourceLang: detectedSourceLang,
      targetLang,
      success: true,
      provider: 'deepl'
    });

  } catch (error) {
    console.error('❌ Translation error:', error);
    
    // Use fallback on any error
    const { text } = await request.json();
    return await fallbackTranslation(text, request.targetLang, request.sourceLang);
  }
}

// Fallback to Google Translate (free, no API key needed)
async function fallbackTranslation(text, targetLang, sourceLang = 'auto') {
  try {
    console.log('🔄 Using Google Translate fallback...');
    
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', sourceLang);
    url.searchParams.append('tl', targetLang);
    url.searchParams.append('dt', 't');
    url.searchParams.append('q', text);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      let translatedText = '';
      
      if (data && Array.isArray(data) && data[0]) {
        translatedText = data[0]
          .filter(item => item && item[0])
          .map(item => item[0])
          .join('');
      }

      if (translatedText) {
        console.log('✓ Fallback translation successful');
        return NextResponse.json({
          translatedText,
          sourceLang: data[2] || sourceLang,
          targetLang,
          success: true,
          provider: 'google-fallback'
        });
      }
    }
    
    // Last resort: return original text
    return NextResponse.json({
      translatedText: text,
      sourceLang,
      targetLang,
      success: false,
      provider: 'none'
    });
    
  } catch (error) {
    console.error('Fallback translation error:', error);
    return NextResponse.json({
      translatedText: text,
      sourceLang,
      targetLang,
      success: false,
      provider: 'none'
    });
  }
}

// Optional: Add a GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Google Translate API',
    languages: {
      supported: ['en', 'el'],
      format: 'ISO 639-1'
    }
  });
}


import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        // Validate URL
        new URL(url);

        // Fetch the URL content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; URLPreviewBot/1.0)',
            },
            // Add timeout
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status}`);
        }

        const html = await response.text();

        // Extract metadata from HTML
        const metadata = extractMetadata(html, url);

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Error fetching URL preview:', error);
        return NextResponse.json(
            { error: 'Failed to fetch URL preview', url },
            { status: 500 }
        );
    }
}

function extractMetadata(html: string, url: string) {
    const metadata: Record<string, string> = { url };

    // Extract Open Graph tags
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
    if (ogTitleMatch) metadata.ogTitle = decodeHtmlEntities(ogTitleMatch[1]);

    const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i);
    if (ogDescriptionMatch) metadata.ogDescription = decodeHtmlEntities(ogDescriptionMatch[1]);

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);
    if (ogImageMatch) {
        const imageUrl = ogImageMatch[1];
        metadata.ogImage = imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, url).href;
    }

    // Extract Twitter Card tags
    const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:title["'][^>]*>/i);
    if (twitterTitleMatch && !metadata.ogTitle) metadata.ogTitle = decodeHtmlEntities(twitterTitleMatch[1]);

    const twitterDescriptionMatch = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:description["'][^>]*>/i);
    if (twitterDescriptionMatch && !metadata.ogDescription) metadata.ogDescription = decodeHtmlEntities(twitterDescriptionMatch[1]);

    const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:image["'][^>]*>/i);
    if (twitterImageMatch && !metadata.ogImage) {
        const imageUrl = twitterImageMatch[1];
        metadata.ogImage = imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, url).href;
    }

    // Fallback to standard meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch && !metadata.ogTitle) metadata.title = decodeHtmlEntities(titleMatch[1]);

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    if (descriptionMatch && !metadata.ogDescription) metadata.description = decodeHtmlEntities(descriptionMatch[1]);

    // Use og values as primary
    metadata.title = metadata.ogTitle || metadata.title || '';
    metadata.description = metadata.ogDescription || metadata.description || '';
    metadata.image = metadata.ogImage || '';

    return metadata;
}

function decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
    };

    return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

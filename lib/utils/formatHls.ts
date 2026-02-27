export interface HlsStream {
    Url: string;
    Quality: string;
    Resolution?: string; // Optional if available in JSON
}

/**
 * Parses a JSON string of HLS streams and extracts all valid streams.
 * @param hlsString The JSON string containing HLS stream information.
 * @returns An array of HlsStream objects.
 */
export const getHlsVariants = (hlsString: string | null): HlsStream[] => {
    if (!hlsString) return [];

    try {
        const streams: HlsStream[] = JSON.parse(hlsString);
        if (!Array.isArray(streams)) return [];
        return streams;
    } catch (error) {
        console.error("Error parsing HLS string:", error);
        return [];
    }
};

/**
 * Parses a JSON string of HLS streams and extracts the master playlist URL.
 * Prioritizes the stream with Quality "master".
 * @param hlsString The JSON string containing HLS stream information.
 * @returns The URL of the master playlist, or null if not found/invalid.
 */
export const formatHls = (hlsString: string | null): string | null => {
    if (!hlsString) return null;

    try {
        const streams = getHlsVariants(hlsString);
        if (streams.length === 0) return null;

        // Find the stream with "master" quality
        const masterStream = streams.find(
            (stream) => stream.Quality?.toLowerCase() === "master"
        );

        // Return master URL if found
        if (masterStream) {
            return masterStream.Url;
        }

        // Fallback: Return the first available URL if no master is found
        return streams[0].Url;
    } catch (error) {
        console.error("Error in formatHls:", error);
        return null;
    }
};

/**
 * Parses HLS variants and resolves relative URLs against the master playlist URL.
 */
export const getResolvedHlsVariants = (hlsString: string | null): HlsStream[] => {
    const variants = getHlsVariants(hlsString);
    if (!variants.length) return [];

    const masterUrl = formatHls(hlsString);
    if (!masterUrl) return variants;

    try {
        // Create base URL from master URL
        // Example: https://cdn.com/videos/123/master.m3u8 -> https://cdn.com/videos/123/
        const urlObj = new URL(masterUrl);
        const baseUrl = urlObj.href.substring(0, urlObj.href.lastIndexOf('/') + 1);

        return variants.map(variant => {
            try {
                // If URL is valid absolute URL, return as is
                new URL(variant.Url);
                return variant;
            } catch {
                // If URL is relative, resolve against base
                // Use URL constructor to handle resolution properly specific to the base
                const resolvedUrl = new URL(variant.Url, baseUrl).href;
                return { ...variant, Url: resolvedUrl };
            }
        });
    } catch (e) {
        console.error("Error resolving HLS variants:", e);
        return variants;
    }
};

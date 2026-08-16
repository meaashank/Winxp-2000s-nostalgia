export interface ParsedYouTubeInput {
  type: 'playlist' | 'video';
  id: string;
  originalInput: string;
}

/**
 * Extracts a YouTube playlist ID or video ID from various URL formats or raw IDs.
 */
export function parseYouTubeInput(input: string): ParsedYouTubeInput | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Direct Playlist ID pattern (e.g. starts with PL, RD, UU, FL, OLAK5uy_, etc.)
  if (/^(PL|RD|UU|FL|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      type: 'playlist',
      id: trimmed,
      originalInput: trimmed,
    };
  }

  // 2. Full URL containing playlist param `list=`
  try {
    if (trimmed.includes('list=')) {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const listParam = url.searchParams.get('list');
      if (listParam) {
        return {
          type: 'playlist',
          id: listParam,
          originalInput: trimmed,
        };
      }
    }
  } catch {
    // Fallback regex for list parameter if URL parsing fails
    const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return {
        type: 'playlist',
        id: match[1],
        originalInput: trimmed,
      };
    }
  }

  // 3. YouTube Watch / youtu.be / embed URL for single video
  try {
    if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return {
          type: 'video',
          id: match[1],
          originalInput: trimmed,
        };
      }
    }

    if (trimmed.includes('watch?v=') || trimmed.includes('/embed/') || trimmed.includes('/v/')) {
      const match = trimmed.match(/(?:v=|\/embed\/|\/v\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return {
          type: 'video',
          id: match[1],
          originalInput: trimmed,
        };
      }
    }
  } catch {
    // ignore
  }

  // 4. Raw 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      type: 'video',
      id: trimmed,
      originalInput: trimmed,
    };
  }

  // 5. Loose playlist ID check (anything longer than 15 chars without slashes)
  if (!trimmed.includes('/') && !trimmed.includes('?') && trimmed.length >= 12) {
    return {
      type: 'playlist',
      id: trimmed,
      originalInput: trimmed,
    };
  }

  return null;
}

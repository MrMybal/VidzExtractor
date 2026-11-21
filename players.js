// Chrome serializes this function to run inside each frame.
export function scanPlayers() {
  function previewFor(video) {
    if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(256 / video.videoWidth, 144 / video.videoHeight, 1);
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", .8);
      } catch {
        // Cross-origin video may still offer a poster.
      }
    }
    return video.poster || "";
  }

  const videos = [...document.querySelectorAll("video")].filter(video => !video.mediaKeys && !video.error);
  const players = videos.map(video => {
    const rect = video.getBoundingClientRect();
    const playing = !video.paused && !video.ended;
    return { video, playing, area: rect.width * rect.height };
  });
  return players.sort((a, b) => Number(b.playing) - Number(a.playing) || b.area - a.area)
    .slice(0, 8).map(({ video, playing }) => {
      const sources = video.currentSrc ? [{ url: video.currentSrc }] : [video, ...video.querySelectorAll("source")]
        .filter(source => source.getAttribute("src")?.trim())
        .slice(0, 8).map(source => ({ url: source.src, mime: source.getAttribute("type") || "" }));
      return {
        sources,
        playing,
        title: video.getAttribute("title") || video.getAttribute("aria-label") || "",
        pageTitle: document.title,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0,
        preview: previewFor(video)
      };
    });
}

export function playerForStream(item, streams, players, relatedUrls, duration) {
  const match = players.find(player => player.urls.some(url => url === item.url || relatedUrls?.has(url)));
  if (match) return match;

  const framePlayers = players.filter(player => player.frameId === item.frameId && player.adaptive);
  const activePlayers = framePlayers.filter(player => player.playing);
  const candidates = activePlayers.length ? activePlayers : framePlayers;
  const frameStreams = streams.filter(stream => stream.frameId === item.frameId);
  if (frameStreams.length === 1 && candidates.length === 1) return candidates[0];
  if (duration) {
    const matchingDuration = candidates.filter(player => player.duration && Math.abs(player.duration - duration) < 2);
    if (matchingDuration.length === 1) return matchingDuration[0];
  }

  const adaptive = players.filter(player => player.adaptive);
  if (item.frameId === undefined && streams.length === 1 && adaptive.length === 1) return adaptive[0];
  return null;
}

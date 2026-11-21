import { extension } from "./api.js";
import { mediaFrom } from "./media.js";

const urls = ["http://*/*", "https://*/*"];
const maxVideos = 24;
let pending = Promise.resolve();

function update(tabId, change) {
  pending = pending.then(async () => {
    const key = `tab:${tabId}`;
    const stored = (await extension.storage.session.get(key))[key];
    const next = change(stored);
    if (next === undefined) return;
    if (next === null) {
      await extension.storage.session.remove(key);
      return;
    }
    await extension.storage.session.set({ [key]: next });
    const count = next.items.filter(item => item.kind !== "dash").length;
    await extension.action.setBadgeText({ tabId, text: count ? String(count) : "" });
  }).catch(error => {
    if (!/^No tab with id/.test(error.message)) console.error(error);
  });
}

function responseSize(headers, status) {
  const length = status === 206
    ? /\/(\d+)$/.exec(headers["content-range"] ?? "")?.[1]
    : headers["content-length"];
  const size = Number(length);
  return Number.isSafeInteger(size) && size > 0 ? size : 0;
}

extension.action.setBadgeBackgroundColor({ color: "#007368" }).catch(console.error);

extension.webRequest.onHeadersReceived.addListener(details => {
  if (details.tabId < 0 || details.method !== "GET" || ![200, 206].includes(details.statusCode) ||
      (details.documentLifecycle && details.documentLifecycle !== "active")) return;
  const headers = Object.fromEntries(
    (details.responseHeaders ?? []).map(({ name, value }) => [name.toLowerCase(), value ?? ""])
  );
  const item = mediaFrom(details.url, {
    contentType: headers["content-type"],
    disposition: headers["content-disposition"],
    size: headers["content-encoding"] && headers["content-encoding"] !== "identity"
      ? 0 : responseSize(headers, details.statusCode)
  });
  if (!item) return;

  update(details.tabId, (stored = { since: 0, items: [] }) => {
    if (details.timeStamp < stored.since) return;
    const old = stored.items.find(entry => entry.url === item.url);
    item.size ||= old?.size || 0;
    if (old && old.size === item.size && old.format === item.format && old.name === item.name &&
        old.frameId === details.frameId) return;
    const main = details.type === "main_frame";
    const items = [{ ...item, main, frameId: details.frameId }, ...stored.items.filter(entry => entry.url !== item.url)];
    return { ...stored, items: items.slice(0, maxVideos) };
  });
}, { urls, types: ["main_frame", "sub_frame", "media", "xmlhttprequest", "other"] }, ["responseHeaders"]);

extension.webNavigation.onCommitted.addListener(details => {
  if (details.frameId !== 0) return;
  update(details.tabId, stored => ({
    since: details.timeStamp,
    items: (stored?.items ?? []).filter(item => item.main && item.url === details.url.split("#")[0])
  }));
});

extension.tabs.onRemoved.addListener(tabId => update(tabId, () => null));
extension.tabs.onReplaced?.addListener((_, oldTabId) => update(oldTabId, () => null));

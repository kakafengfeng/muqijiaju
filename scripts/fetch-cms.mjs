// 构建前从 Firestore 拉取最新 CMS 内容，写入 cms-snapshot.json 一起打包。
// 目的：访问设备连不上 Google 服务器（国内手机网络常见）时，也能看到构建时的
// 最新内容，而不是代码里几个月前的内置默认数据。能连上的设备仍会通过 onSnapshot
// 实时更新，不受影响。
// 该文档公开可读，无需密钥；拉取失败时保留仓库里的旧快照，不中断构建。
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'cms-snapshot.json');

// Firestore REST 的带类型格式 -> 普通 JSON
function plain(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return parseInt(v.integerValue, 10);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('bytesValue' in v) return v.bytesValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(plain);
  if ('mapValue' in v) {
    const o = {};
    for (const [k, fv] of Object.entries(v.mapValue.fields || {})) o[k] = plain(fv);
    return o;
  }
  return undefined;
}

async function main() {
  try {
    const fb = readFileSync(join(ROOT, 'firebase.ts'), 'utf8');
    const key = fb.match(/apiKey:\s*"([^"]+)"/)?.[1];
    const project = fb.match(/projectId:\s*"([^"]+)"/)?.[1];
    if (!key || !project) throw new Error('firebase config not found in firebase.ts');
    const url =
      `https://firestore.googleapis.com/v1/projects/${project}` +
      `/databases/(default)/documents/site_content/main?key=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.fields) throw new Error('empty document');
    const content = plain({ mapValue: { fields: data.fields } });
    writeFileSync(
      OUT,
      JSON.stringify({
        _meta: { syncedAt: new Date().toISOString(), source: 'firestore/site_content/main' },
        content,
      })
    );
    console.log(`[fetch-cms] snapshot updated (${Object.keys(content).length} sections)`);
  } catch (e) {
    console.warn(`[fetch-cms] fetch failed (${e.message}), keeping existing snapshot`);
    if (!existsSync(OUT)) {
      writeFileSync(OUT, JSON.stringify({ _meta: { syncedAt: null }, content: null }));
    }
  }
}

main();

import * as FileSystem from "expo-file-system/legacy";

const APP_DOCS = FileSystem.documentDirectory ?? "";
export const PRESCRIPTIONS_DIR = `${APP_DOCS}prescriptions/`;
export const BACKUPS_DIR = `${APP_DOCS}backups/`;
export const IMAGES_DIR = `${APP_DOCS}images/`;

export async function ensureDirectories() {
  for (const dir of [PRESCRIPTIONS_DIR, BACKUPS_DIR, IMAGES_DIR]) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
}

export async function savePdf(
  fileName: string,
  base64: string,
): Promise<string> {
  await ensureDirectories();
  const path = `${PRESCRIPTIONS_DIR}${fileName}`;
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
}

export async function saveImage(
  fileName: string,
  base64: string,
): Promise<string> {
  await ensureDirectories();
  const path = `${IMAGES_DIR}${fileName}`;
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
}

export async function listPdfs(): Promise<{ name: string; path: string }[]> {
  await ensureDirectories();
  const files = await FileSystem.readDirectoryAsync(PRESCRIPTIONS_DIR);
  return files.map((name) => ({
    name,
    path: `${PRESCRIPTIONS_DIR}${name}`,
  }));
}

export async function getFileSize(path: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(path, { size: true });
  return (info.exists && "size" in info ? info.size : 0) ?? 0;
}

export async function deleteFile(path: string): Promise<void> {
  await FileSystem.deleteAsync(path, { idempotent: true });
}

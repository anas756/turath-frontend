import fallbackImage from '../assets/arch-login.png';
import { htmlToPlainText } from './richText';

const assetBaseUrl = (
  import.meta.env.VITE_BACK_END_URL_IMAGE ||
  import.meta.env.VITE_BACK_END_URL ||
  ''
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const imageFilePattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const videoFilePattern = /\.(m4v|mov|mp4|ogg|ogv|webm)(\?.*)?$/i;

export function getId(item) {
  return item?._id || item?.id;
}

export function resolveAssetUrl(path) {
  const value = path?.toString().trim();
  if (!value || value === 'null') return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, '');
  const publicPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  return `${assetBaseUrl}/${publicPath}`;
}

export function listText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
}

export function listItems(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function getFileExtension(path) {
  const cleanPath = path?.toString().split('?')[0] || '';
  const extension = cleanPath.split('.').pop();
  return extension && extension !== cleanPath ? extension.toUpperCase() : '';
}

export function formatFileSize(size) {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** exponent);
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

export function isVideoFile(path) {
  return videoFilePattern.test(path || '');
}

export function isImageFile(path) {
  return imageFilePattern.test(path || '');
}

export function getMediaFiles(media) {
  const files = Array.isArray(media?.files)
    ? media.files
    : [];

  const normalizedFiles = files
    .map((file) => {
      const path = file?.path || file?.file_path || file?.url;
      const url = resolveAssetUrl(file?.url || path);
      const thumbnailUrl = resolveAssetUrl(file?.thumbnail_url || file?.thumbnail_path);
      if (!path && !url) return null;

      const type = file?.type || (isVideoFile(url || path) ? 'video' : isImageFile(url || path) ? 'image' : media?.type);

      return {
        ...file,
        id: file?.id || path || url,
        path,
        url,
        type,
        format: file?.format || getFileExtension(path || url),
        size: file?.size,
        resolution: file?.resolution,
        thumbnail_path: file?.thumbnail_path,
        thumbnail_url: thumbnailUrl,
        thumbnailUrl,
        original_name: file?.original_name || file?.name || getFileExtension(path || url),
      };
    })
    .filter(Boolean);

  if (normalizedFiles.length > 0) {
    return normalizedFiles;
  }

  const legacyUrl = resolveAssetUrl(media?.file_path);
  if (!legacyUrl) {
    return [];
  }

  return [{
    id: media?.file_path,
    path: media?.file_path,
    url: legacyUrl,
    type: media?.type || (isVideoFile(legacyUrl) ? 'video' : isImageFile(legacyUrl) ? 'image' : 'media'),
    format: media?.format || getFileExtension(media?.file_path),
    size: media?.size,
    resolution: media?.resolution,
    thumbnail_path: null,
    thumbnail_url: null,
    thumbnailUrl: null,
    original_name: getFileExtension(media?.file_path),
  }];
}

export function getPrimaryMediaFile(media) {
  return getMediaFiles(media)[0] || null;
}

export function categoryNameFor(document, categories = []) {
  const categoryId = document?.categorie_id || document?.categorie?.id || document?.categorie?._id;
  const category = categories.find((item) => getId(item) === categoryId);
  return document?.categorie?.name || category?.name || 'Uncategorized';
}

export function documentSourceLabel(document) {
  switch (document?.source) {
    case 'gutendex':
      return 'Gutendex';
    case 'google_books':
      return 'Google Books';
    case 'internet_archive':
      return 'Internet Archive';
    case 'open_library':
      return 'Open Library';
    default:
      return document?.open_library_key ? 'Open Library' : 'Document';
  }
}

export function mapDocumentToResource(document, categories = []) {
  const id = getId(document);
  const cover = resolveAssetUrl(document.cover);
  const extension = getFileExtension(document.file_path);
  const authors = listText(document.authors);
  const sourceLabel = documentSourceLabel(document);

  return {
    ...document,
    id,
    source: 'library',
    type: sourceLabel,
    format: extension || (document.has_full_text ? 'Readable text' : 'Provider record'),
    category: categoryNameFor(document, categories),
    title: document.title || 'Untitled document',
    description:
      htmlToPlainText(document.description) ||
      (authors ? `By ${authors}` : 'A document from the Turath archive.'),
    thumbnail: cover || fallbackImage,
    authors,
    tags: listItems(document.tags),
    actionLabel: 'Open',
    href: `/user/library/${id}`,
  };
}

export function mapMediaToResource(media) {
  const id = getId(media);
  const files = getMediaFiles(media);
  const primaryFile = files[0] || null;
  const fileUrl = primaryFile?.url || resolveAssetUrl(media.file_path);
  const type = primaryFile?.type || media.type || (isVideoFile(fileUrl) ? 'video' : isImageFile(fileUrl) ? 'image' : 'media');
  const isImage = type?.toLowerCase() === 'image' || isImageFile(fileUrl);
  const isVideo = type?.toLowerCase() === 'video' || isVideoFile(fileUrl);
  const normalizedType = type ? `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}` : 'Media';
  const displayType = isVideo ? 'Video' : isImage ? 'Image' : normalizedType;
  const size = formatFileSize(media.size);
  const videoThumbnail = primaryFile?.thumbnailUrl || primaryFile?.thumbnail_url;

  return {
    ...media,
    id,
    source: 'media',
    files,
    type: displayType,
    format: media.format || primaryFile?.format || getFileExtension(media.file_path) || 'Media',
    category: media.curator || 'Turath media',
    title: media.title || 'Untitled media',
    description: htmlToPlainText(media.description) || media.curator || 'A media record from the Turath archive.',
    thumbnail: isImage && fileUrl ? fileUrl : videoThumbnail || fallbackImage,
    hasGeneratedThumbnail: Boolean(videoThumbnail),
    mediaUrl: fileUrl,
    isVideo,
    isImage,
    length: size,
    actionLabel: isVideo ? 'Watch' : 'Open',
    href: `/user/media/${id}`,
  };
}

export function mapCategoryToCollection(category) {
  const documents = category.documents || [];
  const count = documents.length;
  const banner = resolveAssetUrl(category.banner);

  return {
    ...category,
    id: getId(category),
    title: category.name || 'Untitled collection',
    description: htmlToPlainText(category.description) || 'Documents grouped under this heritage category.',
    itemCount: `${count} ${count === 1 ? 'resource' : 'resources'}`,
    count: `${count} ${count === 1 ? 'resource' : 'resources'}`,
    sourceTypes: ['Library'],
    image: banner || fallbackImage,
    coverImage: banner || fallbackImage,
    href: `/user/collections?collection=${getId(category)}`,
  };
}

export function matchesText(item, query, fields = ['title', 'description', 'authors', 'category', 'type', 'format']) {
  const value = query.trim().toLowerCase();
  if (!value) return true;

  return fields.some((field) => {
    const content = item[field];
    if (Array.isArray(content)) return content.join(' ').toLowerCase().includes(value);
    return content?.toString().toLowerCase().includes(value);
  });
}

export function isFavoriteResource(resource, favorites = [], type) {
  const id = getId(resource);
  return favorites.some((favorite) => {
    const favoriteType = favorite.favorable_type || favorite.type || '';
    const matchesType = type ? favoriteType.toLowerCase().includes(type) || favorite.type === type : true;
    return matchesType && favorite.favorable_id === id;
  });
}

export { fallbackImage };

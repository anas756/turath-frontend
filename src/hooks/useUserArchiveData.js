import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCategoris,
  getAllDocs,
} from '../app/services/reduxTollkit/asyncThunks/LibraryThunk';
import { fetchMedia } from '../app/services/reduxTollkit/asyncThunks/MediaThunk';
import { fetchFavorites } from '../app/services/reduxTollkit/asyncThunks/FavoriteThunk';
import {
  isFavoriteResource,
  mapCategoryToCollection,
  mapDocumentToResource,
  mapMediaToResource,
} from '../utils/userResources';

export default function useUserArchiveData({
  includeFavorites = true,
  loadDocuments = true,
  loadCategories = true,
  loadMedia = true,
  documentsParams = null,
  categoriesParams = null,
  mediaParams = null,
} = {}) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    documents = [],
    categories = [],
    documentsPagination,
    categoriesPagination,
    documentsLoading = false,
    categoriesLoading = false,
  } = useSelector((state) => state.library || {});
  const {
    media = [],
    pagination: mediaPagination,
    mediaLoading = false,
  } = useSelector((state) => state.media || {});
  const favorite = useSelector((state) => state.favorite || {});
  const documentsRequestKey = useMemo(() => JSON.stringify(documentsParams || {}), [documentsParams]);
  const categoriesRequestKey = useMemo(() => JSON.stringify(categoriesParams || {}), [categoriesParams]);
  const mediaRequestKey = useMemo(() => JSON.stringify(mediaParams || {}), [mediaParams]);

  useEffect(() => {
    if (loadDocuments) {
      if (documentsParams) dispatch(getAllDocs(documentsParams));
      else if (!documents.length) dispatch(getAllDocs());
    }

    if (loadCategories) {
      if (categoriesParams) dispatch(getAllCategoris(categoriesParams));
      else if (!categories.length) dispatch(getAllCategoris());
    }

    if (loadMedia) {
      if (mediaParams) dispatch(fetchMedia(mediaParams));
      else if (!media.length) dispatch(fetchMedia({ status: 'active', per_page: 100 }));
    }

    if (includeFavorites && isAuthenticated) dispatch(fetchFavorites());
  }, [
    categories.length,
    categoriesParams,
    categoriesRequestKey,
    dispatch,
    documents.length,
    documentsParams,
    documentsRequestKey,
    includeFavorites,
    isAuthenticated,
    loadCategories,
    loadDocuments,
    loadMedia,
    media.length,
    mediaParams,
    mediaRequestKey,
  ]);

  const documentResources = useMemo(
    () => documents.map((document) => mapDocumentToResource(document, categories)),
    [documents, categories]
  );

  const mediaResources = useMemo(
    () => media.map(mapMediaToResource),
    [media]
  );

  const collectionResources = useMemo(
    () => categories.map(mapCategoryToCollection),
    [categories]
  );

  const favoriteDocuments = favorite.documents || [];
  const favoriteMedia = favorite.media || [];

  return {
    user,
    documents,
    categories,
    media,
    documentsPagination,
    categoriesPagination,
    mediaPagination,
    favorite,
    documentResources,
    mediaResources,
    collectionResources,
    favoriteDocuments,
    favoriteMedia,
    isDocumentFavorite: (resource) => isFavoriteResource(resource, favoriteDocuments, 'document'),
    isMediaFavorite: (resource) => isFavoriteResource(resource, favoriteMedia, 'media'),
    loading: documentsLoading || categoriesLoading || mediaLoading || favorite.loading,
  };
}

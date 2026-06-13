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

export default function useUserArchiveData({ includeFavorites = true } = {}) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    documents = [],
    categories = [],
    documentsLoading = false,
    categoriesLoading = false,
  } = useSelector((state) => state.library || {});
  const {
    media = [],
    mediaLoading = false,
  } = useSelector((state) => state.media || {});
  const favorite = useSelector((state) => state.favorite || {});

  useEffect(() => {
    if (!documents.length) dispatch(getAllDocs());
    if (!categories.length) dispatch(getAllCategoris());
    if (!media.length) dispatch(fetchMedia({ status: 'active', per_page: 100 }));
    if (includeFavorites && isAuthenticated) dispatch(fetchFavorites());
  }, [
    categories.length,
    dispatch,
    documents.length,
    includeFavorites,
    isAuthenticated,
    media.length,
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

// flexible mode
export const useFlexiMode = () => useState<'blog' | 'note'>('flexiMode', () => 'blog')

// article page catalog
export const useShowBlogCatalog = () => useState<Boolean>('showBlogCatalog', () => true)
export const useShowNoteCatalog = () => useState<Boolean>('showNoteCatalog', () => true)
export const useBlogSidebarFloat = () => useState<Boolean>('blogSidebarFloat', () => false)
export const useNoteSidebarFloat = () => useState<Boolean>('noteSidebarFloat', () => true)
export const useToggleBlogSidebarFloat = () => useState<Boolean>('toggleBlogSidebarFloat', () => false)
export const useToggleNoteSidebarFloat = () => useState<Boolean>('toggleNoteSidebarFloat', () => true)
export const useFloatBlogCatalogType = () => useState<'list' | 'tree'>('floatBlogCatalogType', () => 'list')
export const useFloatNoteCatalogType = () => useState<'list' | 'tree'>('floatNoteCatalogType', () => 'tree')

// article page zoom image
interface ZoomImageType {
  src: string;
  alt?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const useShowZoomImage = () => useState<'show' | 'hiding' | 'hidden'>('showZoomImage', () => 'hidden')
export const useZoomImage = () => useState<null | ZoomImageType>('zoomImage', () => null)
export const useCurrentZoomImage = () => useState<null | ZoomImageType>('currentZoomImage', () => null)
export const useZoomImageList = () => useState<ZoomImageType[]>('zoomImageList', () => [])

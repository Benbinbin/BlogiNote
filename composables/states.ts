/**
 *
 * window width and heigh
 * change when window resize in /layout/base.vue component
 *
 */
interface WindowSize {
  height: number;
  width: number;
}
export const useWindowSize = () => useState<WindowSize>('windowSize', () => {
  return {
    height: 0,
    width: 0
  }
})

/**
 *
 * page scroll distance
 * change when page scroll in /layout/base.vue component
 *
 */
export const usePageScrollTop = () => useState<number>('pageScrollTop', () => 0)

/**
 *
 * home page layout mode
 *
 */
export const useHomepageLayoutMode = () => useState<'post' | 'folder'>('homepageLayoutMode', () => 'post')

/**
 *
 * article catalog
 *
 */
// export const useBlogSidebarFloat = () => useState<Boolean>('blogSidebarFloat', () => false)
// export const useNoteSidebarFloat = () => useState<Boolean>('noteSidebarFloat', () => true)
// export const useToggleBlogSidebarFloat = () => useState<Boolean>('toggleBlogSidebarFloat', () => false)
// export const useToggleNoteSidebarFloat = () => useState<Boolean>('toggleNoteSidebarFloat', () => true)
// export const useFloatBlogCatalogType = () => useState<'list' | 'tree'>('floatBlogCatalogType', () => 'list')
// export const useFloatNoteCatalogType = () => useState<'list' | 'tree'>('floatNoteCatalogType', () => 'tree')

/**
 *
 * image zoom
 *
 */
export interface ZoomImageType {
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

// file type mapping
export const useFileTypeMap = () => useState('fileTypeMap', () => {
  return {
    default: {
      iconName: 'bi:file-earmark-text'
    },
    markdown: {
      iconName: 'bi:markdown-fill'
    },
    json: {
      iconName: 'bi:filetype-json'
    },
    csv: {
      iconName: 'bi:filetype-csv'
    }
  }
})

/**
 *
 * search modal
 *
 */
export const useShowSearchModal = () => useState<Boolean>('showSearchModal', () => false)
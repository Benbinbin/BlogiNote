// const appConfig = useAppConfig()

// flexible mode
export const useFlexiMode = () => useState<'blog' | 'note'>('flexiMode', () => 'blog')

// article page catalog
// move this share state to MarkdownBlog component
// export const useShowBlogCatalog = () => useState<Boolean>('showBlogCatalog', () => {
//   return false
// })

// move this share state to MarkdownNote component
// export const useShowNoteCatalog = () => useState<Boolean>('showNoteCatalog', () => {
//   return false
// })

export const useBlogSidebarFloat = () => useState<Boolean>('blogSidebarFloat', () => false)
export const useNoteSidebarFloat = () => useState<Boolean>('noteSidebarFloat', () => true)
export const useToggleBlogSidebarFloat = () => useState<Boolean>('toggleBlogSidebarFloat', () => false)
export const useToggleNoteSidebarFloat = () => useState<Boolean>('toggleNoteSidebarFloat', () => true)
export const useFloatBlogCatalogType = () => useState<'list' | 'tree'>('floatBlogCatalogType', () => 'list')
export const useFloatNoteCatalogType = () => useState<'list' | 'tree'>('floatNoteCatalogType', () => 'tree')

// series modal
// move this share state to page/article/[...slug] component
// export const useShowSeriesModal = () => useState<Boolean>('showSeriesModal', () => false)

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

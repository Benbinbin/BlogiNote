// control the scroll behavior
export function overscrollWheelHandler(event: WheelEvent, element: HTMLElement) {
  event.stopPropagation()

  if (element) {
    if (element.scrollTop === 0 && event.deltaY < 0) {
      event.preventDefault();
    } else if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight && event.deltaY > 0) {
      event.preventDefault();
    }
  }
}
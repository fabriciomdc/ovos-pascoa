import * as htmlToImage from "html-to-image"

export async function generateTicketImage(element: HTMLElement) {
  const dataUrl = await htmlToImage.toPng(element, {
    quality: 1,
    pixelRatio: 2,
  })

  return dataUrl
}

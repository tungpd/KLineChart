/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { OverlayTemplate } from '../../component/Overlay'
import { isFunction, isValid } from '../../common/utils/typeChecks'

const simpleAnnotation: OverlayTemplate = {
  name: 'simpleAnnotation',
  totalStep: 2,
  styles: {
    line: { style: 'dashed' }
  },
  createPointFigures: ({ overlay, coordinates }) => {
    let text = ''
    let color = ''
    if (isValid(overlay.extendData)) {
      if (!isFunction(overlay.extendData)) {
        // allow object { text, color } or plain string
        const ed = overlay.extendData
        if (ed !== null && typeof ed === 'object') {
          // cast to a shaped object to access known fields
          const obj = ed as { text?: unknown; color?: unknown }
          const t = obj.text
          if (typeof t === 'string') text = t
          const c = obj.color
          if (typeof c === 'string') color = c
        } else if (typeof overlay.extendData === 'string' || typeof overlay.extendData === 'number' || typeof overlay.extendData === 'boolean') {
          text = String(overlay.extendData)
        }
      } else {
        const fn = overlay.extendData as (o: unknown) => unknown
        const res = fn(overlay)
        if (res !== null && typeof res === 'object') {
          const obj = res as { text?: unknown; color?: unknown }
          const t = obj.text
          if (typeof t === 'string') text = t
          const c = obj.color
          if (typeof c === 'string') color = c
        } else if (typeof res === 'string' || typeof res === 'number' || typeof res === 'boolean') {
          text = String(res)
        }
      }
    }
    const startX = coordinates[0].x
    const startY = coordinates[0].y - 6
    const lineEndY = startY - 50
    const arrowEndY = lineEndY - 5
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: startX, y: startY }, { x: startX, y: lineEndY }] },
        ignoreEvent: true
      },
      {
        type: 'polygon',
        attrs: { coordinates: [{ x: startX, y: lineEndY }, { x: startX - 4, y: arrowEndY }, { x: startX + 4, y: arrowEndY }] },
        ignoreEvent: true
      },
      {
        type: 'text',
        attrs: { x: startX, y: arrowEndY, text, align: 'center', baseline: 'bottom' },
        styles: (typeof color === 'string' && color.length > 0) ? { color } : undefined,
        ignoreEvent: true
      }
    ]
  }
}

export default simpleAnnotation

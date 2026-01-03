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

import type { IndicatorTemplate } from '../../component/Indicator'

/**
 * Smart Money Concepts Result Interface
 *
 * VISUALIZATION METHODOLOGY:
 * This indicator uses a "pivot-to-breakout" rendering approach where horizontal lines
 * are drawn from the pivot point to the bar where the breakout occurs.
 *
 * Each property represents a price level that will be rendered as a horizontal line.
 * When the same price value is set across multiple consecutive bars, KLineChart
 * automatically connects them to create the horizontal line visualization.
 *
 * STRUCTURE HIERARCHY:
 * - Swing Structure (50-bar lookback): Major market movements, rendered as SOLID lines
 * - Internal Structure (5-bar lookback): Minor movements, rendered as DASHED lines
 *
 * BOS vs CHoCH LOGIC:
 * - BOS (Break of Structure): Price breaks a pivot in the direction of current trend = continuation
 * - CHoCH (Change of Character): Price breaks a pivot against current trend = reversal
 */
interface SmartMoneyResult {
  // === SWING STRUCTURE (Solid Lines) - Long-term 50-bar ===
  // Represents major trend changes, more significant than internal structure

  swingBosBull?: number // Bullish BOS: Price broke above swing high during uptrend (Green solid)
  swingBosBear?: number // Bearish BOS: Price broke below swing low during downtrend (Red solid)
  swingChochBull?: number // Bullish CHoCH: Price broke above swing high during downtrend (Teal solid)
  swingChochBear?: number // Bearish CHoCH: Price broke below swing low during uptrend (Orange solid)

  // === INTERNAL STRUCTURE (Dashed Lines) - Short-term 5-bar ===
  // Represents minor/real-time trend changes for early signal detection

  internalBosBull?: number // Bullish BOS: Internal high break during uptrend (Light green dashed)
  internalBosBear?: number // Bearish BOS: Internal low break during downtrend (Light red dashed)
  internalChochBull?: number // Bullish CHoCH: Internal high break during downtrend (Mint dashed)
  internalChochBear?: number // Bearish CHoCH: Internal low break during uptrend (Amber dashed)

  // === PIVOT MARKERS ===
  // Visual markers showing where significant swing points were identified

  swingHighMarker?: number // Purple circle at swing high pivot points
  swingLowMarker?: number // Cyan circle at swing low pivot points
}

/**
 * Smart Money Concepts Indicator
 *
 * CORE CONCEPT:
 * Smart Money Concepts (SMC) is a methodology that identifies institutional trading behavior
 * by analyzing market structure through Break of Structure (BOS) and Change of Character (CHoCH).
 *
 * KEY FEATURES:
 * 1. Dual-timeframe analysis (Swing + Internal structure)
 * 2. Trend identification through structure breaks
 * 3. Visual hierarchy (solid vs dashed lines)
 * 4. Directional color coding (green = bullish, red = bearish)
 *
 * VISUALIZATION APPROACH:
 * - Lines are drawn from pivot point to breakout point (not carried forward indefinitely)
 * - Each break is drawn once from detection to completion
 * - Solid lines = Major structure (50-bar pivots)
 * - Dashed lines = Minor structure (5-bar pivots)
 *
 * PARAMETERS:
 * - calcParams[0]: Swing length (default 50) - lookback for major pivots
 * - calcParams[1]: Internal length (default 5) - lookback for minor pivots
 */
const smartMoneyConcepts: IndicatorTemplate<SmartMoneyResult> = {
  name: 'SMART_MONEY_CONCEPTS',
  shortName: 'SMC',
  series: 'price',
  calcParams: [50, 5], // [swingLength (long-term), internalSwingLength (short-term)]
  precision: 2,
  shouldOhlc: true,

  /**
   * FIGURE DEFINITIONS
   *
   * KLineChart Rendering Notes:
   * - 'line' type: Connects consecutive non-null values horizontally
   * - styles(): Returns style object applied to the rendered line
   * - title: Displayed in tooltips when hovering over the line
   * - size: Line thickness in pixels
   * - style: 'solid' or 'dashed' (dashed requires dashValue)
   * - dashValue: [dash_length, gap_length] pattern for dashed lines
   *
   * Color Coding Strategy:
   * - Darker colors = Swing structure (more significant)
   * - Lighter colors = Internal structure (less significant)
   * - Green shades = Bullish breaks
   * - Red/Amber shades = Bearish breaks
   */
  figures: [
    // === SWING STRUCTURE (SOLID LINES) - Long-term ===
    // Bullish Swing BOS (Green Solid)
    {
      key: 'swingBosBull',
      title: 'BOS ↑: ',
      type: 'line',
      styles: () => ({
        color: '#22c55e',
        size: 2
      })
    },
    // Bearish Swing BOS (Red Solid)
    {
      key: 'swingBosBear',
      title: 'BOS ↓: ',
      type: 'line',
      styles: () => ({
        color: '#ef4444',
        size: 2
      })
    },
    // Bullish Swing CHoCH (Green Solid)
    {
      key: 'swingChochBull',
      title: 'CHoCH ↑: ',
      type: 'line',
      styles: () => ({
        color: '#10b981',
        size: 2
      })
    },
    // Bearish Swing CHoCH (Red Solid)
    {
      key: 'swingChochBear',
      title: 'CHoCH ↓: ',
      type: 'line',
      styles: () => ({
        color: '#f87171',
        size: 2
      })
    },

    // === INTERNAL STRUCTURE (DASHED LINES) - Short-term ===
    // Bullish Internal BOS (Green Dashed)
    {
      key: 'internalBosBull',
      title: 'BOS ↑ (Internal): ',
      type: 'line',
      styles: () => ({
        color: '#86efac',
        size: 1,
        style: 'dashed',
        dashValue: [4, 4]
      })
    },
    // Bearish Internal BOS (Red Dashed)
    {
      key: 'internalBosBear',
      title: 'BOS ↓ (Internal): ',
      type: 'line',
      styles: () => ({
        color: '#fca5a5',
        size: 1,
        style: 'dashed',
        dashValue: [4, 4]
      })
    },
    // Bullish Internal CHoCH (Mint Dashed)
    {
      key: 'internalChochBull',
      title: 'CHoCH ↑ (Internal): ',
      type: 'line',
      styles: () => ({
        color: '#6ee7b7',
        size: 1,
        style: 'dashed',
        dashValue: [4, 4]
      })
    },
    // Bearish Internal CHoCH (Amber Dashed)
    {
      key: 'internalChochBear',
      title: 'CHoCH ↓ (Internal): ',
      type: 'line',
      styles: () => ({
        color: '#fbbf24',
        size: 1,
        style: 'dashed',
        dashValue: [4, 4]
      })
    },
    // Swing High Marker (Purple circle)
    {
      key: 'swingHighMarker',
      title: 'Swing High: ',
      type: 'circle',
      styles: () => ({
        color: '#a855f7'
      })
    },
    // Swing Low Marker (Cyan circle)
    {
      key: 'swingLowMarker',
      title: 'Swing Low: ',
      type: 'circle',
      styles: () => ({
        color: '#22d3ee'
      })
    }
  ],

  /**
   * CALCULATION FUNCTION
   *
   * ALGORITHM OVERVIEW:
   * The calculation is divided into 3 distinct phases to ensure proper detection and rendering:
   *
   * PHASE 1: PIVOT DETECTION
   *   - Scan all bars to identify swing highs/lows (50-bar lookback)
   *   - Scan all bars to identify internal highs/lows (5-bar lookback)
   *   - Store detected pivots with their index and price
   *
   * PHASE 2: SWING STRUCTURE BREAK DETECTION
   *   - For each bar, check if price breaks any previous swing pivots
   *   - Determine if break is BOS (continuation) or CHoCH (reversal)
   *   - Draw horizontal line from pivot index to breakout index
   *
   * PHASE 3: INTERNAL STRUCTURE BREAK DETECTION
   *   - Same logic as Phase 2 but for internal pivots
   *   - Allows early detection of trend changes
   *
   * CRITICAL DESIGN DECISIONS:
   * 1. Pivots are detected FIRST, breaks detected LATER (separate loops)
   *    - This avoids the bug of checking breaks at pivot detection bar
   * 2. Lines are drawn by setting the same price value across multiple bars
   *    - KLineChart connects these values automatically
   * 3. Pivots are removed after use (splice) to prevent duplicate breaks
   *    - Each pivot level is only used once
   */
  calc: (dataList, indicator) => {
    const swingLength = indicator.calcParams[0] as number
    const internalLength = indicator.calcParams[1] as number

    // Storage for detected pivot points
    const swingHighs: Array<{ index: number; price: number }> = []
    const swingLows: Array<{ index: number; price: number }> = []
    const internalHighs: Array<{ index: number; price: number }> = []
    const internalLows: Array<{ index: number; price: number }> = []

    // Trend tracking: 1 = bullish, -1 = bearish, 0 = neutral
    let swingTrend = 0
    let internalTrend = 0

    // Results array
    const results: SmartMoneyResult[] = dataList.map(() => ({}))

    /**
     * ========================================
     * PHASE 1: PIVOT POINT DETECTION
     * ========================================
     *
     * METHODOLOGY:
     * A pivot high/low is identified when a bar's high/low is the highest/lowest
     * within a lookback window on BOTH sides (symmetric).
     *
     * For example, with swingLength=50:
     * - Bar i is a swing high if its high > all highs in range [i-50, i+50]
     * - This requires looking both backwards AND forwards (centered approach)
     *
     * BOUNDARY HANDLING:
     * - Pivots can only be detected from bar swingLength to dataList.length - swingLength
     * - This ensures we have complete lookback/lookahead windows
     * - Edge bars cannot form confirmed pivots
     *
     * WHY SEPARATE DETECTION FROM BREAKS:
     * - A pivot at bar i cannot break itself at bar i (logical impossibility)
     * - We must detect pivots first, THEN check future bars for breaks
     */

    // === STEP 1: Detect all pivot points ===
    for (let i = 0; i < dataList.length; i++) {
      const high = dataList[i].high
      const low = dataList[i].low

      // ===== SWING HIGH DETECTION (50-bar lookback) =====
      if (i >= swingLength && i < dataList.length - swingLength) {
        let isSwingHigh = true
        for (let j = i - swingLength; j <= i + swingLength; j++) {
          if (j !== i && dataList[j].high >= high) {
            isSwingHigh = false
            break
          }
        }
        if (isSwingHigh) {
          swingHighs.push({ index: i, price: high })
          results[i].swingHighMarker = high
          console.log(`Swing High at index ${i}: ${high}`)
        }
      }

      // ===== SWING LOW DETECTION (50-bar lookback) =====
      if (i >= swingLength && i < dataList.length - swingLength) {
        let isSwingLow = true

        // Check if this bar's low is less than all lows in the window
        for (let j = i - swingLength; j <= i + swingLength; j++) {
          if (j !== i && dataList[j].low <= low) {
            isSwingLow = false
            break
          }
        }

        if (isSwingLow) {
          swingLows.push({ index: i, price: low })
          results[i].swingLowMarker = low // Add visual marker (cyan circle)
          console.log(`Swing Low at index ${i}: ${low}`)
        }
      }

      // ===== INTERNAL HIGH DETECTION (5-bar lookback) =====
      // Internal highs provide early signals of potential trend changes
      // They are more frequent but less significant than swing highs
      if (i >= internalLength && i < dataList.length - internalLength) {
        let isInternalHigh = true

        for (let j = i - internalLength; j <= i + internalLength; j++) {
          if (j !== i && dataList[j].high >= high) {
            isInternalHigh = false
            break
          }
        }

        if (isInternalHigh) {
          internalHighs.push({ index: i, price: high })
          // No visual marker for internal pivots to avoid chart clutter
        }
      }

      // ===== INTERNAL LOW DETECTION (5-bar lookback) =====
      // Internal lows complement internal highs for short-term structure analysis
      if (i >= internalLength && i < dataList.length - internalLength) {
        let isInternalLow = true

        for (let j = i - internalLength; j <= i + internalLength; j++) {
          if (j !== i && dataList[j].low <= low) {
            isInternalLow = false
            break
          }
        }

        if (isInternalLow) {
          internalLows.push({ index: i, price: low })
        }
      }
    }

    /**
     * ========================================
     * PHASE 2: SWING STRUCTURE BREAK DETECTION
     * ========================================
     *
     * METHODOLOGY:
     * For each bar, check if its close price breaks any previously detected swing pivots.
     * A "break" means:
     * - Close > swing high price (bullish break)
     * - Close < swing low price (bearish break)
     *
     * BOS vs CHoCH CLASSIFICATION:
     * The current trend state determines the classification:
     *
     * BULLISH BREAKS (close > swing high):
     *   - If swingTrend was -1 (bearish): This is CHoCH (Change of Character) = REVERSAL
     *   - If swingTrend was 1 or 0 (bullish/neutral): This is BOS (Break of Structure) = CONTINUATION
     *
     * BEARISH BREAKS (close < swing low):
     *   - If swingTrend was 1 (bullish): This is CHoCH = REVERSAL
     *   - If swingTrend was -1 or 0 (bearish/neutral): This is BOS = CONTINUATION
     *
     * LINE RENDERING:
     * When a break is detected, we set the pivot price for all bars from pivot index to breakout index.
     * KLineChart connects these identical values to create a horizontal line visualization.
     *
     * PIVOT REMOVAL:
     * After a pivot is broken, it's removed from the array to prevent:
     * - Duplicate break detection
     * - Performance degradation from checking already-broken levels
     */

    // === STEP 2: Detect BOS/CHoCH for Swing Structure ===
    for (let i = 0; i < dataList.length; i++) {
      const close = dataList[i].close

      // ===== CHECK FOR BULLISH SWING BREAKS =====
      for (const pivot of swingHighs) {
        if (pivot.index < i && close > pivot.price) {
          if (swingTrend === -1) {
            // CHoCH: was bearish, now breaking high
            for (let j = pivot.index; j <= i; j++) {
              results[j].swingChochBull = pivot.price
            }
            console.log(`Swing CHoCH Bull: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            swingTrend = 1
          } else {
            // BOS: continuation
            for (let j = pivot.index; j <= i; j++) {
              results[j].swingBosBull = pivot.price
            }
            console.log(`Swing BOS Bull: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            swingTrend = 1
          }
          swingHighs.splice(swingHighs.indexOf(pivot), 1)
          break
        }
      }

      // ===== CHECK FOR BEARISH SWING BREAKS =====
      for (const pivot of swingLows) {
        if (pivot.index < i && close < pivot.price) {
          // BREAKDOWN OCCURRED!

          if (swingTrend === 1) {
            // === CHoCH SCENARIO ===
            // Previous trend was bullish (1), now we're breaking a low
            // This signals a potential trend REVERSAL to bearish

            for (let j = pivot.index; j <= i; j++) {
              results[j].swingChochBear = pivot.price
            }
            console.log(`Swing CHoCH Bear: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            swingTrend = -1 // Update trend to bearish
          } else if (swingTrend === -1 || swingTrend === 0) {
            // === BOS SCENARIO ===
            // Trend was already bearish (-1) or neutral (0)
            // Breaking a low confirms trend CONTINUATION

            for (let j = pivot.index; j <= i; j++) {
              results[j].swingBosBear = pivot.price
            }

            console.log('Bearish BOS detected (swing continuation) at index', i, 'price:', pivot.price, 'swingLow index:', pivot.index)
            swingTrend = -1 // Confirm bearish trend
          }

          swingLows.splice(swingLows.indexOf(pivot), 1)
          break
        }
      }

      // === STEP 3: Detect BOS/CHoCH for Internal Structure ===
      // ===== CHECK FOR BULLISH INTERNAL BREAKS =====
      for (const pivot of internalHighs) {
        if (pivot.index < i && close > pivot.price) {
          if (internalTrend === -1) {
            // Internal CHoCH: Minor trend reversal to bullish
            for (let j = pivot.index; j <= i; j++) {
              results[j].internalChochBull = pivot.price
            }
            console.log(`Internal CHoCH Bull: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            internalTrend = 1
          } else {
            // Internal BOS: Minor trend continuation bullish
            for (let j = pivot.index; j <= i; j++) {
              results[j].internalBosBull = pivot.price
            }
            console.log(`Internal BOS Bull: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            internalTrend = 1
          }
          internalHighs.splice(internalHighs.indexOf(pivot), 1)
          break
        }
      }

      // ===== CHECK FOR BEARISH INTERNAL BREAKS =====
      for (const pivot of internalLows) {
        if (pivot.index < i && close < pivot.price) {
          if (internalTrend === 1) {
            // Internal CHoCH: Minor trend reversal to bearish
            for (let j = pivot.index; j <= i; j++) {
              results[j].internalChochBear = pivot.price
            }
            console.log(`Internal CHoCH Bear: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            internalTrend = -1
          } else {
            // Internal BOS: Minor trend continuation bearish
            for (let j = pivot.index; j <= i; j++) {
              results[j].internalBosBear = pivot.price
            }
            console.log(`Internal BOS Bear: pivot=${pivot.index} break=${i} price=${pivot.price}`)
            internalTrend = -1
          }
          internalLows.splice(internalLows.indexOf(pivot), 1)
          break
        }
      }
    }

    /**
     * RETURN RESULTS
     *
     * Each result object contains price levels for rendering:
     * - Non-null values create horizontal lines (connected by KLineChart)
     * - Null/undefined values create gaps (no rendering)
     * - Consecutive identical values form continuous horizontal lines
     */
    return results
  }
}

export default smartMoneyConcepts

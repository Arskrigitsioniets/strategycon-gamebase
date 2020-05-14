
import feather from 'feather-icons'

import { getValue } from '../utils/getValue'
import { applyRating } from '../utils/applyRating'
import * as steamRatingProvider from "../utils/steamRatingProvider"


const noDataText = '—'

function getRatingColor(rating) {
  if (rating < 40.0) {
    return "red"
  } else if (rating < 61.0) {
    return "orange"
  } else {
    return "green"
  }
}

function transformRating(rating) {
  const text = Math.round(rating) + '%'
  const color = getRatingColor(rating)

  return {
    text,
    color,
    html: '<b class="steam-rating">' + text + ' ' + feather.icons['thumbs-up'].toSvg({ color }) + '</b>',
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  if (params.value) {
    return params.value.text;
  }
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const el = params.eGridCell
  const rating = getValue(params)
  const gameId = params.data.steam_gameid

  if (gameId) {
    if (rating) {
      applyRating(el, rating)
    } else {
      steamRatingProvider.get(gameId)
        .then(transformRating)
        .then(rating => {
          params.setValue(rating)
          applyRating(el, rating)
        })
        .catch(() => {
          el.innerText = noDataText
        })
    }
  } else {
    el.innerText = noDataText
  }
}

export const field = {
  headerName: "Steam",
  getQuickFilterText,
  cellRenderer
}

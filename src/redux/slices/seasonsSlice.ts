import { Season } from "@models/quest"
import { RootState } from "@redux/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

export interface SeasonsStore {
  seasons: Season[]
}

export const initialState: SeasonsStore = {
  seasons: [],
}

export const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    setSeasons: (state, action: PayloadAction<Season[]>) => {
      state.seasons = action.payload
    },
    updateSeason: (state, action: PayloadAction<Season>) => {
      const season = action.payload
      const index = state.seasons.findIndex((s) => s.id === season.id)
      if (index >= 0) {
        state.seasons[index] = season
      }
    },
  },
})

export const { setSeasons, updateSeason } = seasonsSlice.actions
export const seasons = (state: RootState) => state.seasons
export const useSeasons = () => useSelector(seasons)
export default seasonsSlice.reducer

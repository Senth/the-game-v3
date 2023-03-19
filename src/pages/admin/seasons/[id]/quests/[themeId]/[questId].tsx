import React from 'react'

import AdminPage from '@components/pages/Admin'
import { useSeasons, useSeasonsMutate } from '@hooks/api/seasons'
import EditLabel from '@components/admin/EditLabel'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Quest, QuestTheme, Season } from '@models/quest'

export default function QuestPage(): JSX.Element {
  const seasons = useSeasons()
  const mutateSeason = useSeasonsMutate()
  const router = useRouter()

  const { id, themeId, questId } = router.query
  const themeIndex = parseInt(themeId as string)
  const questIndex = parseInt(questId as string)
  console.log(`Season ${id}, theme ${themeId}, quest ${questId}`)
  console.log(router.query)

  if (seasons.isLoading) {
    return <p>Loading...</p>
  }

  // Find the season
  const season = seasons.data?.find((season) => season.id === id) || { title: '', themes: [] }

  let theme: QuestTheme | undefined
  if (season.themes.length <= themeIndex) {
    return <p>Theme not found</p>
  }
  theme = season.themes[themeIndex]

  let quest: Quest | undefined
  if (theme.quest && theme.quests.length <= questIndex) {
    return <p>Quest not found in theme</p>
  }
  quest = theme.quests[questIndex]

  return (
    <AdminPage>
      {seasons.isLoading && <p>Loading...</p>}
      {seasons.error && <p>Error</p>}
      {season && (
        <>
          <h2>
            {season.title}: {theme.title}
          </h2>
          <h3>{quest.title}</h3>
        </>
      )}
    </AdminPage>
  )
}

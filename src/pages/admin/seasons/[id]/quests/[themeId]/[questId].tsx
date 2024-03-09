"use client"

import React, { useState } from "react"

import AdminPage from "@components/pages/Admin"
import { useSeasons, useSeasonsMutate } from "@hooks/api/seasons"
import EditLabel from "@components/admin/EditLabel"
import Edit from "@components/admin/Edit"
import EditArea from "@components/admin/EditArea"
import EditFile from "@components/admin/EditFile"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Quest, QuestTheme, Season } from "@models/quest"
import { AssetResponse } from "@models/api/asset"

export default function QuestPage(): JSX.Element {
  const seasons = useSeasons()
  const router = useRouter()

  const { id, themeId, questId } = router.query
  const themeIndex = parseInt(themeId as string)
  const questIndex = parseInt(questId as string)
  console.log(`Season ${id}, theme ${themeId}, quest ${questId}`)
  console.log(router.query)

  if (seasons.isLoading) {
    return <p>Loading...</p>
  }

  if (seasons.error) {
    return <p>Error</p>
  }

  // Find the season
  const season = seasons.data?.find((season) => season.id === id) || { title: "", themes: [] }

  let theme: QuestTheme | undefined
  if (season.themes.length <= themeIndex) {
    return <p>Theme not found</p>
  }
  theme = season.themes[themeIndex]

  let quest: Quest | undefined
  if (theme.quests && theme.quests.length <= questIndex) {
    return <p>Quest not found in theme</p>
  }
  quest = theme.quests[questIndex]

  return (
    <AdminPage>
      <h2>
        {season.title}: {theme.title}
      </h2>
      <h3>Quest</h3>
      <hr />
      <QuestEdit season={season} quest={quest} />
      <Hints season={season} quest={quest} />
    </AdminPage>
  )
}

function QuestEdit(props: { season: Season; quest: Quest }): JSX.Element {
  const { season, quest } = props
  const mutateSeason = useSeasonsMutate()

  async function handleAssetUpload(file: File) {
    console.log(`Uploading file: ${file.name}`)

    // Upload the file
    const formData = new FormData()
    formData.append("file", file)

    // Make a request to the server
    fetch("/api/admin/assets", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Failed to upload file: ${response.statusText}`)
        }

        return response.json()
      })
      .then((data: AssetResponse) => {
        quest.asset = data.publicUrl
        mutateSeason.update(season)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function handleDelete() {
    const filename = quest.asset?.split("/").pop()
    console.log(`Deleting asset ${filename}`)

    // Make a request to the server
    fetch(`/api/admin/assets?id=${filename}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status !== 204) {
          throw new Error(`Failed to delete file: ${response.statusText}`)
        }

        quest.asset = ""
        mutateSeason.update(season)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
      <Edit
        element="h3"
        value={quest.title}
        onChange={(title) => {
          quest.title = title
          mutateSeason.update(season)
        }}
      />
      <EditLabel
        name="Description"
        value={quest.description}
        onChange={(description) => {
          quest.description = description
          mutateSeason.update(season)
        }}
      />
      <EditLabel
        name="Display Title"
        value={quest.displayTitle}
        onChange={(displayTitle) => {
          quest.displayTitle = displayTitle
          mutateSeason.update(season)
        }}
      />
      <EditLabel
        name="Points"
        value={quest.points?.toString()}
        onChange={(points) => {
          quest.points = parseInt(points)
          mutateSeason.update(season)
        }}
      />
      <EditLabel
        name="Image URL"
        value={quest.imageUrl}
        onChange={(imageUrl) => {
          quest.imageUrl = imageUrl
          mutateSeason.update(season)
        }}
      />
      <EditFile name="Asset" value={quest.asset} onSubmit={handleAssetUpload} onDelete={handleDelete} />
      <EditArea
        value={quest.content}
        onChange={(content) => {
          quest.content = content
          mutateSeason.update(season)
        }}
      />
      <EditLabel
        name="Answer"
        value={quest.answer}
        onChange={(answer) => {
          quest.answer = answer.toLowerCase()
          mutateSeason.update(season)
        }}
      />
    </>
  )
}

function Hints(props: { season: Season; quest: Quest }): JSX.Element {
  const { season, quest } = props
  const mutateSeason = useSeasonsMutate()
  const [fromIndex, setFromIndex] = useState(-1)

  function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, index: number): void {
    e.dataTransfer.setData("text/plain", e.currentTarget.id)
    setFromIndex(index)
  }

  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>): void {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  function handleDrop(e: React.DragEvent<HTMLTableRowElement>, index: number): void {
    e.preventDefault()
    console.log("Drop", fromIndex, index)
    const moveRow = quest.hints[fromIndex]
    quest.hints.splice(fromIndex, 1)
    quest.hints.splice(index, 0, moveRow)
    mutateSeason.update(season)
  }

  return (
    <>
      <hr />
      <h3>Hints</h3>
      <table>
        <thead>
          <tr>
            <th>Text</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {quest.hints.map((hint, index) => (
            <tr
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Edit
                element="td"
                value={hint.text}
                onChange={(text) => {
                  hint.text = text
                  mutateSeason.update(season)
                }}
              />
              <Edit
                element="td"
                value={hint.points?.toString()}
                onChange={(points) => {
                  hint.points = parseInt(points)
                  mutateSeason.update(season)
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <AddHintButton
        onClick={() => {
          quest.hints.push({ text: "New", points: 0 })
          mutateSeason.update(season)
        }}
      >
        Add Hint
      </AddHintButton>
    </>
  )
}

const AddHintButton = styled.button`
  margin: ${(props) => props.theme.spacing.normal} 0;
`

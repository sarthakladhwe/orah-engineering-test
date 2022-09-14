import React, {createContext} from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"

interface IAppContext {
  name: string
}

export const AppContext = createContext<IAppContext | null>(null)

function App() {

  const contextValue = {
    name: "something"
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Header />
      <Routes>
        <Route path="daily-care" element={<HomeBoardPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="*" element={<div>No Match</div>} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App

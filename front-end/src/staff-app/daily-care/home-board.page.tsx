import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"

type SortType = "First Name" | "Last Name"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [students, setStudents] = useState<Person[]>()

  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [sortType, setSortType] = useState<SortType>("First Name")

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if(data && loadState === "loaded") setStudents(data.students)
  }, [loadState])

  // Search Action
  const onSearchAction = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
  }

  useEffect(() => {
    if(isSearchEnabled && data) {
      const searchedStudents = data.students.filter(student => {
        if (searchText == "") return student
        const fullname = PersonHelper.getFullName(student).toLowerCase()
        return fullname.includes(searchText.toLowerCase())
      })
      setStudents(searchedStudents)
    }
  }, [searchText])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      setSortType(sortType === "First Name" ? "Last Name" : "First Name")
    } else if (action === "search") {
      setIsSearchEnabled(!isSearchEnabled)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar 
          onItemClick={onToolbarAction}
          isSearchEnabled={isSearchEnabled}
          searchText={searchText}
          onSearchAction={onSearchAction}
          sortType={sortType}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && students && (
          <>
            {students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

// Toolbar Component

type ToolbarAction = "roll" | "sort" | "search"

interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  isSearchEnabled: boolean
  searchText: string
  onSearchAction: (event: React.ChangeEvent<HTMLInputElement>) => void
  sortType: SortType
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, isSearchEnabled, searchText, onSearchAction, sortType } = props

  return (
    <S.ToolbarContainer>
      <S.SortContainer>
        <S.Button onClick={() => onItemClick("sort")}>{sortType}</S.Button>
      </S.SortContainer>
      <S.SearchContainer>
        {
          isSearchEnabled ?
          <S.SearchInputContainer>
            <S.Input type="text" placeholder="search..." value={searchText} onChange={onSearchAction} autoFocus />
            <FontAwesomeIcon onClick={() => onItemClick("search")} icon={faWindowClose} style={{fontSize: "1.4rem", cursor: "pointer"}} />
          </S.SearchInputContainer> :
          <S.Button onClick={() => onItemClick("search")}>Search</S.Button>
        }
      </S.SearchContainer>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SearchContainer: styled.div`
    
  `,
  SearchInputContainer: styled.div`
    display: flex;
    justify-content: center;
  `,
  Input: styled.input`
    outline: #777;
  `,
  SortContainer: styled.div`
    
  `
}

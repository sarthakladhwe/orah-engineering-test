import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faSortDown, faSortUp, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { useApi } from "shared/hooks/use-api"
import { StudentContext, StudentContextInterface } from "../../staff-app/context/studentContext"

type SortType = "First Name" | "Last Name"

export const HomeBoardPage: React.FC = () => {

  const studentDataContext = useContext<StudentContextInterface | null>(StudentContext)

  const [saveRoll, rollData, rollLoadState] = useApi<{}>({ url: "save-roll" })
  const [isRollMode, setIsRollMode] = useState(false)
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false)
  const [sortType, setSortType] = useState<SortType>("First Name")

  if (!studentDataContext) return null;
  const { loadState, students, studentRoll, resetStudents, resetStudentsRoll } = studentDataContext;

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
    if (action === "exit" && resetStudents) {
      setIsRollMode(false)
      resetStudents()
    } else if (action === "filter" && studentRoll && resetStudents) {
      setIsRollMode(false)
      saveRoll(studentRoll)
      resetStudentsRoll()
      resetStudents()
    }
  }

  return (
    <>
    {!loadState && <h1>Spin</h1>}
      <S.PageContainer>
        <Toolbar 
          onItemClick={onToolbarAction}
          isSearchEnabled={isSearchEnabled}
          sortType={sortType}
        />

        {!loadState && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && students && (
          <>
            {students.map((s) => (
              <StudentListTile 
                key={s.id} 
                isRollMode={isRollMode} 
                student={s}
              />
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
  sortType: SortType
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, isSearchEnabled, sortType } = props
  
  const studentDataContext = useContext<StudentContextInterface | null>(StudentContext)
  if (!studentDataContext) return null;
  const {onSortAction, onSearchAction} = studentDataContext
  
  const [searchText, setSearchText] = useState<string>("")

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
  }

  useEffect(() => {
    if(isSearchEnabled && onSearchAction) {
      onSearchAction(searchText, true)
    } else if(!isSearchEnabled && onSearchAction) {
      setSearchText("")
      onSearchAction(searchText, false)
    }
  }, [searchText, isSearchEnabled])

  return (
    <S.ToolbarContainer>
      <S.SortContainer>
        <S.Button onClick={() => onItemClick("sort")}>{sortType}</S.Button>
          {
            onSortAction &&
            <S.SortIcons>
              <FontAwesomeIcon 
                icon={faSortUp} 
                onClick={() => onSortAction("descending", sortType)} 
                style={{cursor: "pointer"}} 
              />
              <FontAwesomeIcon 
                icon={faSortDown} 
                onClick={() => onSortAction("ascending", sortType)} 
                style={{cursor: "pointer"}} 
              />
            </S.SortIcons>
          }
      </S.SortContainer>
      <S.SearchContainer>
        {
          isSearchEnabled ?
          <S.SearchInputContainer>
            <S.Input type="text" placeholder="search..." value={searchText} onChange={onInputChange} autoFocus />
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
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  SortIcons: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
}

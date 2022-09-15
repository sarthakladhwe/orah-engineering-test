import React, {useContext} from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { StudentContext, StudentContextInterface } from "staff-app/context/studentContext"

interface Props {
  stateList: StateList[]
  size?: number
  activityId?: number
  selectedRollType?: (value: ItemType, activity_id: number) => void
}

export const RollStateList: React.FC<Props> = ({ stateList, size = 14, activityId, selectedRollType }) => {

  const studentContextData = useContext<StudentContextInterface | null>(StudentContext)

  const onFilterRollType = studentContextData && studentContextData.onFilterRollType

  const onClick = (type: ItemType) => {
    if (selectedRollType && activityId) {
      selectedRollType(type, activityId)
    } else if (onFilterRollType) {
      onFilterRollType(type)
    }
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

export type ItemType = RolllStateType | "all"

import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Person } from 'shared/models/person'
import { Colors } from 'shared/styles/colors'
import { BorderRadius, FontWeight, Spacing } from 'shared/styles/styles'
import { ItemType } from 'staff-app/components/roll-state/roll-state-list.component'
import { StudentListTile } from 'staff-app/components/student-list-tile/student-list-tile.component'
import styled from 'styled-components'

type Props = {
  isActive: boolean
  studentRollData: Person[]
  changeStudentRollActive: (value: boolean) => void
  selectedStudRollType: ItemType
}

const StudentRollOverlay: React.FC<Props> = ({isActive, studentRollData, changeStudentRollActive, selectedStudRollType}) => {
  return (
    <S.Container isActive={isActive}>
      <S.Overlay>
        <S.ModalHeader>
          {
            selectedStudRollType === "all" ?
            <S.HeaderText>All students</S.HeaderText> :
            <S.HeaderText>Students who were marked {selectedStudRollType}</S.HeaderText>
          }
          <FontAwesomeIcon icon={faWindowClose} style={{cursor: "pointer"}} onClick={() => changeStudentRollActive(false)} />
        </S.ModalHeader>
        <S.ModalBody>
          { 
            studentRollData.length ?
            studentRollData.map((s) => (
              <StudentListTile
                key={s.id}
                student={s}
              />
            )) :
            <div>
              No Student Data
            </div>
          }
        </S.ModalBody>
      </S.Overlay>
    </S.Container>
  )
}

const S = {
  Container: styled.div<{ isActive: boolean }>`
    display: ${({ isActive }) => (isActive ? "block" : "none")};;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: ${({ isActive }) => (isActive ? "100vh" : 0)};
    background-color: rgba(0,0,0,0.4);
  `,
  Overlay: styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 400px;
    width: 50%;
    background-color: #fff;
    overflow: auto;
    backdrop-filter: blur(2px);
    border-radius: ${BorderRadius.default};
  `,
  ModalHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 0.5em 0.8em;
    font-weight: ${FontWeight.strong};
  `,
  HeaderText: styled.h4`
    margin: 5px 0;
  `,
  ModalBody: styled.div`
    padding: 1em;
  `
}

export default StudentRollOverlay
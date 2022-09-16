import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { ItemType, RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import StudentRollOverlay from "./student-roll-overlay"
import { StudentContext, StudentContextInterface } from "staff-app/context/studentContext"
import { Person } from "shared/models/person"

type filterType = "present" | "late" | "absent"

export const ActivityPage: React.FC = () => {

  const studentContextData = useContext<StudentContextInterface | null>(StudentContext)

  const [getRolls, rollData, rollLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [isStudentRollActive, setIsStudentRollActive] = useState<boolean>(false)
  const [studentRollData, setStudentRollData] = useState<Person[] | null>(null)
  const [selectedStudRollType, setSelectedStudRollType] = useState<ItemType>("all")

  useEffect(() => {
    void getRolls()
  }, [getRolls])

  if(!studentContextData) return null
  const { students } = studentContextData

  const checkRollCount = (value: filterType, studentRolls: {student_id: number, roll_state: string}[]): number => {
    const filteredRolls = studentRolls.filter(student => student.roll_state === value)
    return filteredRolls ? filteredRolls?.length : 0
  }

  const changeStudentRollActive = (value: boolean): void => {
    setIsStudentRollActive(value)
  }

  const selectedRollType = (rollTypeSelected: ItemType, activity_id: number) => {
    setSelectedStudRollType(rollTypeSelected)
    if(rollData) {
      const activitySelected = rollData.activity.filter(act => act.entity.id === activity_id)[0].entity.student_roll_states
      const studentRollState = activitySelected.filter(student => rollTypeSelected === "all" ? student : student.roll_state === rollTypeSelected)
      const filteredStudents = students.filter(student => {
        return studentRollState?.filter(s => s.student_id === student.id).length ? true : false
      })
      changeStudentRollActive(true)
      setStudentRollData(filteredStudents)
    }
  }

  console.log("Final list of students", studentRollData)

  return (
    <>
      <S.Container>
        {rollLoadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="3x" spin />
          </CenteredContainer> 
        )}

        {rollLoadState === "loaded" && rollData && (
          <>
            {
              rollData.activity.length ?
              rollData.activity.map(act => (
                <S.StudentRollContainer key={act.entity.id} >
                  <S.RollData>
                    <h2>
                      {act.entity.name}
                    </h2>
                    <S.DateContainer>
                      {new Date(act.entity.completed_at).toLocaleDateString()}
                    </S.DateContainer>
                  </S.RollData>
                  <S.RollContent>
                    <RollStateList
                      stateList={[
                        { type: "all", count: act.entity.student_roll_states.length },
                        { type: "present", count: checkRollCount("present", act.entity.student_roll_states) },
                        { type: "late", count: checkRollCount("late", act.entity.student_roll_states) },
                        { type: "absent", count: checkRollCount("absent", act.entity.student_roll_states) },
                      ]}
                      selectedRollType={selectedRollType}
                      activityId={act.entity.id}
                    />
                  </S.RollContent>
                </S.StudentRollContainer>
              )) :
              <S.StudentRollContainer>
                <S.RollData>
                  <h3>No Saved Roll Activity</h3>
                </S.RollData>
              </S.StudentRollContainer>
            }
          </>
        )}

        {rollLoadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.Container>
      {studentRollData &&
        <StudentRollOverlay 
          isActive={isStudentRollActive} 
          studentRollData={studentRollData} 
          changeStudentRollActive={changeStudentRollActive}
          selectedStudRollType={selectedStudRollType}
        />
      }
    </>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  StudentRollContainer: styled.div`
    margin-top: ${Spacing.u3};
    padding: ${Spacing.u2};
    display: flex;
    flex-direction: column;
    border-radius: ${BorderRadius.default};
    background: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  RollData: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  RollContent: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: ${Spacing.u4};
    padding: ${Spacing.u2} 0;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  DateContainer: styled.p`
    font-size: 0.75rem;
    font-weight: 500;
  `
}

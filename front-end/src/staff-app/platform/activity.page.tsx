import React, { useEffect } from "react"
import styled from "styled-components"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { RollInput } from "shared/models/roll"

type filterType = "present" | "late" | "absent"

export const ActivityPage: React.FC = () => {

  const [getRolls, rollData, rollLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getRolls()
  }, [getRolls])

  console.log(rollData)

  const checkRollCount = (value: filterType, studentRolls: {student_id: number, roll_state: string}[]): number => {
    const filteredRolls = studentRolls.filter(student => student.roll_state === value)
    return filteredRolls ? filteredRolls?.length : 0
  }

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
              rollData.activity.map(act => (
                <S.StudentRollContainer>
                  <S.RollData>
                    <h2 style={{margin: "0"}}>
                      {act.entity.name}
                    </h2>
                    <p>
                      {act.entity.completed_at}
                    </p>
                  </S.RollData>
                  <S.RollContent>
                    <RollStateList
                      stateList={[
                        { type: "all", count: act.entity.student_roll_states.length },
                        { type: "present", count: checkRollCount("present", act.entity.student_roll_states) },
                        { type: "late", count: checkRollCount("present", act.entity.student_roll_states) },
                        { type: "absent", count: checkRollCount("present", act.entity.student_roll_states) },
                      ]}
                    />
                  </S.RollContent>
                </S.StudentRollContainer>
              ))
            }
          </>
        )}

        {rollLoadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.Container>
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
  `
}

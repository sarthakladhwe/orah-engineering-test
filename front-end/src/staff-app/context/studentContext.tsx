import React, {useState, useEffect, createContext} from 'react'
import { useApi } from 'shared/hooks/use-api'
import { Person, PersonHelper } from "shared/models/person"
import { RollInput, RolllStateType } from 'shared/models/roll'

export interface StudentContextInterface {
    //students: Person[],
    studentRoll: RollInput,
    updateStudentRoll: (student_id: number, newState: RolllStateType) => void
}

const StudentContext = createContext<StudentContextInterface | null>(null)

type Props = {
    children: any
}

const StudentContextProvider = (props: Props) => {

    const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
    const [students, setStudents] = useState<Person[]>()
    const [studentRoll, setStudentRoll] = useState<RollInput>()
    const [studentDataContext, setStudentDataContext] = useState<StudentContextInterface | null>(null)

    useEffect(() => {
    void getStudents()
    }, [getStudents])
    
    useEffect(() => {
    if(data && loadState === "loaded") {
        setStudents(data.students)
        setStudentRoll({
        student_roll_states: data.students.map(s => ({
            student_id: s.id,
            roll_state: "unmark"
        }))
        })
    }
    }, [loadState])

    useEffect(() => {
        if(students && studentRoll) {
            setStudentDataContext({
                //students,
                studentRoll,
                updateStudentRoll
            })
        }
    }, [students, studentRoll])

    const updateStudentRoll = (student_id: number, newState: RolllStateType) => {
        if(studentRoll?.student_roll_states.length) {
            setStudentRoll(prevStudentRoll => {
                if(prevStudentRoll?.student_roll_states) {
                    return {
                        student_roll_states: prevStudentRoll?.student_roll_states.map(stud => (
                        stud.student_id === student_id ? 
                        {
                            student_id: stud.student_id,
                            roll_state: newState
                        } :
                        stud
                        ))
                    }
                }
            })
        }
    }

    // console.log("context students", students)
    // console.log("context student roll", studentRoll)

  return (
    <StudentContext.Provider value={studentDataContext}>
        {props.children}
    </StudentContext.Provider>
  )
}

export {StudentContextProvider, StudentContext}
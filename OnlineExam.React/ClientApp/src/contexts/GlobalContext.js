import AuthContextProvider from "./AuthContext"
import SubjectContextProvider from "./SubjectContext"
import ClassroomContextProvider from "./ClassroomContext"
import AccountContextProvider from "./AccountContext"
import React from "react"
import QuestionContextProvider from "./QuestionContext"
import ExamContextProvider from "./ExamContext"

export const GlobalContextProvider = ({ children }) => {

    // 
    return (
        <AuthContextProvider>
            <SubjectContextProvider>
                <ClassroomContextProvider>
                    <AccountContextProvider>
                        <QuestionContextProvider>
                            <ExamContextProvider>
                                {children}
                            </ExamContextProvider>
                        </QuestionContextProvider>
                    </AccountContextProvider>
                </ClassroomContextProvider>
            </SubjectContextProvider>
        </AuthContextProvider>
    )
}
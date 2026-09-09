import { createContext, useContext, useMemo, useState } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import {
  SCHOOL_YEARS,
  seedClasses,
  seedStudents,
  seedTeacherAccounts,
  seedManagerInfo,
  seedCompanies,
  seedMenu,
  seedEvaluations,
  seedDocuments,
  seedRegistrations,
  seedParentEvaluations,
  DEFAULT_MEAL_PRICE,
} from '../data/mockData'

const AppContext = createContext(null)

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export function AppProvider({ children }) {
  const [schoolYear, setSchoolYear] = useState('2026 - 2027')
  const [selectedDate, setSelectedDate] = useState('2026-09-09')
  const [searchTerm, setSearchTerm] = useState('')

  const [students, setStudents] = useLocalStorageState('students', seedStudents)
  const [classes, setClasses] = useLocalStorageState('classes', seedClasses)
  const [teachers, setTeachers] = useLocalStorageState('teachers', seedTeacherAccounts)
  const [managerInfo, setManagerInfo] = useLocalStorageState('managerInfo', seedManagerInfo)
  const [companies, setCompanies] = useLocalStorageState('companies', seedCompanies)
  const [menu, setMenu] = useLocalStorageState('menu', seedMenu)
  const [menuDetails, setMenuDetails] = useLocalStorageState('menuDetails', {})
  const [evaluations, setEvaluations] = useLocalStorageState('evaluations', seedEvaluations)
  const [documents, setDocuments] = useLocalStorageState('documents', seedDocuments)
  const [registrations, setRegistrations] = useLocalStorageState('registrations', seedRegistrations)
  const [parentEvaluations, setParentEvaluations] = useLocalStorageState('parentEvaluations', seedParentEvaluations)

  const addStudent = (data) => setStudents((prev) => [...prev, { id: uid('s'), ...data }])
  const updateStudent = (id, data) => setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  const removeStudent = (id) => setStudents((prev) => prev.filter((s) => s.id !== id))

  const addClass = (data) => setClasses((prev) => [...prev, { id: uid('c'), ...data }])
  const updateClass = (id, data) => setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const removeClass = (id) => setClasses((prev) => prev.filter((c) => c.id !== id))

  const addTeacher = (data) => setTeachers((prev) => [...prev, { id: uid('t'), ...data }])
  const updateTeacher = (id, data) => setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
  const removeTeacher = (id) => setTeachers((prev) => prev.filter((t) => t.id !== id))

  const addCompany = (data) => setCompanies((prev) => [...prev, { id: uid('cty'), ...data }])
  const updateCompany = (id, data) => setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const removeCompany = (id) => setCompanies((prev) => prev.filter((c) => c.id !== id))

  const updateMenuCell = (day, meal, value) =>
    setMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }))
  const updateMenuDetails = (day, meal, detail) =>
    setMenuDetails((prev) => ({ ...prev, [`${day}::${meal}`]: detail }))

  const addEvaluation = (data) => setEvaluations((prev) => [{ id: uid('e'), ...data }, ...prev])
  const removeEvaluation = (id) => setEvaluations((prev) => prev.filter((e) => e.id !== id))

  const addDocument = (data) => setDocuments((prev) => [{ id: uid('d'), ...data }, ...prev])
  const removeDocument = (id) => setDocuments((prev) => prev.filter((d) => d.id !== id))

  const addRegistration = (data) => setRegistrations((prev) => [{ id: uid('r'), ...data }, ...prev])

  const stats = useMemo(() => {
    const tongHocSinh = students.length
    const banTru = students.filter((s) => s.trangThai === 'Bán trú').length
    const khongBanTru = students.filter((s) => s.trangThai === 'Không bán trú').length
    const chiNgu = students.filter((s) => s.trangThai === 'Chỉ ngủ bán trú').length
    const soLop = classes.length
    const daDiemDanh = evaluations.filter((e) => e.ngay === selectedDate).length
    return {
      tongHocSinh,
      tongSuatBanTru: banTru,
      soLop,
      daDiemDanh,
      banTru,
      khongBanTru,
      chiNgu,
    }
  }, [students, classes, evaluations, selectedDate])

  const value = {
    schoolYear, setSchoolYear, schoolYears: SCHOOL_YEARS,
    selectedDate, setSelectedDate,
    searchTerm, setSearchTerm,
    students, addStudent, updateStudent, removeStudent,
    classes, addClass, updateClass, removeClass,
    teachers, addTeacher, updateTeacher, removeTeacher,
    managerInfo, setManagerInfo,
    companies, addCompany, updateCompany, removeCompany,
    menu, updateMenuCell, menuDetails, updateMenuDetails,
    evaluations, addEvaluation, removeEvaluation,
    documents, addDocument, removeDocument,
    registrations, addRegistration,
    parentEvaluations, setParentEvaluations,
    mealPrice: DEFAULT_MEAL_PRICE,
    stats,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import LoginPage from "../login-page"
import InspectionListEnhanced from "../inspection-list-enhanced"
import InspectionForm from "../inspection-form"
import InspectionSteps from "../inspection-steps"
import InspectionFinalization from "../components/inspection-finalization"
import { InspectionItemsList } from "../components/inspection-items-list"
import { InspectionItemEditor } from "../components/inspection-item-editor"
import UserProfile from "../user-profile"
import type { Inspection, InspectionItem } from "@/lib/api"

type ViewType = "login" | "list" | "form" | "steps" | "finalization" | "profile" | "items-list" | "item-editor"

export default function Page() {
  const [currentView, setCurrentView] = useState<ViewType>("login")
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null)
  const [currentInspectionId, setCurrentInspectionId] = useState<string | null>(null)
  const [currentItem, setCurrentItem] = useState<InspectionItem | null>(null)

  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setCurrentView("list")
      } else {
        setCurrentView("login")
      }
    }
  }, [isAuthenticated, loading])

  const handleLoginSuccess = () => {
    setCurrentView("list")
  }

  const handleCreateNew = () => {
    setEditingInspection(null)
    setCurrentView("form")
  }

  const handleEdit = (inspection: Inspection) => {
    setEditingInspection(inspection)
    setCurrentInspectionId(inspection.id)
    setCurrentView("items-list")
  }

  const handleInspectionCreated = (inspectionId: string) => {
    setCurrentInspectionId(inspectionId)
    setCurrentView("steps")
  }

  const handleInspectionFinalized = (inspectionId: string) => {
    setCurrentInspectionId(inspectionId)
    setCurrentView("finalization")
  }

  const handleBackToList = () => {
    setEditingInspection(null)
    setCurrentInspectionId(null)
    setCurrentItem(null)
    setCurrentView("list")
  }

  const handleBackToItemsList = () => {
    setCurrentItem(null)
    setCurrentView("items-list")
  }

  const handleEditItem = (item: InspectionItem) => {
    setCurrentItem(item)
    setCurrentView("item-editor")
  }

  const handleShowProfile = () => {
    setCurrentView("profile")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentView === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentView === "list" && (
        <InspectionListEnhanced onCreateNew={handleCreateNew} onEdit={handleEdit} onShowProfile={handleShowProfile} />
      )}
      {currentView === "form" && (
        <InspectionForm
          onBack={handleBackToList}
          onInspectionCreated={handleInspectionCreated}
          editingInspection={editingInspection}
        />
      )}
      {currentView === "steps" && currentInspectionId && (
        <InspectionSteps
          inspectionId={currentInspectionId}
          onBack={handleBackToList}
          onFinalize={handleInspectionFinalized}
        />
      )}
      {currentView === "finalization" && currentInspectionId && (
        <InspectionFinalization inspectionId={currentInspectionId} onBack={handleBackToList} />
      )}
      {currentView === "profile" && <UserProfile onBack={handleBackToList} />}
      {currentView === "items-list" && currentInspectionId && editingInspection && (
        <InspectionItemsList
          inspectionId={currentInspectionId}
          inspectionData={editingInspection}
          onBack={handleBackToList}
          onEditItem={handleEditItem}
        />
      )}
      {currentView === "item-editor" && currentInspectionId && currentItem && (
        <InspectionItemEditor
          inspectionId={currentInspectionId}
          item={currentItem}
          onBack={handleBackToItemsList}
          onSave={handleBackToItemsList}
        />
      )}
    </>
  )
}

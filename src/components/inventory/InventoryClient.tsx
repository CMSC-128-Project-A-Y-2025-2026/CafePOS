"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import type { InventoryItem } from "@/app/inventory/types"
import InventoryHeader from "@/components/inventory/InventoryHeader"
import InventoryActions from "@/components/inventory/InventoryActions"
import InventoryTable from "@/components/inventory/InventoryTable"
import InventoryProductModal from "@/components/inventory/InventoryProductModal"
import DeleteConfirmationModal from "@/components/inventory/DeleteConfirmationModal"
import WeeklyReportModal from "@/components/inventory/WeeklyReportModal"

type InventorySaveData = Omit<InventoryItem, "id"> & { id?: string }

interface InventoryClientProps {
  initialInventory: InventoryItem[]
}

export default function InventoryClient({ initialInventory }: InventoryClientProps) {
  const router = useRouter()

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(null)
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null)
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventory)
  const [activeStatusFilter, setActiveStatusFilter] = useState("all")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  // --- Handlers ---
  const handleLogoClick = () => router.push("/")
  const handleOrderClick = () => router.push("/order")
  const handleAnalyticsClick = () => router.push("/analytics")
  const handleInventoryClick = () => setIsDropdownOpen(false)

  const handleAddProduct = async (newProduct: InventorySaveData) => {
    try {
      const costValue = newProduct.cost ? Number.parseInt(newProduct.cost.toString().replace("PHP ", "")) : 0

      const response = await fetch("/api/inventory/createItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: newProduct.product,
          category: newProduct.category,
          stock: newProduct.stock,
          cost: costValue,
          status: newProduct.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create product")
      }

      const result = await response.json()

      const createdItem: InventoryItem = {
        id: result.data[0].item_id,
        product: result.data[0].item_name,
        category: result.data[0].item_category,
        stock: result.data[0].stock,
        status: result.data[0].stock_status,
        cost: `PHP ${result.data[0].item_cost}`,
      }

      setInventoryData((currentData) => [createdItem, ...currentData])
      setIsAddModalOpen(false)
    } catch (err) {
      console.error("[Add Product Error]", err)
      alert(err instanceof Error ? err.message : "Failed to add product")
    }
  }

  const handleEditProduct = async (updatedProduct: InventorySaveData) => {
    if (updatedProduct.id === undefined) {
      console.error("Attempted to edit product without ID.")
      return
    }

    try {
      const costValue = updatedProduct.cost
        ? Number.parseInt(updatedProduct.cost.toString().replace("PHP ", ""))
        : undefined

      const response = await fetch("/api/inventory/editItem", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updatedProduct.id,
          product: updatedProduct.product,
          category: updatedProduct.category,
          stock: updatedProduct.stock,
          cost: costValue,
          status: updatedProduct.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update product")
      }

      const result = await response.json()

      const updatedItem: InventoryItem = {
        id: result.data[0].item_id,
        product: result.data[0].item_name,
        category: result.data[0].item_category,
        stock: result.data[0].stock,
        status: result.data[0].stock_status,
        cost: `PHP ${result.data[0].item_cost}`,
      }

      setInventoryData((currentData) => currentData.map((item) => (item.id === updatedProduct.id ? updatedItem : item)))
      setProductToEdit(null)
    } catch (err) {
      console.error("[Edit Product Error]", err)
      alert(err instanceof Error ? err.message : "Failed to edit product")
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch("/api/inventory/removeItem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete product")
      }

      setInventoryData((currentData) => currentData.filter((item) => item.id !== productToDelete.id))
      setProductToDelete(null)
    } catch (err) {
      console.error("[Delete Product Error]", err)
      alert(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  const filteredInventory = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = inventoryData
      .filter((item) => {
        if (activeStatusFilter === "all") return true
        return item.status === activeStatusFilter
      })
      .filter((item) => {
        return (
          item.product.toLowerCase().includes(lowerSearchTerm) || item.category.toLowerCase().includes(lowerSearchTerm)
        )
      })

    filtered.sort((a, b) => a.product.localeCompare(b.product))
    return filtered
  }, [inventoryData, activeStatusFilter, searchTerm])

  return (
    <>
      {/* --- Modals --- */}
      {isAddModalOpen && (
        <InventoryProductModal
          title="Add New Product"
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
        />
      )}
      {productToEdit && (
        <InventoryProductModal
          title="Edit Product"
          initialData={productToEdit}
          onClose={() => setProductToEdit(null)}
          onSave={handleEditProduct}
        />
      )}
      {productToDelete && (
        <DeleteConfirmationModal
          productName={productToDelete.product}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
      {isReportModalOpen && <WeeklyReportModal inventory={inventoryData} onClose={() => setIsReportModalOpen(false)} />}

      {/* Header */}
      <InventoryHeader
        formattedTime={formattedTime}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleLogoClick={handleLogoClick}
        handleOrderClick={handleOrderClick}
        handleAnalyticsClick={handleAnalyticsClick}
        handleInventoryClick={handleInventoryClick}
      />

      {/* Action Buttons, Filter Pills, Search Bar */}
      <InventoryActions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeStatusFilter={activeStatusFilter}
        setActiveStatusFilter={setActiveStatusFilter}
        onAddProductClick={() => setIsAddModalOpen(true)}
        onGenerateReportClick={() => setIsReportModalOpen(true)}
      />

      {/* Main Table Content */}
      <InventoryTable
        filteredInventory={filteredInventory}
        setProductToEdit={setProductToEdit}
        setProductToDelete={setProductToDelete}
      />
    </>
  )
}

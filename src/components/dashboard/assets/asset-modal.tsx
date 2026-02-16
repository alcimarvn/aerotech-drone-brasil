"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, PenSquare, Package, X, FileIcon, ImageIcon, Upload } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { asset_type } from "@prisma/client"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createAsset, updateAsset } from "@/app/actions/assets"
import { uploadFileAction } from "@/app/actions/upload"

const assetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.enum(["DRONE", "VEHICLE", "TRAILER", "BATTERY", "GENERATOR", "CONTROL", "OTHER"]),
    model: z.string().optional(),
    serialNumber: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val === "" ? null : Number(val)),
    status: z.string().min(1, "Status é obrigatório"),
    imageUrl: z.string().optional(),
    notes: z.string().optional()
})

type AssetValues = z.infer<typeof assetSchema>

interface AssetModalProps {
    asset?: any
    trigger?: React.ReactNode
}

export function AssetModal({ asset, trigger }: AssetModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [selectedDocs, setSelectedDocs] = useState<File[]>([])
    const router = useRouter()

    const isEditing = !!asset

    const form = useForm<any>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            name: "",
            type: "DRONE" as const,
            model: "",
            serialNumber: "",
            purchaseDate: "",
            purchasePrice: 0,
            status: "ACTIVE",
            imageUrl: "",
            notes: ""
        },
    })

    useEffect(() => {
        if (asset) {
            form.reset({
                name: asset.name,
                type: asset.type,
                model: asset.model || "",
                serialNumber: asset.serialNumber || "",
                purchaseDate: asset.purchaseDate ? format(new Date(asset.purchaseDate), "yyyy-MM-dd") : "",
                purchasePrice: asset.purchasePrice || 0,
                status: asset.status,
                notes: asset.notes || "",
                imageUrl: asset.imageUrl || ""
            })
        } else {
            form.reset({
                name: "",
                type: "DRONE" as const,
                model: "",
                serialNumber: "",
                purchaseDate: "",
                purchasePrice: 0,
                status: "ACTIVE",
                notes: "",
                imageUrl: ""
            })
            setSelectedImages([])
            setImagePreviews([])
            setSelectedDocs([])
        }
    }, [asset, form, isOpen])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files])

            files.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setSelectedDocs(prev => [...prev, ...files])
    }

    const removeDoc = (index: number) => {
        setSelectedDocs(prev => prev.filter((_, i) => i !== index))
    }

    async function onSubmit(values: any) {
        const validatedValues: AssetValues = values
        setIsLoading(true)
        try {
            // Upload Images
            const uploadedImages = []
            for (const file of selectedImages) {
                const formData = new FormData()
                formData.append("file", file)
                const result = await uploadFileAction(formData)
                if (result.success && result.url) {
                    uploadedImages.push({ url: result.url })
                }
            }

            // Upload Documents
            const uploadedDocs = []
            for (const file of selectedDocs) {
                const formData = new FormData()
                formData.append("file", file)
                const result = await uploadFileAction(formData)
                if (result.success && result.url) {
                    uploadedDocs.push({
                        name: file.name,
                        url: result.url,
                        type: file.name.split('.').pop()?.toUpperCase() || "FILE"
                    })
                }
            }

            const data: any = {
                ...values,
                purchaseDate: values.purchaseDate ? new Date(values.purchaseDate) : undefined,
                purchasePrice: values.purchasePrice || undefined,
                images: uploadedImages.length > 0 ? uploadedImages : undefined,
                documents: uploadedDocs.length > 0 ? uploadedDocs : undefined
            }

            let result
            if (isEditing && asset) {
                result = await updateAsset(asset.id, data)
            } else {
                result = await createAsset(data)
            }

            if (result.success) {
                toast.success(isEditing ? "Equipamento atualizado!" : "Equipamento criado!")
                setIsOpen(false)
                router.refresh()
                if (!isEditing) {
                    form.reset()
                    setSelectedImages([])
                    setImagePreviews([])
                    setSelectedDocs([])
                }
            } else {
                toast.error(result.error || "Erro ao salvar equipamento")
            }
        } catch (error) {
            console.error(error)
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <Plus className="h-4 w-4" /> Novo Equipamento
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        {isEditing ? "Editar Equipamento" : "Novo Equipamento"}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados do equipamento abaixo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Coluna 1: Dados Básicos */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Equipamento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Drone DJI Agras T40" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="DRONE">Drone</SelectItem>
                                                        <SelectItem value="VEHICLE">Veículo</SelectItem>
                                                        <SelectItem value="TRAILER">Reboque</SelectItem>
                                                        <SelectItem value="BATTERY">Bateria</SelectItem>
                                                        <SelectItem value="GENERATOR">Gerador</SelectItem>
                                                        <SelectItem value="CONTROL">Controle</SelectItem>
                                                        <SelectItem value="OTHER">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                                                        <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                                                        <SelectItem value="RETIRED">Aposentado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Modelo (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Agras T40" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="serialNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nº de Série (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: 123ABC456" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="purchaseDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de Compra</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purchasePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor (R$)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0,00"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Informações adicionais..."
                                                    className="resize-none h-20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Coluna 2: Mídia e Documentos */}
                            <div className="space-y-6">
                                {/* Fotos */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-slate-500" /> Fotos
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="aspect-square relative rounded-md overflow-hidden border bg-slate-50 group">
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('multi-image-upload')?.click()}
                                            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                                        >
                                            <Upload className="w-6 h-6 text-slate-400 mb-1" />
                                            <span className="text-[10px] text-slate-500">Adicionar</span>
                                        </button>
                                    </div>
                                    <input
                                        id="multi-image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {/* Documentos */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <FileIcon className="w-4 h-4 text-slate-500" /> Documentos (Manuais, Notas, etc.)
                                    </Label>
                                    <div className="space-y-2">
                                        {selectedDocs.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 border rounded-md text-sm">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileIcon className="w-4 h-4 text-slate-400" />
                                                    <span className="truncate">{doc.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDoc(index)}
                                                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-dashed border-slate-300 text-slate-500"
                                            onClick={() => document.getElementById('doc-upload')?.click()}
                                        >
                                            <Upload className="w-4 h-4 mr-2" /> Anexar Documento
                                        </Button>
                                    </div>
                                    <input
                                        id="doc-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleDocChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Salvar Alterações" : "Criar Equipamento"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

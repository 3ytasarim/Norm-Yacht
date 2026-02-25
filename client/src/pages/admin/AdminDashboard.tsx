import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { SliderItem, Service, Project, NewsItem, ContactMessage } from "@shared/schema";
import logoPath from "@assets/43219e59-fadc-46c1-b45c-d18f3e4cce0a_1772014162879.jpg";
import {
  LayoutDashboard, Image, Wrench, FolderOpen, Newspaper, Mail, LogOut,
  Plus, Pencil, Trash2, Eye, Menu, X, Check, ChevronDown, ChevronRight
} from "lucide-react";

function useAdminAuth() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !(data as any)?.isAdmin) {
      navigate("/admin");
    }
  }, [data, isLoading, navigate]);

  const logout = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      navigate("/admin");
    },
  });

  return { isAdmin: !!(data as any)?.isAdmin, isLoading, logout };
}

function SliderManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery<SliderItem[]>({ queryKey: ["/api/slider"] });
  const [editItem, setEditItem] = useState<SliderItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "", titleTr: "", titleRu: "",
    subtitle: "", subtitleTr: "", subtitleRu: "",
    buttonText: "", buttonTextTr: "", buttonTextRu: "",
    buttonLink: "", rightImage: "", bgColor: "#0a1428", order: 0, active: true,
  });

  const openEdit = (item: SliderItem) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: "", titleTr: "", titleRu: "", subtitle: "", subtitleTr: "", subtitleRu: "", buttonText: "", buttonTextTr: "", buttonTextRu: "", buttonLink: "", rightImage: "", bgColor: "#0a1428", order: items.length, active: true });
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data: any) => editItem
      ? apiRequest("PUT", `/api/slider/${editItem.id}`, data)
      : apiRequest("POST", "/api/slider", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider"] });
      setShowForm(false);
      toast({ title: "Success", description: "Slider item saved." });
    },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/slider/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider"] });
      toast({ title: "Deleted", description: "Slider item removed." });
    },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Slider Management</h2>
        <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={openAdd} data-testid="button-add-slider">
          <Plus className="mr-2 w-4 h-4" /> Add Slide
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm" data-testid={`row-slider-${item.id}`}>
            {item.rightImage && (
              <img src={item.rightImage} alt="" className="w-20 h-14 rounded-md object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{item.title}</div>
              <div className="text-sm text-gray-500 truncate">{item.subtitle}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={item.active ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-500 border-0"}>
                  {item.active ? "Active" : "Inactive"}
                </Badge>
                <span className="text-xs text-gray-400">Order: {item.order}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)} data-testid={`button-edit-slider-${item.id}`}>
                <Pencil className="w-4 h-4 text-gray-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => { if (confirm("Delete this slide?")) deleteMutation.mutate(item.id); }}
                data-testid={`button-delete-slider-${item.id}`}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-gray-500">No slider items yet.</div>}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Slide" : "Add New Slide"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (EN) *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} data-testid="input-slider-title" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (TR)</Label>
              <Input value={formData.titleTr || ""} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (RU)</Label>
              <Input value={formData.titleRu || ""} onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Subtitle (EN)</Label>
              <Textarea rows={2} value={formData.subtitle || ""} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Subtitle (TR)</Label>
              <Textarea rows={2} value={formData.subtitleTr || ""} onChange={(e) => setFormData({ ...formData, subtitleTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Subtitle (RU)</Label>
              <Textarea rows={2} value={formData.subtitleRu || ""} onChange={(e) => setFormData({ ...formData, subtitleRu: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Button Text (EN)</Label>
              <Input value={formData.buttonText || ""} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Button Link</Label>
              <Input value={formData.buttonLink || ""} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} placeholder="/services" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Button Text (TR)</Label>
              <Input value={formData.buttonTextTr || ""} onChange={(e) => setFormData({ ...formData, buttonTextTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Button Text (RU)</Label>
              <Input value={formData.buttonTextRu || ""} onChange={(e) => setFormData({ ...formData, buttonTextRu: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Right Image URL</Label>
              <Input value={formData.rightImage || ""} onChange={(e) => setFormData({ ...formData, rightImage: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.bgColor || "#0a1428"} onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer" />
                <Input value={formData.bgColor || "#0a1428"} onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!formData.active} onCheckedChange={(v) => setFormData({ ...formData, active: v })} />
              <Label className="font-semibold">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold"
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
              data-testid="button-save-slider"
            >
              {saveMutation.isPending ? "Saving..." : "Save Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServicesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const [editItem, setEditItem] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [imageUrl, setImageUrl] = useState("");

  const openEdit = (s: Service) => {
    setEditItem(s);
    setFormData({ ...s });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: "", titleTr: "", titleRu: "", slug: "", description: "", descriptionTr: "", descriptionRu: "", icon: "Wrench", order: services.length, active: true });
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data: any) => editItem
      ? apiRequest("PUT", `/api/services/${editItem.id}`, data)
      : apiRequest("POST", "/api/services", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/services"] }); setShowForm(false); toast({ title: "Success", description: "Service saved." }); },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/services/${id}`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/services"] }); toast({ title: "Deleted" }); },
  });

  const addImageMutation = useMutation({
    mutationFn: ({ id, url }: { id: number; url: string }) => apiRequest("POST", `/api/services/${id}/images`, { imageUrl: url }),
    onSuccess: () => { toast({ title: "Image added" }); setImageUrl(""); },
  });

  const iconOptions = ["Wrench", "Waves", "Navigation", "Settings", "Activity", "Gauge", "Hammer", "Zap", "Cog", "Anchor"];

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Services Management</h2>
        <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={openAdd} data-testid="button-add-service">
          <Plus className="mr-2 w-4 h-4" /> Add Service
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm" data-testid={`row-service-${s.id}`}>
            <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{s.title}</div>
              <div className="text-sm text-gray-500 truncate">{s.description?.substring(0, 80)}...</div>
              <div className="text-xs text-gray-400 mt-1">/{s.slug} · Order: {s.order}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(s)} data-testid={`button-edit-service-${s.id}`}>
                <Pencil className="w-4 h-4 text-gray-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(s.id); }} data-testid={`button-delete-service-${s.id}`}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (EN) *</Label>
              <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} data-testid="input-service-title" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Slug *</Label>
              <Input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="my-service" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (TR)</Label>
              <Input value={formData.titleTr || ""} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (RU)</Label>
              <Input value={formData.titleRu || ""} onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (EN)</Label>
              <Textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (TR)</Label>
              <Textarea rows={3} value={formData.descriptionTr || ""} onChange={(e) => setFormData({ ...formData, descriptionTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (RU)</Label>
              <Textarea rows={3} value={formData.descriptionRu || ""} onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Icon</Label>
              <Select value={formData.icon || "Wrench"} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
            </div>
            {editItem && (
              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Add Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    data-testid="input-service-image-url"
                  />
                  <Button
                    variant="outline"
                    onClick={() => imageUrl && addImageMutation.mutate({ id: editItem.id, url: imageUrl })}
                    disabled={addImageMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold"
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
              data-testid="button-save-service"
            >
              {saveMutation.isPending ? "Saving..." : "Save Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [imageUrl, setImageUrl] = useState("");

  const openEdit = (p: Project) => { setEditItem(p); setFormData({ ...p }); setShowForm(true); };
  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: "", titleTr: "", titleRu: "", slug: "", description: "", descriptionTr: "", descriptionRu: "", status: "completed", category: "", client: "", completionDate: "", mainImage: "", order: projects.length });
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data: any) => editItem
      ? apiRequest("PUT", `/api/projects/${editItem.id}`, data)
      : apiRequest("POST", "/api/projects", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); setShowForm(false); toast({ title: "Success" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/projects/${id}`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); toast({ title: "Deleted" }); },
  });

  const addImageMutation = useMutation({
    mutationFn: ({ id, url }: { id: number; url: string }) => apiRequest("POST", `/api/projects/${id}/images`, { imageUrl: url }),
    onSuccess: () => { toast({ title: "Image added" }); setImageUrl(""); },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">Projects Management</h2>
        <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={openAdd} data-testid="button-add-project">
          <Plus className="mr-2 w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm" data-testid={`row-project-${p.id}`}>
            {p.mainImage && <img src={p.mainImage} alt="" className="w-20 h-14 rounded-md object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{p.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={p.status === "completed" ? "bg-green-100 text-green-700 border-0" : "bg-orange-100 text-orange-700 border-0"}>
                  {p.status}
                </Badge>
                {p.client && <span className="text-xs text-gray-400">{p.client}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(p)} data-testid={`button-edit-project-${p.id}`}>
                <Pencil className="w-4 h-4 text-gray-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(p.id); }} data-testid={`button-delete-project-${p.id}`}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (EN) *</Label>
              <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} data-testid="input-project-title" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Slug *</Label>
              <Input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (TR)</Label>
              <Input value={formData.titleTr || ""} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (RU)</Label>
              <Input value={formData.titleRu || ""} onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (EN)</Label>
              <Textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (TR)</Label>
              <Textarea rows={3} value={formData.descriptionTr || ""} onChange={(e) => setFormData({ ...formData, descriptionTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (RU)</Label>
              <Textarea rows={3} value={formData.descriptionRu || ""} onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status</Label>
              <Select value={formData.status || "completed"} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</Label>
              <Input value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Client</Label>
              <Input value={formData.client || ""} onChange={(e) => setFormData({ ...formData, client: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Completion Date</Label>
              <Input value={formData.completionDate || ""} onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })} placeholder="2024-12" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Main Image URL</Label>
              <Input value={formData.mainImage || ""} onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })} placeholder="https://..." />
            </div>
            {editItem && (
              <div className="sm:col-span-2">
                <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Add Extra Image URL</Label>
                <div className="flex gap-2">
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." data-testid="input-project-image-url" />
                  <Button variant="outline" onClick={() => imageUrl && addImageMutation.mutate({ id: editItem.id, url: imageUrl })} disabled={addImageMutation.isPending}>Add</Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} data-testid="button-save-project">
              {saveMutation.isPending ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({ queryKey: ["/api/news"] });
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const openEdit = (item: NewsItem) => { setEditItem(item); setFormData({ ...item, tags: item.tags ? item.tags.join(", ") : "" }); setShowForm(true); };
  const openAdd = () => {
    setEditItem(null);
    setFormData({ title: "", titleTr: "", titleRu: "", slug: "", content: "", contentTr: "", contentRu: "", excerpt: "", author: "Norm Yacht", tags: "", image: "" });
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data, tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [] };
      return editItem
        ? apiRequest("PUT", `/api/news/${editItem.id}`, payload)
        : apiRequest("POST", "/api/news", payload);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/news"] }); setShowForm(false); toast({ title: "Success" }); },
    onError: () => toast({ title: "Error", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/news/${id}`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/news"] }); toast({ title: "Deleted" }); },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">News Management</h2>
        <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={openAdd} data-testid="button-add-news">
          <Plus className="mr-2 w-4 h-4" /> Add Article
        </Button>
      </div>

      <div className="space-y-3">
        {newsItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm" data-testid={`row-news-${item.id}`}>
            {item.image && <img src={item.image} alt="" className="w-20 h-14 rounded-md object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{item.title}</div>
              <div className="text-sm text-gray-500 truncate">{item.excerpt?.substring(0, 80)}...</div>
              <div className="text-xs text-gray-400 mt-1">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""} · {item.author}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)} data-testid={`button-edit-news-${item.id}`}>
                <Pencil className="w-4 h-4 text-gray-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item.id); }} data-testid={`button-delete-news-${item.id}`}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Article" : "Add Article"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (EN) *</Label>
              <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} data-testid="input-news-title" />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Slug *</Label>
              <Input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (TR)</Label>
              <Input value={formData.titleTr || ""} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title (RU)</Label>
              <Input value={formData.titleRu || ""} onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Excerpt</Label>
              <Textarea rows={2} value={formData.excerpt || ""} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Content (EN) - HTML supported</Label>
              <Textarea rows={6} value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Content (TR)</Label>
              <Textarea rows={4} value={formData.contentTr || ""} onChange={(e) => setFormData({ ...formData, contentTr: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Content (RU)</Label>
              <Textarea rows={4} value={formData.contentRu || ""} onChange={(e) => setFormData({ ...formData, contentRu: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Author</Label>
              <Input value={formData.author || ""} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tags (comma-separated)</Label>
              <Input value={formData.tags || ""} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Marine, Hydraulics" data-testid="input-news-tags" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image URL</Label>
              <Input value={formData.image || ""} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} data-testid="button-save-news">
              {saveMutation.isPending ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessagesManager() {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact/messages"] });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/contact/messages/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] }),
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 mb-6">Contact Messages ({messages.length})</h2>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-5 rounded-lg border shadow-sm ${msg.read ? "bg-gray-50 border-gray-100" : "bg-white border-[#F5A623]/30"}`} data-testid={`row-message-${msg.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">{msg.name}</span>
                  {!msg.read && <Badge className="bg-[#F5A623] text-white text-xs border-0">New</Badge>}
                  <span className="text-xs text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <a href={`mailto:${msg.email}`} className="text-[#F5A623] hover:underline">{msg.email}</a>
                  {msg.phone && <span className="ml-3">{msg.phone}</span>}
                </div>
                {msg.subject && <div className="text-sm font-semibold text-gray-700 mb-2">{msg.subject}</div>}
                <div className="text-sm text-gray-600 leading-relaxed">{msg.message}</div>
              </div>
              {!msg.read && (
                <Button size="sm" variant="outline" onClick={() => markReadMutation.mutate(msg.id)} data-testid={`button-mark-read-${msg.id}`}>
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-center py-12 text-gray-500">No messages yet.</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin, isLoading, logout } = useAdminAuth();
  const [tab, setTab] = useState("slider");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard - Norm Yacht";
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!isAdmin) return null;

  const navItems = [
    { id: "slider", label: "Slider", icon: Image },
    { id: "services", label: "Services", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "news", label: "News", icon: Newspaper },
    { id: "messages", label: "Messages", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a1428] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/10">
            <img src={logoPath} alt="Norm Yacht" className="h-10 w-auto object-contain brightness-0 invert" />
            <div className="text-xs text-gray-500 mt-2 font-semibold uppercase tracking-wider">Admin Panel</div>
          </div>
          <nav className="flex-1 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors ${tab === item.id ? "bg-[#F5A623]/20 text-[#F5A623] border-r-2 border-[#F5A623]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  data-testid={`nav-admin-${item.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => logout.mutate()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-admin-sidebar-toggle"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-black text-gray-900">{navItems.find((n) => n.id === tab)?.label}</h1>
            <div className="text-xs text-gray-500">Norm Yacht Admin Panel</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {tab === "slider" && <SliderManager />}
          {tab === "services" && <ServicesManager />}
          {tab === "projects" && <ProjectsManager />}
          {tab === "news" && <NewsManager />}
          {tab === "messages" && <MessagesManager />}
        </div>
      </div>
    </div>
  );
}

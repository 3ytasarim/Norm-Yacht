import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import {
  users, sliderItems, services, serviceImages, projects, projectImages, newsItems, contactMessages,
  type User, type InsertUser,
  type SliderItem, type InsertSliderItem,
  type Service, type InsertService,
  type ServiceImage, type InsertServiceImage,
  type Project, type InsertProject,
  type ProjectImage, type InsertProjectImage,
  type NewsItem, type InsertNewsItem,
  type ContactMessage, type InsertContactMessage,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Slider
  getSliderItems(): Promise<SliderItem[]>;
  getSliderItem(id: number): Promise<SliderItem | undefined>;
  createSliderItem(item: InsertSliderItem): Promise<SliderItem>;
  updateSliderItem(id: number, item: Partial<InsertSliderItem>): Promise<SliderItem | undefined>;
  deleteSliderItem(id: number): Promise<void>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<void>;
  getServiceImages(serviceId: number): Promise<ServiceImage[]>;
  addServiceImage(image: InsertServiceImage): Promise<ServiceImage>;
  deleteServiceImage(id: number): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
  getProjectImages(projectId: number): Promise<ProjectImage[]>;
  addProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  deleteProjectImage(id: number): Promise<void>;

  // News
  getNewsItems(): Promise<NewsItem[]>;
  getNewsItem(id: number): Promise<NewsItem | undefined>;
  getNewsItemBySlug(slug: string): Promise<NewsItem | undefined>;
  createNewsItem(item: InsertNewsItem): Promise<NewsItem>;
  updateNewsItem(id: number, item: Partial<InsertNewsItem>): Promise<NewsItem | undefined>;
  deleteNewsItem(id: number): Promise<void>;

  // Contact
  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markContactMessageRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSliderItems(): Promise<SliderItem[]> {
    return db.select().from(sliderItems).orderBy(asc(sliderItems.order));
  }

  async getSliderItem(id: number): Promise<SliderItem | undefined> {
    const [item] = await db.select().from(sliderItems).where(eq(sliderItems.id, id));
    return item;
  }

  async createSliderItem(item: InsertSliderItem): Promise<SliderItem> {
    const [created] = await db.insert(sliderItems).values(item).returning();
    return created;
  }

  async updateSliderItem(id: number, item: Partial<InsertSliderItem>): Promise<SliderItem | undefined> {
    const [updated] = await db.update(sliderItems).set(item).where(eq(sliderItems.id, id)).returning();
    return updated;
  }

  async deleteSliderItem(id: number): Promise<void> {
    await db.delete(sliderItems).where(eq(sliderItems.id, id));
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.order));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(serviceImages).where(eq(serviceImages.serviceId, id));
    await db.delete(services).where(eq(services.id, id));
  }

  async getServiceImages(serviceId: number): Promise<ServiceImage[]> {
    return db.select().from(serviceImages).where(eq(serviceImages.serviceId, serviceId)).orderBy(asc(serviceImages.order));
  }

  async addServiceImage(image: InsertServiceImage): Promise<ServiceImage> {
    const [created] = await db.insert(serviceImages).values(image).returning();
    return created;
  }

  async deleteServiceImage(id: number): Promise<void> {
    await db.delete(serviceImages).where(eq(serviceImages.id, id));
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(asc(projects.order));
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.status, status)).orderBy(asc(projects.order));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projectImages).where(eq(projectImages.projectId, id));
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProjectImages(projectId: number): Promise<ProjectImage[]> {
    return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(asc(projectImages.order));
  }

  async addProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const [created] = await db.insert(projectImages).values(image).returning();
    return created;
  }

  async deleteProjectImage(id: number): Promise<void> {
    await db.delete(projectImages).where(eq(projectImages.id, id));
  }

  async getNewsItems(): Promise<NewsItem[]> {
    return db.select().from(newsItems).orderBy(desc(newsItems.publishedAt));
  }

  async getNewsItem(id: number): Promise<NewsItem | undefined> {
    const [item] = await db.select().from(newsItems).where(eq(newsItems.id, id));
    return item;
  }

  async getNewsItemBySlug(slug: string): Promise<NewsItem | undefined> {
    const [item] = await db.select().from(newsItems).where(eq(newsItems.slug, slug));
    return item;
  }

  async createNewsItem(item: InsertNewsItem): Promise<NewsItem> {
    const [created] = await db.insert(newsItems).values(item).returning();
    return created;
  }

  async updateNewsItem(id: number, item: Partial<InsertNewsItem>): Promise<NewsItem | undefined> {
    const [updated] = await db.update(newsItems).set(item).where(eq(newsItems.id, id)).returning();
    return updated;
  }

  async deleteNewsItem(id: number): Promise<void> {
    await db.delete(newsItems).where(eq(newsItems.id, id));
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(msg).returning();
    return created;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markContactMessageRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
  }
}

export const storage = new DatabaseStorage();

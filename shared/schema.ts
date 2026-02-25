import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sliderItems = pgTable("slider_items", {
  id: serial("id").primaryKey(),
  bgColor: text("bg_color").default("#0f1f3d"),
  title: text("title").notNull(),
  titleTr: text("title_tr"),
  titleRu: text("title_ru"),
  subtitle: text("subtitle"),
  subtitleTr: text("subtitle_tr"),
  subtitleRu: text("subtitle_ru"),
  buttonText: text("button_text"),
  buttonTextTr: text("button_text_tr"),
  buttonTextRu: text("button_text_ru"),
  buttonLink: text("button_link"),
  rightImage: text("right_image"),
  bgImage: text("bg_image"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleTr: text("title_tr"),
  titleRu: text("title_ru"),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionTr: text("description_tr"),
  descriptionRu: text("description_ru"),
  icon: text("icon").default("Wrench"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
});

export const serviceImages = pgTable("service_images", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleTr: text("title_tr"),
  titleRu: text("title_ru"),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionTr: text("description_tr"),
  descriptionRu: text("description_ru"),
  status: text("status").notNull().default("completed"),
  category: text("category"),
  client: text("client"),
  completionDate: text("completion_date"),
  mainImage: text("main_image"),
  order: integer("order").default(0),
});

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
});

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleTr: text("title_tr"),
  titleRu: text("title_ru"),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  contentTr: text("content_tr"),
  contentRu: text("content_ru"),
  excerpt: text("excerpt"),
  excerptTr: text("excerpt_tr"),
  excerptRu: text("excerpt_ru"),
  author: text("author").default("Norm Yacht"),
  tags: text("tags").array(),
  image: text("image"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export const insertSliderItemSchema = createInsertSchema(sliderItems).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertServiceImageSchema = createInsertSchema(serviceImages).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertProjectImageSchema = createInsertSchema(projectImages).omit({ id: true });
export const insertNewsItemSchema = createInsertSchema(newsItems).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true, read: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SliderItem = typeof sliderItems.$inferSelect;
export type InsertSliderItem = z.infer<typeof insertSliderItemSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ServiceImage = typeof serviceImages.$inferSelect;
export type InsertServiceImage = z.infer<typeof insertServiceImageSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = z.infer<typeof insertProjectImageSchema>;
export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

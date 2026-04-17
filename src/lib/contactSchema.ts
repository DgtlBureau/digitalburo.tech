import { z } from "zod";

export const ContactPayloadSchema = z.object({
  name: z.string().min(2, "Укажите имя").max(100),
  contact: z.string().min(3, "Email или телефон обязательны").max(200),
  message: z.string().min(10, "Опишите задачу подробнее").max(5000),
  source: z.string().min(1).max(50),
  // honeypot — must be empty
  company_website: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

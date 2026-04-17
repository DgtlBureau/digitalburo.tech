"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContactPayloadSchema, type ContactPayload } from "@/lib/contactSchema";

// zodResolver typing trips on zod v4 minor mismatch — runtime is fine.
const contactResolver = zodResolver(
  ContactPayloadSchema as unknown as Parameters<typeof zodResolver>[0],
) as unknown as Resolver<ContactPayload>;

export function ContactForm({ source = "home" }: { source?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    resolver: contactResolver,
    defaultValues: { name: "", contact: "", message: "", source, company_website: "" },
  });

  async function onSubmit(values: ContactPayload) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Заявка отправлена. Ответим в течение дня.");
      reset({ source, company_website: "" });
    } catch (error) {
      console.error(error);
      toast.error("Не удалось отправить. Напишите нам на access@digitalburo.tech.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Имя</Label>
        <Input id="name" placeholder="Виталий" {...register("name")} />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Email или телефон</Label>
        <Input
          id="contact"
          placeholder="you@club.ru или +7 ..."
          {...register("contact")}
        />
        {errors.contact ? (
          <p className="text-xs text-destructive">{errors.contact.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">О задаче</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Коротко опишите, чем можем помочь"
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>
      {/* Honeypot — hidden from users, bots fill it */}
      <div aria-hidden className="hidden">
        <Label htmlFor="company_website">Website</Label>
        <Input id="company_website" tabIndex={-1} autoComplete="off" {...register("company_website")} />
      </div>
      <input type="hidden" {...register("source")} />
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Отправляем..." : "Отправить заявку"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Нажимая «Отправить», вы соглашаетесь с{" "}
        <a href="/policy" className="underline hover:text-foreground">
          политикой обработки персональных данных
        </a>
        .
      </p>
    </form>
  );
}

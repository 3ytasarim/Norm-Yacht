import { useEffect } from "react";
import { updateSEO, getSEOData } from "@/lib/seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

type ContactForm = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export default function Contact() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { toast } = useToast();

  useEffect(() => {
    updateSEO(getSEOData("contact", language));
  }, [language]);

  const contactSchema = z.object({
    name: z.string().min(2, t.contact.validationName),
    email: z.string().email(t.contact.validationEmail),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, t.contact.validationMessage),
  });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({ title: t.contact.successTitle, description: t.contact.success });
      form.reset();
    },
    onError: () => {
      toast({ title: t.contact.errorTitle, description: t.contact.error, variant: "destructive" });
    },
  });

  const onSubmit = (data: ContactForm) => mutation.mutate(data);

  const contactInfo = [
    {
      icon: MapPin,
      label: t.contact.address,
      value: "İstasyon Mahallesi Yarış Çıkmazı Sokak, İstim Sanayi Sitesi No 17/153, Tuzla, İstanbul",
    },
    {
      icon: Phone,
      label: t.contact.phone_label,
      value: "0216 510 66 76",
      href: "tel:+902165106676",
    },
    {
      icon: Mail,
      label: t.contact.email_label,
      value: "info@normyacht.com.tr",
      href: "mailto:info@normyacht.com.tr",
    },
    {
      icon: Clock,
      label: t.contact.workingHours,
      value: t.contact.workingHoursValue,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0a1428] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">{t.contact.label}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.contact.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.contact.subtitle}</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8">{t.contact.contactInfo}</h2>
              <div className="space-y-6 mb-10">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#F5A623]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{info.label}</div>
                        {info.href ? (
                          <a href={info.href} className="text-gray-800 font-medium hover:text-[#F5A623] transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-gray-800 font-medium leading-relaxed">{info.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-md h-72">
                <iframe
                  src="https://maps.google.com/maps?q=%C4%B0stim+Sanayi+Sitesi+Tuzla+%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Norm Yacht Location Map"
                />
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8">{t.contact.sendMessage}</h2>
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold">{t.contact.name} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t.contact.name} {...field} data-testid="input-contact-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold">{t.contact.email} *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder={t.contact.email} {...field} data-testid="input-contact-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold">{t.contact.phone}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.contact.phone} {...field} data-testid="input-contact-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold">{t.contact.subject}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.contact.subject} {...field} data-testid="input-contact-subject" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">{t.contact.message} *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.contact.message}
                              rows={5}
                              {...field}
                              data-testid="input-contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold"
                      disabled={mutation.isPending}
                      data-testid="button-contact-submit"
                    >
                      {mutation.isPending ? (
                        t.contact.sending
                      ) : (
                        <>
                          <Send className="mr-2 w-4 h-4" />
                          {t.contact.send}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

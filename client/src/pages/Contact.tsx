import { useEffect } from "react";
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

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Contact Us - Norm Yacht";
  }, []);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({ title: "Success", description: t.contact.success });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: t.contact.error, variant: "destructive" });
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
          <div className="text-[#F5A623] font-bold text-sm uppercase tracking-widest mb-3">Get In Touch</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.contact.title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">{t.contact.subtitle}</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8">Contact Information</h2>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.8741447748204!2d29.28!3d40.854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDUxJzE0LjQiTiAyOcKwMTYnNDguMCJF!5e0!3m2!1sen!2str!4v1620000000000!5m2!1sen!2str"
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
              <h2 className="text-2xl font-black text-gray-900 mb-8">Send Us a Message</h2>
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

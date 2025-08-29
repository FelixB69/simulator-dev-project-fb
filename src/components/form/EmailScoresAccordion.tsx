"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react"; // si tu l’as déjà dans le projet
import { useRouter } from "next/navigation";

type ApiItem = {
  id: string;
  input: {
    location: string;
    total_xp: number;
    compensation: number;
    email: string;
  };
};
type FormValues = { email: string };

export default function EmailScoresAccordion() {
  const [results, setResults] = useState<ApiItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async ({ email }: FormValues) => {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/scores/email?email=${encodeURIComponent(
          email,
        )}`,
        { headers: { "Content-Type": "application/json" } },
      );
      if (!res.ok) throw new Error("GET failed");
      const data: ApiItem[] = await res.json();
      data.sort(
        (a, b) =>
          b.input.compensation - a.input.compensation ||
          b.input.total_xp - a.input.total_xp,
      );
      setResults(data);
    } catch (e) {
      console.error(e);
      console.log("ERR", e);
      setResults([]);
      alert("Erreur lors de la récupération des résultats.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !form.watch("email") || !!form.formState.errors.email;

  const email = form.watch("email");
  return (
    <div className="relative z-10 py-6">
      <section className="w-full min-w-2xl mx-auto">
        <Accordion
          type="single"
          collapsible
          className="w-full bg-white rounded-[var(--radius)] shadow-xl ring-1 ring-black/5"
        >
          <AccordionItem
            value="email"
            className="bg-white rounded-[var(--radius)] border border-gray-100 overflow-hidden"
          >
            {/* Trigger */}
            <AccordionTrigger
              className={cn(
                "group flex w-full items-center justify-between gap-3 cursor-pointer",
                "px-4 py-3 sm:px-5 sm:py-4 text-left",
                "font-medium text-[var(--blue)]",
                "bg-white hover:bg-gray-50 focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              )}
            >
              <span>Rechercher des scores par email</span>
              {/* chevron qui pivote */}
            </AccordionTrigger>

            {/* Content animé */}
            <AccordionContent
              className={cn("overflow-hidden bg-white", "px-4 sm:px-6")}
            >
              {/* Form */}
              {results === null && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Email requis",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Format d'email invalide",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[var(--gray-dark)]">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="votre.email@exemple.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset({ email: "" })}
                        className="cursor-pointer"
                      >
                        Réinitialiser
                      </Button>
                      <Button
                        type="submit"
                        disabled={isDisabled}
                        className={cn(
                          "bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white cursor-pointer",
                          "shadow-sm hover:shadow transition-shadow",
                          isDisabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {loading ? "Recherche..." : "Voir les scores"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {/* Loading skeleton */}
              {loading && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-lg border border-gray-100 p-4 bg-gray-50"
                    >
                      <div className="h-5 w-1/3 bg-gray-200 rounded mb-3" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {results !== null && !loading && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--blue)]">
                      {email ?? ""}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setResults(null)}
                      className="text-[var(--blue)] cursor-pointer"
                    >
                      Chercher un autre email
                    </Button>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-[var(--gray-dark)]">
                      Aucun résultat pour cet email.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map(({ id, input }) => (
                        <div
                          key={id}
                          role="button"
                          className={cn(
                            "group block rounded-lg border border-gray-100 bg-white p-4",
                            "shadow-sm hover:shadow-lg transition-all duration-300",
                            "hover:border-[var(--blue)]/20 hover:translate-y-[-2px]",
                            "hover:bg-gray-50",
                            "focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-[var(--blue)]",
                            "cursor-pointer",
                          )}
                          onClick={() => router.push(`/scores/${id}`)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="mt-1 text-xl font-bold text-[var(--gray)] group-hover:text-[var(--blue)] transition-colors duration-300">
                                {input.location}
                              </div>
                            </div>
                            <span className="rounded-full px-2.5 mt-2 text-l font-medium bg-[var(--gray-light)] text-[var(--blue)] group-hover:bg-[var(--blue)]/10 transition-colors duration-300">
                              {input.total_xp} an
                              {input.total_xp > 1 ? "s" : ""} d'expérience
                            </span>
                          </div>

                          <div className="mt-3 text-[var(--blue)]">
                            <span className="text-xl font-semibold group-hover:text-[var(--blue)]/80 transition-colors duration-300">
                              {input.compensation.toLocaleString("fr-FR")} €
                            </span>{" "}
                            <span className="text-sm opacity-80">
                              brut annuel
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

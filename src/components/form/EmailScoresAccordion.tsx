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
      {/* Container */}
      <section className="mx-auto w-full max-w-4xl  min-w-[350px] sm:min-w-2xl">
        <Accordion
          type="single"
          collapsible
          className="bg-white rounded-[var(--radius)] shadow-xl ring-1 ring-black/5"
        >
          <AccordionItem
            value="email"
            className="bg-white rounded-[var(--radius)] border border-gray-100 overflow-hidden"
          >
            {/* Trigger */}
            <AccordionTrigger
              className={cn(
                "group flex w-full items-center justify-between gap-2 cursor-pointer",
                "px-3 py-2 sm:px-5 sm:py-4 text-left", // mobile plus compact
                "font-medium text-[var(--blue)] text-sm sm:text-base", // typo + petite en mobile
                "bg-white hover:bg-gray-50 focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              )}
            >
              <span>Rechercher des scores par email</span>
            </AccordionTrigger>

            {/* Content */}
            <AccordionContent className="overflow-hidden bg-white px-3 pb-3 sm:px-6 sm:pb-6">
              {results === null && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-4"
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
                          <FormLabel className="text-[var(--gray-dark)] text-sm sm:text-base">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="votre.email@exemple.com"
                              className="h-9 sm:h-11 text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Boutons -> stack en mobile */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset({ email: "" })}
                        className="order-2 sm:order-1 w-full sm:w-auto"
                      >
                        Réinitialiser
                      </Button>
                      <Button
                        type="submit"
                        disabled={isDisabled}
                        className={cn(
                          "order-1 sm:order-2 w-full sm:w-auto",
                          "bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white",
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

              {/* Skeleton responsive */}
              {loading && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-lg border border-gray-100 p-3 sm:p-4 bg-gray-50"
                    >
                      <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Résultats */}
              {results !== null && !loading && (
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between">
                    <h3 className="text-sm sm:text-lg font-semibold text-[var(--blue)] break-words">
                      {email ?? ""}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setResults(null)}
                      className="text-[var(--blue)] w-full sm:w-auto"
                    >
                      Chercher un autre email
                    </Button>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-[var(--gray-dark)] text-sm sm:text-base">
                      Aucun résultat pour cet email.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {results.map(({ id, input }) => (
                        <div
                          key={id}
                          className={cn(
                            "block rounded-lg border border-gray-100 bg-white p-3 sm:p-4",
                            "shadow-sm hover:shadow-lg transition-all duration-300",
                            "hover:border-[var(--blue)]/20 hover:-translate-y-0.5",
                            "cursor-pointer",
                          )}
                          onClick={() => router.push(`/scores/${id}`)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-md sm:text-base font-bold text-[var(--gray)] truncate">
                              {input.location}
                            </div>
                            <span className="rounded-full px-2 py-0.5 text-xs sm:text-sm bg-[var(--gray-light)] text-[var(--blue)]">
                              {input.total_xp} an{input.total_xp > 1 ? "s" : ""}{" "}
                              d'expérience
                            </span>
                          </div>
                          <div className="mt-2 text-[var(--blue)]">
                            <span className="text-base sm:text-xl font-semibold">
                              {input.compensation.toLocaleString("fr-FR")} €
                            </span>{" "}
                            <span className="text-xs sm:text-sm opacity-80">
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
